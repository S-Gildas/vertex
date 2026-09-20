import {defineCliConfig} from 'sanity/cli'

import {dataset, projectId} from './src/env'

export default defineCliConfig({
  api: {projectId, dataset},
  typegen: {
    path: '../web/sanity/**/*.{ts,tsx}',
    schema: '../web/sanity/schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
})
