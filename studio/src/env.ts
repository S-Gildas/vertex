export const apiVersion = '2026-09-19'

export const dataset = required(
  process.env.SANITY_STUDIO_DATASET,
  'SANITY_STUDIO_DATASET',
)

export const projectId = required(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'SANITY_STUDIO_PROJECT_ID',
)

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}
