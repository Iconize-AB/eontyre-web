import {defineQuery} from 'next-sanity'

import {blocksProjection} from '../blocks/query'
import {imageFields, navItemFields} from './fragments'

export const SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    siteTitle,
    seo{title, description, image},
    logo{${imageFields}},
    logoOnLight{${imageFields}},
    navItems[]{_key, ${navItemFields}},
    secondaryLink{${navItemFields}},
    primaryCta{${navItemFields}},
    tagline,
    footerColumns[]{_key, title, links[]{_key, ${navItemFields}}},
    contact{title, lines, link{${navItemFields}}},
    legal{copyright, link{${navItemFields}}}
  }
`)

/** An empty `$slug` returns the home page chosen in Site settings. */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && select(
    $slug == "" => _id == *[_id == "siteSettings"][0].homePage._ref,
    slug.current == $slug
  )][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    "isHome": _id == *[_id == "siteSettings"][0].homePage._ref,
    seo{title, description, image, noIndex},
    ${blocksProjection}
  }
`)

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{"slug": slug.current}
`)
