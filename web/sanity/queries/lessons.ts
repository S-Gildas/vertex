import {defineQuery} from 'next-sanity'

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, videoUrl,
    thumbnail {alt, asset->{_id, url, metadata {lqip, dimensions}}},
    duration, freePreview, studentCount,
    notes[]{...}, keyPoints, proTip,
    resources[]{_key, type, title, description, url},
    "course": *[_type == "course" && references(^._id)][0] {
      _id, title, "slug": slug.current,
      coverImage {alt, asset->{_id, url}},
      instructor->{
        _id, name, "slug": slug.current,
        photo {alt, asset->{_id, url}}, expertise
      },
      modules[]{_key, title, summary, "lessonIds": lessons[]._ref}
    }
  }
`)
