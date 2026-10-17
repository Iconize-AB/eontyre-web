import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound, redirect} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {Blocks} from '@/blocks'
import type {PageData} from '@/sanity/content-types'
import {urlFor} from '@/sanity/image'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {PAGE_QUERY, PAGE_SLUGS_QUERY, SETTINGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/[[...slug]]'>

const toSlug = (segments: string[] | undefined) => segments?.join('/') ?? ''

export async function generateStaticParams() {
  const {data} = await cachedSanity({query: PAGE_SLUGS_QUERY, ...publishedFetchOptions})
  // The home page ("/") is always prerendered, even before any content exists.
  return [{slug: []}, ...data.map(({slug}) => ({slug: slug.split('/')}))]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const slug = toSlug((await params).slug)
  const [{data: page}, {data: settings}] = await Promise.all([
    cachedSanity({query: PAGE_QUERY, params: {slug}, ...publishedFetchOptions}),
    cachedSanity({query: SETTINGS_QUERY, ...publishedFetchOptions}),
  ])
  if (!page) return {}

  const siteTitle = settings?.siteTitle ?? 'Eontyre'
  const title = page.seo?.title || (page.isHome ? settings?.seo?.title || siteTitle : page.title)
  const description = page.seo?.description || settings?.seo?.description || undefined
  const shareImage = page.seo?.image?.asset ? page.seo.image : settings?.seo?.image?.asset ? settings.seo.image : null

  return {
    title: page.isHome ? {absolute: title} : `${title} | ${siteTitle}`,
    description,
    robots: page.seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      title,
      description,
      siteName: siteTitle,
      images: shareImage ? [{url: urlFor(shareImage).width(1200).height(630).fit('crop').url(), width: 1200, height: 630}] : undefined,
    },
  }
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

  const slug = toSlug((await params).slug)
  return <PageContent slug={slug} {...publishedFetchOptions} />
}

async function DraftPage({params}: Pick<Props, 'params'>) {
  const slug = toSlug((await params).slug)
  const options = await getDraftFetchOptions()
  return <PageContent slug={slug} {...options} />
}

async function PageContent({slug, ...options}: {slug: string} & FetchOptions) {
  const {data} = await cachedSanity({query: PAGE_QUERY, params: {slug}, ...options})
  const page = data as PageData | null
  if (!page) notFound()

  // The home page lives at "/", not at its own slug.
  if (slug && stegaClean(page.isHome)) redirect('/')

  return <Blocks blocks={page.blocks} />
}
