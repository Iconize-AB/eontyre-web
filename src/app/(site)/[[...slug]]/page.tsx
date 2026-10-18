import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound, redirect} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {Blocks} from '@/blocks'
import type {PageData} from '@/sanity/content-types'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {buildMetadata} from '@/sanity/metadata'
import {PAGE_QUERY, PAGE_SLUGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/[[...slug]]'>

const toSlug = (segments: string[] | undefined) => segments?.join('/') ?? ''

export async function generateStaticParams() {
  const {data} = await cachedSanity({query: PAGE_SLUGS_QUERY, ...publishedFetchOptions})
  // The home page ("/") is always prerendered, even before any content exists.
  return [{slug: []}, ...data.map(({slug}) => ({slug: slug.split('/')}))]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const slug = toSlug((await params).slug)
  const {data: page} = await cachedSanity({query: PAGE_QUERY, params: {slug}, ...publishedFetchOptions})
  if (!page) return {}
  return buildMetadata({title: page.title, seo: page.seo, isHome: page.isHome})
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
