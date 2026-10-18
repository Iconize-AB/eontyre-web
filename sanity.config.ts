'use client'

import {documentInternationalization} from '@sanity/document-internationalization'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {locales} from './src/i18n/config'
import {apiVersion, dataset, projectId, studioUrl} from './src/sanity/env'
import {resolve} from './src/sanity/presentation'
import {schemaTypes} from './src/sanity/schemaTypes'
import {SINGLETON_TYPES, structure} from './src/sanity/structure'
import {integrationPageTemplates} from './src/sanity/templates'

/** Document types that exist once per language. */
const translatedTypes = ['page', 'integration', 'integrationCategory', 'post', 'siteSettings']

export default defineConfig({
  name: 'default',
  title: 'Eontyre',
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "New document" menu.
    // Add-on and integration pages start from a pre-filled template (src/sanity/templates.ts).
    templates: (templates) => [
      ...templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
      ...integrationPageTemplates,
    ],
  },
  document: {
    actions: (actions, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
  plugins: [
    structureTool({structure}),
    documentInternationalization({
      supportedLanguages: locales.map(({id, title}) => ({id, title})),
      schemaTypes: translatedTypes,
      apiVersion: '2025-02-19',
    }),
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
