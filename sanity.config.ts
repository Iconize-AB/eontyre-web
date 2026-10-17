'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId, studioUrl} from './src/sanity/env'
import {resolve} from './src/sanity/presentation'
import {schemaTypes} from './src/sanity/schemaTypes'
import {SINGLETON_TYPES, structure} from './src/sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Eontyre',
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "New document" menu.
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        // Only set in the hosted Studio build (see sanity.cli.ts); embedded, it previews its own origin.
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || undefined,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
