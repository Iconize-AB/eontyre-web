import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import {Blocks} from '@/blocks'
import {Breadcrumb} from '@/components/Breadcrumb'
import type {PageBlock} from '@/sanity/content-types'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {buildMetadata} from '@/sanity/metadata'
import {INTEGRATION_QUERY, INTEGRATION_SLUGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/integrations/[slug]'>

export async function generateStaticParams() {
  const {data} = await cachedSanity({query: INTEGRATION_SLUGS_QUERY, ...publishedFetchOptions})
  // Cache Components needs at least one param; a placeholder simply 404s (e.g. while all posts are drafts).
  return data.length ? data.map(({slug}) => ({slug})) : [{slug: '__placeholder__'}]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await cachedSanity({query: INTEGRATION_QUERY, params: {slug}, ...publishedFetchOptions})
  if (!data) return {}
  return buildMetadata({title: data.name, description: data.shortDescription, seo: data.seo})
}

export default async function IntegrationPage({params}: Props) {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense>
        <DraftIntegration params={params} />
      </Suspense>
    )
  }

  const {slug} = await params
  return <IntegrationContent slug={slug} {...publishedFetchOptions} />
}

async function DraftIntegration({params}: Pick<Props, 'params'>) {
  const {slug} = await params
  return <IntegrationContent slug={slug} {...await getDraftFetchOptions()} />
}

async function IntegrationContent({slug, ...options}: {slug: string} & FetchOptions) {
  const {data: integration} = await cachedSanity({query: INTEGRATION_QUERY, params: {slug}, ...options})
  if (!integration) notFound()

  return (
    <>
      <Breadcrumb parent={{label: 'Integrations', href: '/integrations'}} current={integration.name} />
      {/* Same page-builder projection as pages, so the block types line up. */}
      <Blocks blocks={integration.blocks as PageBlock[] | null} />
    </>
  )
}
