import {randomUUID} from 'node:crypto'

export const key = () => randomUUID().slice(0, 12)

export type Images = Record<'hero' | 'warehouse' | 'counter' | 'truck' | 'repair', string>

/** Pages created by the seed, by path. Links to these become references; anything else stays a URL. */
export const PAGE_IDS: Record<string, string> = {
  '/': 'page-home',
  '/business-system': 'page-business-system',
  '/webshop': 'page-webshop',
  '/api': 'page-api',
  '/integrations': 'page-integrations',
  '/who-its-for': 'page-who-its-for',
  '/about': 'page-about',
  '/support': 'page-support',
  '/start': 'page-start',
}

export function image(assetId: string, alt: string, hotspot?: {x: number; y: number}) {
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: assetId},
    alt,
    ...(hotspot && {
      hotspot: {_type: 'sanity.imageHotspot', x: hotspot.x, y: hotspot.y, width: 0.4, height: 0.4},
      crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0},
    }),
  }
}

export function link(target: string) {
  const pageId = PAGE_IDS[target]
  return pageId
    ? {_type: 'link', linkType: 'internal', page: {_type: 'reference', _ref: pageId}, openInNewTab: false}
    : {_type: 'link', linkType: 'external', url: target, openInNewTab: false}
}

export const navItem = (label: string, target: string) => ({_key: key(), _type: 'navItem', label, link: link(target)})

export const button = (label: string, target: string, variant: 'primary' | 'outline' = 'primary') => ({
  _type: 'button',
  label,
  variant,
  link: link(target),
})

export const integrations = [
  {id: 'fortnox', name: 'Fortnox', category: 'accounting'},
  {id: 'unit4', name: 'Unit4', category: 'accounting'},
  {id: 'point-of-sale', name: 'Point of sale', category: 'payments'},
  {id: 'check-in', name: 'Check-in', category: 'inspection'},
  {id: 'vecheck', name: 'Vecheck', category: 'inspection'},
  {id: 'tread-scanning', name: 'Tread scanning', category: 'inspection'},
]

export const integrationRefs = () =>
  integrations.map((integration) => ({_key: key(), _type: 'reference', _ref: `integration-${integration.id}`}))

// Block builders. Keep field names in step with src/blocks/*/schema.ts.

export const hero = (fields: {
  eyebrow?: string
  heading: string
  body: string
  image: ReturnType<typeof image>
  buttons?: ReturnType<typeof button>[]
}) => ({
  _key: key(),
  _type: 'heroBlock',
  eyebrow: fields.eyebrow,
  heading: fields.heading,
  body: fields.body,
  image: fields.image,
  height: 'tall',
  action: fields.buttons?.length ? 'buttons' : 'none',
  buttons: fields.buttons?.map((item) => ({_key: key(), ...item})),
  theme: 'dark',
})

export const stats = (items: [string, string][]) => ({
  _key: key(),
  _type: 'statsBlock',
  items: items.map(([value, label]) => ({_key: key(), _type: 'stat', value, label})),
  theme: 'dark',
})

export const featureRows = (
  rows: {title: string; body: string; image: ReturnType<typeof image>; link?: string}[],
  options: {heading?: string; imagePosition?: 'right' | 'alternate'; spacingTop?: 'default' | 'none'} = {},
) => ({
  _key: key(),
  _type: 'featureRowsBlock',
  heading: options.heading,
  rows: rows.map((row) => ({
    _key: key(),
    _type: 'featureRow',
    title: row.title,
    body: row.body,
    image: row.image,
    ...(row.link && {link: link(row.link)}),
  })),
  imagePosition: options.imagePosition ?? 'right',
  theme: 'dark',
  spacing: {top: options.spacingTop ?? 'default', bottom: 'default'},
})

export const logoGrid = (fields: {
  heading: string
  body: string
  button?: ReturnType<typeof button>
  spacingTop?: 'default' | 'none'
}) => ({
  _key: key(),
  _type: 'logoGridBlock',
  heading: fields.heading,
  body: fields.body,
  button: fields.button,
  items: integrationRefs(),
  theme: 'dark',
  spacing: {top: fields.spacingTop ?? 'default', bottom: 'default'},
})

export const ctaBanner = (fields: {
  heading: string
  body: string
  button: ReturnType<typeof button>
  image: ReturnType<typeof image>
}) => ({
  _key: key(),
  _type: 'ctaBannerBlock',
  ...fields,
  overlayOpacity: 0.55,
  theme: 'dark',
})

export function page(slug: string, title: string, description: string, blocks: unknown[]) {
  // The home page has its own slug but is served at "/".
  const _id = PAGE_IDS[slug === 'home' ? '/' : `/${slug}`]
  if (!_id) throw new Error(`Add "/${slug}" to PAGE_IDS`)
  return {
    _id,
    _type: 'page',
    title,
    slug: {_type: 'slug', current: slug},
    seo: {_type: 'seo', description, noIndex: false},
    blocks,
  }
}
