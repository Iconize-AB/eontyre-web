import {defineCliConfig} from 'sanity/cli'

// The CLI (deploy, typegen, schema extract) runs outside Next.js. Fall back to
// the project's values so it works without a loaded .env.local.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vitk5ups'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Where the hosted Studio (*.sanity.studio) opens the site in the Presentation tool.
// The Studio embedded at /studio always previews its own origin instead.
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

export default defineCliConfig({
  api: {projectId, dataset},
  // The shared config in src/sanity/env.ts reads Next.js-style variables;
  // inline them into the standalone Studio bundle.
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      'process.env.NEXT_PUBLIC_SANITY_PROJECT_ID': JSON.stringify(projectId),
      'process.env.NEXT_PUBLIC_SANITY_DATASET': JSON.stringify(dataset),
      'process.env.NEXT_PUBLIC_SANITY_API_VERSION': JSON.stringify(process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? ''),
      'process.env.SANITY_STUDIO_PREVIEW_URL': JSON.stringify(previewUrl),
      'process.env.NEXT_PUBLIC_LOCALE_DOMAINS': JSON.stringify(process.env.NEXT_PUBLIC_LOCALE_DOMAINS ?? ''),
    },
  }),
})
