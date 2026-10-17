# eontyre-web

Eontyre.com: Next.js 16 (App Router, Cache Components) with Sanity Studio embedded at `/studio`.

## Getting started

```bash
cp .env.example .env.local   # fill in tokens
npm install
npm run dev                  # http://localhost:3000 and http://localhost:3000/studio
```

In the Sanity dashboard (project `vitk5ups`) → API → CORS origins, add `http://localhost:3000` with credentials allowed. Add the production domain the same way before launch.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Which Sanity project and dataset to use |
| `SANITY_API_READ_TOKEN` | Viewer token. Enables draft preview in the Presentation tool |
| `SANITY_API_WRITE_TOKEN` | Editor token. Only needed for `npm run seed` |

## Scripts

- `npm run seed` recreates all pages, Site settings and integrations, using the images already in Sanity. It replaces those documents, which overwrites any edits made in the Studio, so don't run it once content is being edited there.
- `npm run typegen` regenerates `src/sanity/schema.json` and `src/sanity/types.ts`. Run it after changing a schema or a query.
- `npm run type-check`, `npm run lint` and `npm run build` check the code.

## How content is structured

- **Page** (`page`): title, URL path, SEO and a list of blocks. The home page is chosen in Site settings and is served at `/`.
- **Site settings** (`siteSettings`, singleton): logo, header navigation and buttons, footer columns, contact details and legal line.
- **Integration** (`integration`): used by the logo grid now and by the integrations page later.

## Adding a block

Each block lives in `src/blocks/<name>/`:

- `schema.ts`: the Sanity fields. Use `themeField`, `spacingField` and `imageField` from `src/sanity/schemaTypes/fields.ts`.
- `query.ts`: the GROQ projection for the block.
- `<Name>Block.tsx`: the React component.

Register the block in `src/blocks/schemas.ts`, `src/blocks/query.ts` and `src/blocks/index.tsx`, then run `npm run typegen`.

Values that can carry Visual Editing markers (for example `theme` or `variant`) must go through `stegaClean()` before being compared with a literal. The `Stega<T>` types make TypeScript flag the places that need it.

## Design

The tokens are in `src/app/globals.css`. Each block sets `data-theme="dark" | "light"`, and the colour variables switch with it. Only the dark theme is finished. The design reference is in `docs/` (brief, reference HTML and screenshots).
