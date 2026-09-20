import {readFile} from 'node:fs/promises'
import {fileURLToPath, pathToFileURL} from 'node:url'

export const CATALOG_TYPES = ['category', 'instructor', 'lesson', 'course']
export const EXPECTED_COUNTS = {category: 6, instructor: 5, lesson: 120, course: 10}

const seedPath = fileURLToPath(new URL('./seed.ndjson', import.meta.url))
const videosPath = fileURLToPath(new URL('./videos.json', import.meta.url))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function youtubeId(value) {
  try {
    const url = new URL(value)
    return url.hostname === 'www.youtube.com' && url.pathname === '/watch'
      ? url.searchParams.get('v')
      : null
  } catch {
    return null
  }
}

function collectReferences(value, references = []) {
  if (Array.isArray(value)) {
    for (const child of value) collectReferences(child, references)
  } else if (value && typeof value === 'object') {
    if (value._type === 'reference' && typeof value._ref === 'string') references.push(value._ref)
    for (const child of Object.values(value)) collectReferences(child, references)
  }
  return references
}

function validateArrayKeys(value, path = '$') {
  if (Array.isArray(value)) {
    const objectEntries = value.filter((entry) => entry && typeof entry === 'object')
    if (objectEntries.length > 0) {
      const keys = objectEntries.map((entry) => entry._key)
      assert(keys.every((key) => typeof key === 'string' && key.length > 0), `Missing _key in ${path}`)
      assert(new Set(keys).size === keys.length, `Duplicate _key in ${path}`)
    }
    value.forEach((entry, index) => validateArrayKeys(entry, `${path}[${index}]`))
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) validateArrayKeys(child, `${path}.${key}`)
  }
}

function validatePortableText(value, label) {
  assert(Array.isArray(value) && value.length > 0, `Missing Portable Text in ${label}`)
  assert(value.every((block) => block?._type === 'block'), `Invalid Portable Text in ${label}`)
}

