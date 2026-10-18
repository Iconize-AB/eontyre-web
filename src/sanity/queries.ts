import {defineQuery} from 'next-sanity'

import {blocksProjection} from '../blocks/query'
import {postCardFields} from '../blocks/newsList/query'
import {imageFields, navItemFields, richTextFields} from './fragments'

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && language == $language][0]{
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
  *[_type == "page" && language == $language && select(
    $slug == "" => _id == *[_type == "siteSettings" && language == $language][0].homePage._ref,
    slug.current == $slug
  )][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    "isHome": _id == *[_type == "siteSettings" && language == $language][0].homePage._ref,
    seo{title, description, image, noIndex},
    ${blocksProjection}
  }
`)

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && language == $language && defined(slug.current)]{"slug": slug.current}
`)

export const INTEGRATION_QUERY = defineQuery(`
  *[_type == "integration" && language == $language && slug.current == $slug && hasDetailPage == true][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    shortDescription,
    seo{title, description, image, noIndex},
    ${blocksProjection}
  }
`)

export const INTEGRATION_SLUGS_QUERY = defineQuery(`
  *[_type == "integration" && language == $language && hasDetailPage == true && defined(slug.current)]{"slug": slug.current}
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && language == $language && slug.current == $slug][0]{
    ${postCardFields},
    _type,
    body[]{
      _type == "block" => {${richTextFields}},
      _type == "image" => {_key, _type, caption, ${imageFields}}
    },
    seo{title, description, image, noIndex},
    "related": *[_type == "post" && language == $language && defined(slug.current) && slug.current != $slug]
      | order(publishedAt desc)[0...3]{${postCardFields}}
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && language == $language && defined(slug.current)]{"slug": slug.current}
`)
