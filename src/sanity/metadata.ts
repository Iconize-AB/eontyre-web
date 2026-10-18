import type {Metadata} from 'next'

import {domains, localeIds, localeInfo, type Locale} from '@/i18n/config'
import {localizedUrl} from '@/i18n/paths'
import {pathInLocale} from '@/i18n/groups'
import {getSwitcherGroups} from '@/i18n/translations'

import {urlFor} from './image'
import {cachedSanity, publishedFetchOptions} from './live'
import {i18nParams} from './params'
import {SETTINGS_QUERY} from './queries'

interface SeoInput {
  title?: string | null
  description?: string | null
  image?: {asset?: unknown} | null
  noIndex?: boolean | null
}

/**
 * Page metadata from a document's SEO fields, falling back to Site settings.
 * `path` is the page's address without a language prefix, e.g. "/webshop".
 * With one domain per language it also sets the canonical address and the
 * hreflang links to the other languages.
 */
export async function buildMetadata({
  locale,
  path,
  title: documentTitle,
  description: documentDescription,
  seo,
  isHome = false,
}: {
  locale: Locale
  path: string
  title: string
  description?: string | null
  seo: SeoInput | null | undefined
  isHome?: boolean
}): Promise<Metadata> {
  const [{data: settings}, groups] = await Promise.all([
    cachedSanity({query: SETTINGS_QUERY, params: i18nParams(locale), ...publishedFetchOptions}),
    getSwitcherGroups(),
  ])

  const siteTitle = settings?.siteTitle ?? 'Eontyre'
  const title = seo?.title || (isHome ? settings?.seo?.title || siteTitle : documentTitle)
  const description = seo?.description || documentDescription || settings?.seo?.description || undefined
  const shareImage = seo?.image?.asset ? seo.image : settings?.seo?.image?.asset ? settings.seo.image : null

  // Absolute alternate addresses need the domains; under path prefixes they are skipped.
  let alternates: Metadata['alternates']
  if (domains) {
    const languages: Record<string, string> = {}
    for (const id of localeIds) {
      const target = pathInLocale(groups, locale, path, id)
      languages[localeInfo(id).htmlLang] = localizedUrl(id, target)
    }
    alternates = {canonical: localizedUrl(locale, path), languages}
  }

  return {
    title: isHome ? {absolute: title} : `${title} | ${siteTitle}`,
    description,
    alternates,
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      title,
      description,
      siteName: siteTitle,
      locale: localeInfo(locale).intl.replace('-', '_'),
      images: shareImage
        ? [{url: urlFor(shareImage as never).width(1200).height(630).fit('crop').url(), width: 1200, height: 630}]
        : undefined,
    },
  }
}
