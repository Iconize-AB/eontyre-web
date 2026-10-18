import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound, redirect} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {locale as localeParam} from 'next/root-params'
import {Suspense} from 'react'

import {Blocks} from '@/blocks'
import {isLocale, type Locale} from '@/i18n/config'
import {localizedPath} from '@/i18n/paths'
import type {PageData} from '@/sanity/content-types'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {buildMetadata} from '@/sanity/metadata'
import {i18nParams} from '@/sanity/params'
import {PAGE_QUERY, PAGE_SLUGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/[locale]/[[...slug]]'>

const toSlug = (segments: string[] | undefined) => segments?.join('/') ?? ''

export async function generateStaticParams() {
  const locale = await localeParam()
  if (!isLocale(locale)) return [{slug: []}]
  const {data} = await cachedSanity({query: PAGE_SLUGS_QUERY, params: {language: locale}, ...publishedFetchOptions})
  // The home page ("/") is always prerendered, even before any content exists.
  return [{slug: []}, ...data.map(({slug}) => ({slug: slug.split('/')}))]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug: segments} = await params
  if (!isLocale(locale)) return {}
  const slug = toSlug(segments)
  const {data: page} = await cachedSanity({
    query: PAGE_QUERY,
    params: {slug, ...i18nParams(locale)},
    ...publishedFetchOptions,
  })
  if (!page) return {}
  return buildMetadata({
    locale,
    path: page.isHome ? '/' : `/${page.slug}`,
    title: page.title,
    seo: page.seo,
    isHome: page.isHome,
  })
}

export default async function Page({params}: Props) {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense>
        <DraftPage params={params} />
      </Suspense>
    )
  }

  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  return <PageContent locale={locale} slug={toSlug(slug)} {...publishedFetchOptions} />
}

async function DraftPage({params}: Pick<Props, 'params'>) {
  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  const options = await getDraftFetchOptions()
  return <PageContent locale={locale} slug={toSlug(slug)} {...options} />
}

async function PageContent({locale, slug, ...options}: {locale: Locale; slug: string} & FetchOptions) {
  const {data} = await cachedSanity({query: PAGE_QUERY, params: {slug, ...i18nParams(locale)}, ...options})
  const page = data as PageData | null
  if (!page) notFound()

  // The home page lives at the language's root, not at its own slug.
  if (slug && stegaClean(page.isHome)) redirect(localizedPath(locale, '/'))

  return <Blocks blocks={page.blocks} />
}
