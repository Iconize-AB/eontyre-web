/**
 * Seeds every page (scripts/seed-pages.ts), Site settings, the 14 integrations
 * and the placeholder news posts, once for each language (sv, en, nb, fi).
 * English is the source; the other languages come from scripts/translations/*.json.
 * Safe to re-run: documents use fixed IDs and are replaced, so edits made in the
 * Studio to these documents are overwritten.
 *
 *   npm run seed
 *   npm run seed -- --extract     writes scripts/translations/source.json and exits
 *   npm run seed -- --only-new    adds documents that don't exist yet (and the "kind" of existing
 *                                 integrations); changes nothing that is already in Sanity
 *   SEED_ASSETS_DIR=path/to/assets npm run seed
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
import {buildPages, integrationCategoryData, integrationData, posBlocks, postData, smsFaq, smsPaymentBlocks} from './seed-pages'
import {collectStrings, idInLanguage, LANGS, localize, type Lang} from './seed-i18n'

const extractOnly = process.argv.includes('--extract')
const onlyNew = process.argv.includes('--only-new')

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
    const detail = integration.detail
    const doc = {
      _id: `integration-${integration.id}`,
      _type: 'integration',
      name: integration.name,
      slug: {_type: 'slug', current: integration.id},
      shortName: integration.shortName,
      category: {_type: 'reference', _ref: `integration-category-${integration.category}`},
      shortDescription: integration.shortDescription,
      kind: integration.kind,
      status: integration.status,
      hasDetailPage: Boolean(detail),
      ...(detail === 'pos' && {blocks: posBlocks(img)}),
      ...(detail === 'sms' && {blocks: smsPaymentBlocks(img), faq: smsFaq}),
      ...(integration.linkOverride && {linkOverride: link(integration.linkOverride)}),
      orderRank: rank.toString(),
    }
    rank = rank.genNext().genNext()
    return doc
  })

  let categoryRank = LexoRank.middle()
  const categories = integrationCategoryData.map((category) => {
    const doc = {
      _id: `integration-category-${category.id}`,
      _type: 'integrationCategory',
      title: category.title,
      slug: {_type: 'slug', current: category.id},
      accentTile: Boolean(category.accentTile),
      orderRank: categoryRank.toString(),
    }
    categoryRank = categoryRank.genNext().genNext()
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

  return [...buildPages(img), siteSettings(img), ...categories, ...integrations, ...posts]
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

/**
 * Adds what is missing, in every language, without touching anything that exists:
 * new documents are created only if their id is free, and existing add-ons and integrations
 * get their `kind` only if it isn't set. Safe to run after editors have started working.
 */
async function seedNewOnly(english: object[]) {
  const reports = Object.fromEntries(LANGS.map((lang) => [lang, {missing: new Set<string>()}])) as Record<
    Lang,
    {missing: Set<string>}
  >

  // New integrations are placed after "Integrated point of sale", between its order rank and the next one.
  const ranks = await client.fetch<{_id: string; orderRank: string}[]>(
    `*[_id in ["integration-integrated-point-of-sale-en", "integration-check-in-en"]]{_id, orderRank}`,
  )
  const before = ranks.find((doc) => doc._id.includes('point-of-sale'))?.orderRank
  const after = ranks.find((doc) => doc._id.includes('check-in'))?.orderRank
  const newRanks = new Map<string, string>()
  if (before && after) {
    let current = LexoRank.parse(before)
    const next = LexoRank.parse(after)
    const newAddons = integrationData.filter((item) => item.category === 'addons').map((item) => `integration-${item.id}`)
    for (const id of newAddons) {
      current = current.between(next)
      newRanks.set(id, current.toString())
    }
  }

  const docs = LANGS.flatMap((lang) =>
    english.map((doc) => {
      const localized = localize(doc, lang, reports[lang])
      const baseId = (doc as {_id: string})._id
      if (newRanks.has(baseId)) localized.orderRank = newRanks.get(baseId)
      return localized
    }),
  )
  const metadata = english.map((doc) => {
    const {_id, _type} = doc as {_id: string; _type: string}
    return metadataDocument(_id, _type)
  })

  const existing = new Set(
    // "raw" so drafts count as existing too.
    await client.fetch<string[]>(
      `*[_id in $ids]._id`,
      {ids: [...docs.map((doc) => doc._id as string), ...metadata.map((doc) => doc._id)]},
      {perspective: 'raw'},
    ),
  )

  const tx = client.transaction()
  const created: string[] = []
  for (const doc of [...docs, ...metadata]) {
    const id = doc._id as string
    if (existing.has(id)) continue
    tx.createIfNotExists(doc as never)
    created.push(id)
  }
  for (const doc of docs) {
    if (doc._type === 'integration' && existing.has(doc._id as string)) {
      tx.patch(doc._id as string, (patch) => patch.setIfMissing({kind: doc.kind as string}))
    }
  }
  await tx.commit()

  // Categories used to be a fixed list stored as text ("accounting"); they are documents now.
  // Point every existing card (published and draft) at the category in its own language.
  const legacy = await client.fetch<{_id: string; language: string; category: string}[]>(
    `*[_type == "integration" && defined(category) && category._ref == null && defined(language)]{_id, language, "category": string(category)}`,
    {},
    {perspective: 'raw'},
  )
  if (legacy.length) {
    const migrate = client.transaction()
    for (const doc of legacy) {
      migrate.patch(doc._id, {
        set: {category: {_type: 'reference', _ref: idInLanguage(`integration-category-${doc.category}`, doc.language as Lang)}},
      })
    }
    await migrate.commit()
    console.log(`Moved ${legacy.length} integrations to the new category documents.`)
  }

  console.log(`Created ${created.length} documents; existing documents were left as they are.`)
  for (const id of created.filter((id) => id.endsWith('-en') && !id.startsWith('translation'))) console.log(`  + ${id}`)
}

async function seed() {
  const english = (await englishForRun()).docs
  const sources = collectStrings(english)

  if (extractOnly) {
    writeFileSync('scripts/translations/source.json', JSON.stringify(sources, null, 2) + '\n')
    console.log(`Wrote ${sources.length} strings to scripts/translations/source.json`)
    return
  }

  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}`)

  if (onlyNew) {
    await seedNewOnly(english)
    return
  }

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
