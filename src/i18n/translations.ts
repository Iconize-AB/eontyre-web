import {defineQuery} from 'next-sanity'

import {cachedSanity, publishedFetchOptions} from '@/sanity/live'

import {localeIds, type Locale} from './config'
import type {SwitcherGroup} from './groups'

const TRANSLATIONS_QUERY = defineQuery(`
  *[_type == "translation.metadata"]{
    "items": translations[]{
      language,
      "type": value->_type,
      "slug": value->slug.current,
      "isHome": value->_id in *[_type == "siteSettings"].homePage._ref
    }
  }
`)

const pathFor = (type: string | null, slug: string | null, isHome: boolean | null) => {
  if (isHome) return '/'
  if (!slug) return null
  if (type === 'integration') return `/integrations/${slug}`
  if (type === 'post') return `/news/${slug}`
  if (type === 'page') return `/${slug}`
  return null
}

/**
 * Where each page lives in every language, from the translation links editors
 * make in the Studio. Used by the language switcher and the hreflang tags.
 *
 * translation.metadata documents are private in Sanity, so this needs the
 * read token (SANITY_API_READ_TOKEN). Without it the list is empty and the
 * switcher assumes a page has the same path in every language.
 */
export async function getSwitcherGroups(): Promise<SwitcherGroup[]> {
  const {data} = await cachedSanity({query: TRANSLATIONS_QUERY, ...publishedFetchOptions})

  return data
    .map(({items}) => {
      const group: SwitcherGroup = {}
      for (const item of items ?? []) {
        const language = item.language as Locale | null
        const path = pathFor(item.type, item.slug, item.isHome)
        if (language && localeIds.includes(language) && path) group[language] = path
      }
      return group
    })
    .filter((group) => Object.keys(group).length > 1)
}
