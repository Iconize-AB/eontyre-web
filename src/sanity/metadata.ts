import type {Metadata} from 'next'

import {urlFor} from './image'
import {cachedSanity, publishedFetchOptions} from './live'
import {SETTINGS_QUERY} from './queries'

interface SeoInput {
  title?: string | null
  description?: string | null
  image?: {asset?: unknown} | null
  noIndex?: boolean | null
}

/** Page metadata from a document's SEO fields, falling back to Site settings. */
export async function buildMetadata({
  title: documentTitle,
  description: documentDescription,
  seo,
  isHome = false,
}: {
  title: string
  description?: string | null
  seo: SeoInput | null | undefined
  isHome?: boolean
}): Promise<Metadata> {
  const {data: settings} = await cachedSanity({query: SETTINGS_QUERY, ...publishedFetchOptions})

  const siteTitle = settings?.siteTitle ?? 'Eontyre'
  const title = seo?.title || (isHome ? settings?.seo?.title || siteTitle : documentTitle)
  const description = seo?.description || documentDescription || settings?.seo?.description || undefined
  const shareImage = seo?.image?.asset ? seo.image : settings?.seo?.image?.asset ? settings.seo.image : null

  return {
    title: isHome ? {absolute: title} : `${title} | ${siteTitle}`,
    description,
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      title,
      description,
      siteName: siteTitle,
      images: shareImage
        ? [{url: urlFor(shareImage as never).width(1200).height(630).fit('crop').url(), width: 1200, height: 630}]
        : undefined,
    },
  }
}
