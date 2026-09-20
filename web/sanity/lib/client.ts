import 'server-only'

import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, readToken} from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  perspective: 'published',
  projectId,
  token: readToken,
  useCdn: process.env.NODE_ENV === 'production',
})
