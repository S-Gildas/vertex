import {mkdir, writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

import {getCliClient} from 'sanity/cli'

import {CATALOG_TYPES, EXPECTED_COUNTS, printFixtureReport, readFixture, validateFixture} from './validate-fixture.mjs'

const API_VERSION = '2026-09-19'
const EXPECTED_PROJECT = 'smobuwyq'
const EXPECTED_DATASET = 'production'
const snapshotPath = fileURLToPath(new URL('../../../.tmp/seed-preflight.json', import.meta.url))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function getClient() {
  const client = getCliClient({apiVersion: API_VERSION, useCdn: false})
  const {dataset, projectId} = client.config()
  console.log(`Sanity target: project ${projectId}, dataset ${dataset}`)
  assert(projectId === EXPECTED_PROJECT, `Expected project ${EXPECTED_PROJECT}, received ${projectId}`)
  assert(dataset === EXPECTED_DATASET, `Expected dataset ${EXPECTED_DATASET}, received ${dataset}`)
  return client
}

async function catalogDocuments(client) {
  return client.fetch('*[_type in $types]', {types: CATALOG_TYPES})
}

function countsFor(documents) {
  return Object.fromEntries(CATALOG_TYPES.map((type) => [type, documents.filter((document) => document._type === type).length]))
}

async function findExternalReferences(client, catalogIds) {
  if (catalogIds.length === 0) return []
  return client.fetch(
    '*[!(_type in $types) && references($catalogIds)][0...20]{_id,_type}',
    {catalogIds, types: CATALOG_TYPES},
  )
}

async function preflight(client, fixtureIds) {
  const current = await catalogDocuments(client)
  const externalReferences = await findExternalReferences(client, current.map((document) => document._id))
  assert(
    externalReferences.length === 0,
    `Catalog deletion is blocked by external references:\n${externalReferences.map((document) => `- ${document._type}:${document._id}`).join('\n')}`,
  )

  const snapshot = {
    projectId: EXPECTED_PROJECT,
    dataset: EXPECTED_DATASET,
    createdAt: new Date().toISOString(),
    currentCatalogIds: current.map((document) => document._id).sort(),
    nextCatalogIds: [...fixtureIds].sort(),
  }
  await mkdir(fileURLToPath(new URL('../../../.tmp/', import.meta.url)), {recursive: true})
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  console.log('Current catalog counts:', countsFor(current))
  console.log(`Preflight snapshot: ${snapshotPath}`)
  console.log('No documents outside the catalog reference the catalog documents scheduled for replacement.')
}

async function deleteCatalog(client) {
  for (const type of ['course', 'lesson', 'instructor', 'category']) {
    const before = await client.fetch('count(*[_type == $type])', {type})
    if (before > 0) await client.delete({query: '*[_type == $type]', params: {type}})
    const after = await client.fetch('count(*[_type == $type])', {type})
    assert(after === 0, `Failed to delete every ${type} document; ${after} remain`)
    console.log(`Deleted ${before} ${type} documents.`)
  }
}

async function validateRemote(client, fixtureDocuments, videos) {
  const remote = await catalogDocuments(client)
  const expectedIds = new Set(fixtureDocuments.map((document) => document._id))
  const remoteIds = new Set(remote.map((document) => document._id))
  assert(remote.length === fixtureDocuments.length, `Expected ${fixtureDocuments.length} remote catalog documents, found ${remote.length}`)
  assert([...expectedIds].every((id) => remoteIds.has(id)), 'One or more supplied fixture IDs are missing remotely')
  assert([...remoteIds].every((id) => expectedIds.has(id)), 'One or more obsolete catalog IDs remain remotely')

  const report = validateFixture(remote, videos, {storedAssets: true})
  for (const [type, expected] of Object.entries(EXPECTED_COUNTS)) {
    assert(report.counts[type] === expected, `Remote ${type} count mismatch`)
  }

  const assetIds = [...new Set(remote.flatMap((document) => {
    const matches = JSON.stringify(document).match(/image-[a-zA-Z0-9]+-\d+x\d+-[a-z0-9]+/g)
    return matches ?? []
  }))]
  const storedAssetCount = await client.fetch('count(*[_id in $assetIds])', {assetIds})
  assert(storedAssetCount === assetIds.length, `Expected ${assetIds.length} stored image assets, found ${storedAssetCount}`)
  printFixtureReport(report)
  console.log(`Remote validation passed with ${storedAssetCount} resolved image assets.`)
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const {documents, videos} = await readFixture()
  validateFixture(documents, videos)
  const client = getClient()

  if (args.has('--preflight')) {
    await preflight(client, documents.map((document) => document._id))
    return
  }
  if (args.has('--delete')) {
    await preflight(client, documents.map((document) => document._id))
    await deleteCatalog(client)
    return
  }
  if (args.has('--validate-remote')) {
    await validateRemote(client, documents, videos)
    return
  }
  throw new Error('Expected --preflight, --delete, or --validate-remote')
}

main().catch((error) => {
  console.error(`Remote seed operation failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
