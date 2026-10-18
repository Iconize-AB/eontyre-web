/**
 * Seeds every page (scripts/seed-pages.ts), Site settings, the 14 integrations
 * and the placeholder news posts, once for each language (sv, en, nb, fi).
 * English is the source; the other languages come from scripts/translations/*.json.
 * Safe to re-run: documents use fixed IDs and are replaced, so edits made in the
 * Studio to these documents are overwritten.
 *
 *   npm run seed
 *   npm run seed -- --extract     writes scripts/translations/source.json and exits
 *   SEED_ASSETS_DIR=path/to/handoff/reference/site/assets npm run seed
 *
 * Images are reused from the Sanity media library by filename. Set
 * SEED_ASSETS_DIR to upload any that are missing. Needs SANITY_API_WRITE_TOKEN
 * (an Editor token) in .env.local.
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'

import {LexoRank} from 'lexorank'
import {createClient} from 'next-sanity'

import {writeFileSync} from 'node:fs'

import {image, key, link, navItem, pt, type Images} from './seed-helpers'
import {buildPages, integrationData, posBlocks, postData} from './seed-pages'
import {collectStrings, idInLanguage, LANGS, localize, type Lang} from './seed-i18n'

const extractOnly = process.argv.includes('--extract')

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token && !extractOnly) throw new Error('Missing SANITY_API_WRITE_TOKEN in .env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-10-01',
  token,
  useCdn: false,
})

const imageFiles: Record<keyof Images, string> = {
  logoWhite: 'eontyre-logo-white.png',
  logoBlack: 'eontyre-logo-black.png',
  hero: 'hero-forest-road.jpg',
  warehouse: 'px-tyre-warehouse.jpg',
  counter: 'counter-payment.jpg',
  truck: 'truck-night.jpg',
  repair: 'px-kneeling-repair.jpg',
  carDust: 'car-dust-sunset.jpg',
  liftWheel: 'px-lift-wheel.jpg',
  mechanicTyre: 'px-mechanic-holding-tyre.jpg',
  stackAlloy: 'px-stack-alloy.jpg',
  tyreHotel: 'workshop-tyre-hotel.jpg',
  wheelChange: 'workshop-wheel-change.jpg',
}

/** Reuses an image already in Sanity, or uploads it from SEED_ASSETS_DIR. */
async function findAsset(filename: string) {
  const id = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    {filename},
  )
  if (id) return id

  const dir = process.env.SEED_ASSETS_DIR
  const file = dir && path.join(dir, filename)
  if (!file || !existsSync(file)) {
    throw new Error(`Image "${filename}" is not in Sanity. Upload it in the Studio, or set SEED_ASSETS_DIR.`)
  }
  const asset = await client.assets.upload('image', createReadStream(file), {filename})
  console.log(`  uploaded ${filename}`)
  return asset._id
}

async function loadImages(): Promise<Images> {
  const entries = await Promise.all(
    Object.entries(imageFiles).map(async ([name, filename]) => [name, await findAsset(filename)] as const),
  )
  return Object.fromEntries(entries) as Images
}

function siteSettings(img: Images) {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'Eontyre',
    homePage: {_type: 'reference', _ref: 'page-home'},
    logo: image(img.logoWhite, 'Eontyre'),
    logoOnLight: image(img.logoBlack, 'Eontyre'),
    navItems: [
      navItem('Business system', '/business-system'),
      navItem('Webshop', '/webshop'),
      navItem('API', '/api'),
      navItem('Integrations', '/integrations'),
      navItem("Who it's for", '/who-its-for'),
    ],
    primaryCta: {_type: 'navItem', label: 'Try free for 30 days', link: link('/start')},
    tagline: 'Business system, webshop and API for the tyre industry.',
    footerColumns: [
      {
        _key: key(),
        _type: 'footerColumn',
        title: 'Product',
        links: [
          navItem('Business system', '/business-system'),
          navItem('Webshop', '/webshop'),
          navItem('API and integrations', '/api'),
          navItem('Integrations and add-ons', '/integrations'),
          navItem("Who it's for", '/who-its-for'),
          navItem('About Eontyre', '/about'),
          navItem('Support', '/support'),
        ],
      },
      {
        _key: key(),
        _type: 'footerColumn',
        title: 'Get started',
        links: [navItem('Free 30-day trial', '/start'), navItem('Book a demo', '/start'), navItem('News', '/news')],
      },
    ],
    contact: {
      title: 'Contact our resellers',
      lines: ['Sweden: +46 (0)20 - 12 10 34', 'Norway: +47 67 22 88 99'],
      link: {_type: 'navItem', label: 'E-mail us', link: link('/start')},
    },
    legal: {
      copyright: '© {year} Eontyre',
      link: {
        _type: 'navItem',
        label: 'Terms and conditions',
        link: link('https://eontyre.com/assets/docs/General_Terms_EONTYRE_20241201.pdf'),
      },
    },
  }
}

