import 'server-only'

export const apiVersion = '2026-09-19'

export const dataset = required(process.env.NEXT_PUBLIC_SANITY_DATASET, 'NEXT_PUBLIC_SANITY_DATASET')
export const projectId = required(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 'NEXT_PUBLIC_SANITY_PROJECT_ID')
export const readToken = required(process.env.SANITY_API_READ_TOKEN, 'SANITY_API_READ_TOKEN')

function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}