function validateImage(value, label, storedAssets) {
  assert(value?._type === 'image', `Invalid image in ${label}`)
  assert(typeof value.alt === 'string' && value.alt.trim().length >= 3, `Missing image alt text in ${label}`)
  if (storedAssets) {
    assert(/^image-[a-zA-Z0-9]+-\d+x\d+-[a-z0-9]+$/.test(value.asset?._ref ?? ''), `Missing stored image asset in ${label}`)
  } else {
    assert(/^image@https:\/\//.test(value._sanityAsset ?? ''), `Missing image import directive in ${label}`)
  }
}

export async function readFixture() {
  const [seedSource, videosSource] = await Promise.all([
    readFile(seedPath, 'utf8'),
    readFile(videosPath, 'utf8'),
  ])
  assert(seedSource.endsWith('\n'), 'seed.ndjson must end with a newline')
  assert(videosSource.endsWith('\n'), 'videos.json must end with a newline')

  const lines = seedSource.split(/\r?\n/).filter(Boolean)
  const documents = lines.map((line, index) => {
    try {
      return JSON.parse(line)
    } catch (error) {
      throw new Error(`Invalid JSON on seed.ndjson line ${index + 1}: ${error.message}`)
    }
  })
  const videos = JSON.parse(videosSource)
  return {documents, videos}
}

export function validateFixture(documents, videos, {storedAssets = false} = {}) {
  assert(Array.isArray(documents), 'Documents must be an array')
  assert(videos && typeof videos === 'object' && !Array.isArray(videos), 'videos.json must be an object')

  const counts = Object.fromEntries(CATALOG_TYPES.map((type) => [type, 0]))
  const ids = documents.map((document) => document._id)
  assert(new Set(ids).size === ids.length, 'Duplicate document IDs')
  assert(ids.every((id) => typeof id === 'string' && /^[-_.a-zA-Z0-9]+$/.test(id)), 'Invalid Sanity document ID')

  for (const document of documents) {
    assert(CATALOG_TYPES.includes(document._type), `Unexpected document type ${document._type}`)
    counts[document._type] += 1
    validateArrayKeys(document, document._id)
  }
  for (const [type, expected] of Object.entries(EXPECTED_COUNTS)) {
    assert(counts[type] === expected, `Expected ${expected} ${type} documents, found ${counts[type]}`)
  }

  const slugIdentities = documents.map((document) => `${document._type}:${document.slug?.current}`)
  assert(slugIdentities.every((identity) => !identity.endsWith(':undefined')), 'Missing document slug')
  assert(new Set(slugIdentities).size === slugIdentities.length, 'Duplicate type/slug identity')

  const idSet = new Set(ids)
  for (const document of documents) {
    const contentReferences = collectReferences(document).filter((reference) => !reference.startsWith('image-'))
    for (const reference of contentReferences) {
      assert(idSet.has(reference), `${document._id} references missing document ${reference}`)
    }
  }

  const categories = documents.filter((document) => document._type === 'category')
  const instructors = documents.filter((document) => document._type === 'instructor')
  const lessons = documents.filter((document) => document._type === 'lesson')
  const courses = documents.filter((document) => document._type === 'course')

  for (const instructor of instructors) {
    validateImage(instructor.photo, instructor._id, storedAssets)
    validatePortableText(instructor.bio, instructor._id)
  }
  for (const lesson of lessons) {
    validateImage(lesson.thumbnail, lesson._id, storedAssets)
    validatePortableText(lesson.notes, lesson._id)
    assert(Number.isInteger(lesson.duration) && lesson.duration > 0, `Invalid duration in ${lesson._id}`)
    assert(Array.isArray(lesson.keyPoints) && lesson.keyPoints.length > 0, `Missing key points in ${lesson._id}`)
  }
  for (const course of courses) validateImage(course.coverImage, course._id, storedAssets)

  const categoryIds = new Set(categories.map((document) => document._id))
  const instructorIds = new Set(instructors.map((document) => document._id))
  const membership = new Map(lessons.map((lesson) => [lesson._id, 0]))
  let moduleCount = 0
  for (const course of courses) {
    assert(instructorIds.has(course.instructor?._ref), `Missing instructor for ${course._id}`)
    assert(categoryIds.has(course.category?._ref), `Missing category for ${course._id}`)
    assert(Array.isArray(course.modules) && course.modules.length > 0, `Missing modules in ${course._id}`)
    moduleCount += course.modules.length
    for (const module of course.modules) {
      assert(Array.isArray(module.lessons) && module.lessons.length > 0, `Empty module ${module._key}`)
      for (const lesson of module.lessons) {
        assert(membership.has(lesson._ref), `${course._id} references unknown lesson ${lesson._ref}`)
        membership.set(lesson._ref, membership.get(lesson._ref) + 1)
      }
    }
  }
  for (const [lessonId, count] of membership) {
    assert(count === 1, `${lessonId} has course membership count ${count}`)
  }

  const videoEntries = Object.entries(videos)
  assert(videoEntries.length === 120, `Expected 120 video entries, found ${videoEntries.length}`)
  const videoIds = videoEntries.map(([, video]) => video.id)
  assert(new Set(videoIds).size === videoIds.length, 'Duplicate YouTube video IDs')
  for (const [key, video] of videoEntries) {
    assert(typeof video.id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(video.id), `Invalid YouTube ID for ${key}`)
    assert(typeof video.title === 'string' && video.title.length > 0, `Missing video title for ${key}`)
    assert(typeof video.channel === 'string' && video.channel.length > 0, `Missing video channel for ${key}`)
    assert(Number.isInteger(video.duration) && video.duration > 0, `Invalid video duration for ${key}`)
    assert(typeof video.query === 'string' && video.query.length > 0, `Missing video query for ${key}`)
  }

  const lessonVideoIds = lessons.map((lesson) => youtubeId(lesson.videoUrl))
  assert(lessonVideoIds.every(Boolean), 'Every lesson must use a canonical YouTube watch URL')
  assert(new Set(lessonVideoIds).size === lessons.length, 'Lesson video URLs must be unique')
  const videoById = new Map(videoEntries.map(([key, video]) => [video.id, {key, ...video}]))
  for (const lesson of lessons) {
    const video = videoById.get(youtubeId(lesson.videoUrl))
    assert(video, `Missing video metadata for ${lesson._id}`)
    assert(video.key === lesson.slug.current, `Video key mismatch for ${lesson._id}`)
    assert(video.duration === lesson.duration, `Duration mismatch for ${lesson._id}`)
  }

  const imageCount = instructors.length + lessons.length + courses.length
  assert(imageCount === 135, `Expected 135 images, found ${imageCount}`)
  return {counts, documentCount: documents.length, imageCount, moduleCount, videoCount: videoEntries.length}
}

export function printFixtureReport(report) {
  console.log('Vertex Sanity fixture is valid.')
  console.log(`Documents: ${report.documentCount} total — ${report.counts.category} categories, ${report.counts.instructor} instructors, ${report.counts.lesson} lessons, ${report.counts.course} courses`)
  console.log(`Relationships: ${report.moduleCount} modules; every lesson belongs to exactly one module`)
  console.log(`Media: ${report.videoCount} unique YouTube videos, ${report.imageCount} image imports`)
}

async function main() {
  const {documents, videos} = await readFixture()
  printFixtureReport(validateFixture(documents, videos))
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  main().catch((error) => {
    console.error(`Fixture validation failed: ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  })
}
