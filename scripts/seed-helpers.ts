import {randomUUID} from 'node:crypto'

export const key = () => randomUUID().slice(0, 12)

/** Image asset IDs by short name, resolved in seed.ts. */
export type Images = Record<
  | 'logoWhite'
  | 'logoBlack'
  | 'hero'
  | 'warehouse'
  | 'counter'
  | 'truck'
  | 'repair'
  | 'carDust'
  | 'liftWheel'
  | 'mechanicTyre'
  | 'stackAlloy'
  | 'tyreHotel'
  | 'wheelChange',
  string
>

/** Pages created by the seed, by path. Links to these become references; anything else stays a URL. */
export const PAGE_IDS: Record<string, string> = {
  '/': 'page-home',
  '/business-system': 'page-business-system',
  '/webshop': 'page-webshop',
  '/api': 'page-api',
  '/integrations': 'page-integrations',
  '/who-its-for': 'page-who-its-for',
  '/news': 'page-news',
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

/** A path such as "/about#contact" links to that page and block; other values stay URLs. */
export function link(target: string) {
  const [path, anchor] = target.split('#')
  const pageId = PAGE_IDS[path]
  if (pageId) {
    return {
      _type: 'link',
      linkType: 'internal',
      page: {_type: 'reference', _ref: pageId},
      ...(anchor && {anchor}),
      openInNewTab: false,
    }
  }
  if (target.startsWith('/integrations/')) {
    return {
      _type: 'link',
      linkType: 'internal',
      page: {_type: 'reference', _ref: `integration-${target.split('/')[2]}`},
      openInNewTab: false,
    }
  }
  return {_type: 'link', linkType: 'external', url: target, openInNewTab: false}
}

export const navItem = (label: string, target: string) => ({_key: key(), _type: 'navItem', label, link: link(target)})

export const button = (label: string, target: string, variant: 'primary' | 'outline' = 'primary') => ({
  _key: key(),
  _type: 'button',
  label,
  variant,
  link: link(target),
})

/** Portable Text. Strings are paragraphs; arrays mix text and `{text, href}` links in one paragraph. */
type Inline = string | {text: string; href: string}
export function pt(...paragraphs: (string | Inline[])[]) {
  return paragraphs.map((paragraph) => {
    const parts = typeof paragraph === 'string' ? [paragraph] : paragraph
    const markDefs: Record<string, unknown>[] = []
    const children = parts.map((part) => {
      if (typeof part === 'string') return {_type: 'span', _key: key(), text: part, marks: []}
      const markKey = key()
      markDefs.push({_key: markKey, ...link(part.href)})
      return {_type: 'span', _key: key(), text: part.text, marks: [markKey]}
    })
    return {_type: 'block', _key: key(), style: 'normal', markDefs, children}
  })
}

const settings = (overrides: {background?: 'surface'; anchorId?: string; paddingTop?: 'none'} = {}) => ({
  theme: 'dark',
  background: overrides.background ?? 'default',
  paddingTop: overrides.paddingTop ?? 'default',
  ...(overrides.anchorId && {anchorId: overrides.anchorId}),
})

type Settings = Parameters<typeof settings>[0]

// Block builders. Keep field names in step with src/blocks/*/schema.ts.

export const pageHero = (
  fields: {
    eyebrow?: string
    heading: string
    body?: ReturnType<typeof pt>
    buttons?: ReturnType<typeof button>[]
    contactLines?: {label: string; href: string}[]
    media?: 'none' | 'image' | 'imageTop' | 'code'
    image?: ReturnType<typeof image>
    code?: {method: string; path: string; code: string}
  },
  anchorId?: string,
) => ({
  _key: key(),
  _type: 'pageHeroBlock',
  eyebrow: fields.eyebrow,
  heading: fields.heading,
  body: fields.body,
  buttons: fields.buttons,
  contactLines: fields.contactLines?.map((line) => ({_key: key(), _type: 'contactLine', ...line})),
  media: fields.media ?? 'none',
  image: fields.image,
  ...(fields.code && {codeMethod: fields.code.method, codePath: fields.code.path, code: fields.code.code}),
  theme: 'dark',
  ...(anchorId && {anchorId}),
})

export const anchorNav = (items: [label: string, anchorId: string][]) => ({
  _key: key(),
  _type: 'anchorNavBlock',
  items: items.map(([label, anchorId]) => ({_key: key(), _type: 'anchorNavItem', label, anchorId})),
  ...settings(),
})

export const productScreen = (
  fields: {heading: string; body: ReturnType<typeof pt>; note?: string; screen: string; layout?: 'split' | 'stacked'},
  options?: Settings,
) => ({_key: key(), _type: 'productScreenBlock', ...fields, ...settings(options)})

export const textMedia = (
  fields: {
    heading: string
    body: ReturnType<typeof pt>
    image: ReturnType<typeof image>
    imagePosition: 'left' | 'right'
    list?: string[]
    listStyle?: 'numbered' | 'plain'
  },
  options?: Settings,
) => ({_key: key(), _type: 'textMediaBlock', ...fields, ...settings(options)})

export const featureGrid = (
  fields: {
    heading?: string
    body?: ReturnType<typeof pt>
    headerLink?: ReturnType<typeof navItem>
    variant: 'topRule' | 'numbered' | 'steps' | 'cards'
    items: {title: string; body?: ReturnType<typeof pt>; link?: string}[]
  },
  options?: Settings,
) => ({
  _key: key(),
  _type: 'featureGridBlock',
  heading: fields.heading,
  body: fields.body,
  headerLink: fields.headerLink && {...fields.headerLink, _key: undefined},
  variant: fields.variant,
  items: fields.items.map((item) => ({
    _key: key(),
    _type: 'featureGridItem',
    title: item.title,
    body: item.body,
    ...(item.link && {link: link(item.link)}),
  })),
  ...settings(options),
})

export const linkList = (
  fields: {
    heading: string
    body: ReturnType<typeof pt>
    button?: ReturnType<typeof button>
    items: {label: string; meta?: string; link?: string}[]
  },
  options?: Settings,
) => ({
  _key: key(),
  _type: 'linkListBlock',
  heading: fields.heading,
  body: fields.body,
  button: fields.button && {...fields.button, _key: undefined},
  items: fields.items.map((item) => ({
    _key: key(),
    _type: 'linkListItem',
    label: item.label,
    meta: item.meta,
    ...(item.link && {link: link(item.link)}),
  })),
  ...settings(options),
})

export const richTextBlock = (fields: {heading: string; body: ReturnType<typeof pt>; layout?: 'split' | 'single'}, options?: Settings) => ({
  _key: key(),
  _type: 'richTextBlock',
  layout: 'split',
  ...fields,
  ...settings(options),
})

export const imageBlock = (img: ReturnType<typeof image>, aspect: '21:8' | '16:9' | '3:2', options?: Settings) => ({
  _key: key(),
  _type: 'imageBlock',
  image: img,
  aspect,
  ...settings(options),
})

export const featureRows = (
  rows: {title: string; body: string; image: ReturnType<typeof image>; link?: string; linkLabel?: string}[],
  options: {style?: 'panels' | 'editorial'; imagePosition?: 'right' | 'alternate'} & Settings = {},
) => ({
  _key: key(),
  _type: 'featureRowsBlock',
  rows: rows.map((row) => ({
    _key: key(),
    _type: 'featureRow',
    title: row.title,
    body: row.body,
    image: row.image,
    ...(row.link && {link: link(row.link)}),
    linkLabel: row.linkLabel,
  })),
  style: options.style ?? 'panels',
  imagePosition: options.imagePosition ?? 'right',
  ...settings(options),
})

export const stats = (items: [string, string][]) => ({
  _key: key(),
  _type: 'statsBlock',
  items: items.map(([value, label]) => ({_key: key(), _type: 'stat', value, label})),
  theme: 'dark',
  background: 'default',
})

export const logoGrid = (fields: {
  heading: string
  body: string
  button?: ReturnType<typeof button>
  /** Integration IDs without the "integration-" prefix. */
  items: string[]
  paddingTop?: 'default' | 'none'
}) => ({
  _key: key(),
  _type: 'logoGridBlock',
  heading: fields.heading,
  body: fields.body,
  button: fields.button && {...fields.button, _key: undefined},
  items: fields.items.map((id) => ({_key: key(), _type: 'reference', _ref: `integration-${id}`})),
  ...settings({paddingTop: fields.paddingTop === 'none' ? 'none' : undefined}),
})

export const integrationDirectory = (options?: Settings) => ({
  _key: key(),
  _type: 'integrationDirectoryBlock',
  showFilter: true,
  ...settings(options),
})

export const newsList = (options?: Settings) => ({
  _key: key(),
  _type: 'newsListBlock',
  showFeatured: true,
  showFilter: true,
  pageSize: 10,
  ...settings(options),
})

export const form = (
  fields: {
    formType: 'contact' | 'trial' | 'newsletter'
    heading: string
    body?: ReturnType<typeof pt>
    submitLabel: string
    finePrint?: ReturnType<typeof pt>
    successHeading: string
    successBody?: string
    layout: 'split' | 'withImage' | 'inline'
    headingLevel?: 'h1' | 'h2'
    image?: ReturnType<typeof image>
  },
  options?: Settings,
) => ({
  _key: key(),
  _type: 'formBlock',
  headingLevel: 'h2',
  errorText: 'Something went wrong. Please try again, or call us.',
  ...fields,
  ...settings(options),
})

export const ctaBanner = (
  fields: {
    heading: string
    body?: string
    buttons: ReturnType<typeof button>[]
    style: 'photo' | 'accent' | 'surface'
    image?: ReturnType<typeof image>
  },
  anchorId?: string,
) => ({
  _key: key(),
  _type: 'ctaBannerBlock',
  ...fields,
  ...(fields.style === 'photo' && {overlayOpacity: 0.55}),
  theme: 'dark',
  ...(anchorId && {anchorId}),
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