/** The English documents every language is made from, with their base ids. */
function englishDocuments(img: Images) {
  // Lexorank strings, so the order can be changed by dragging in the Studio.
  let rank = LexoRank.middle()
  const integrations = integrationData.map((integration) => {
    const isPos = integration.id === 'integrated-point-of-sale'
    const doc = {
      _id: `integration-${integration.id}`,
      _type: 'integration',
      name: integration.name,
      slug: {_type: 'slug', current: integration.id},
      shortName: integration.shortName,
      category: integration.category,
      shortDescription: integration.shortDescription,
      status: integration.status,
      hasDetailPage: isPos,
      ...(isPos && {blocks: posBlocks(img)}),
      ...(integration.linkOverride && {linkOverride: link(integration.linkOverride)}),
      orderRank: rank.toString(),
    }
    rank = rank.genNext().genNext()
    return doc
  })

  // All news posts are placeholders, so they are created as drafts only.
  const posts = postData.map((post) => ({
    _id: `drafts.post-${post.id}`,
    _type: 'post',
    title: post.title,
    slug: {_type: 'slug', current: post.id},
    publishedAt: post.date,
    category: post.category,
    excerpt: post.excerpt,
    featured: Boolean(post.featured),
    ...(post.image && {mainImage: image(img[post.image], post.imageAlt ?? '')}),
    body: pt(post.excerpt),
  }))

  return [...buildPages(img), siteSettings(img), ...integrations, ...posts]
}

/** Links the language versions of a document, for the Studio's translation tools and the language switcher. */
function metadataDocument(baseId: string, type: string) {
  const isDraftOnly = baseId.startsWith('drafts.')
  const publishedBase = baseId.replace(/^drafts\./, '')
  return {
    _id: `translation.metadata.${publishedBase}`,
    _type: 'translation.metadata',
    schemaTypes: [type],
    translations: LANGS.map((lang) => ({
      _key: key(),
      _type: 'internationalizedArrayReferenceValue',
      language: lang,
      value: {
        _type: 'reference',
        _ref: idInLanguage(publishedBase, lang),
        // Drafts have no published document yet, so the reference is weak until they are published.
        ...(isDraftOnly && {_weak: true, _strengthenOnPublish: {type}}),
      },
    })),
  }
}

/** Seeded in phase 1 and no longer part of the content. */
const obsoleteIds = ['integration-point-of-sale']

async function seed() {
  const english = (await englishForRun()).docs
  const sources = collectStrings(english)

  if (extractOnly) {
    writeFileSync('scripts/translations/source.json', JSON.stringify(sources, null, 2) + '\n')
    console.log(`Wrote ${sources.length} strings to scripts/translations/source.json`)
    return
  }

  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}`)
  const reports = Object.fromEntries(LANGS.map((lang) => [lang, {missing: new Set<string>()}])) as Record<
    Lang,
    {missing: Set<string>}
  >
  const tx = client.transaction()

  for (const lang of LANGS) {
    for (const doc of english) tx.createOrReplace(localize(doc, lang, reports[lang]) as never)
  }
  for (const doc of english) {
    const {_id, _type} = doc as {_id: string; _type: string}
    tx.createOrReplace(metadataDocument(_id, _type) as never)
    // The pre-translation (English only) documents are replaced by the "-en" ones.
    tx.delete(_id)
  }
  for (const id of obsoleteIds) tx.delete(id)

  await tx.commit()
  console.log(`Done: ${english.length} documents in each of ${LANGS.join(', ')}.`)
  for (const lang of LANGS) {
    const missing = reports[lang].missing.size
    if (missing) console.log(`  ${lang}: ${missing} strings without a translation (left in English)`)
  }
}

/** The English documents, with image ids looked up in Sanity (or made up when only extracting strings). */
async function englishForRun() {
  const img = extractOnly
    ? (Object.fromEntries(Object.keys(imageFiles).map((name) => [name, `image-${name}-1x1-png`])) as Images)
    : await loadImages()
  return {docs: englishDocuments(img)}
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
