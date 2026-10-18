import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {locale as localeParam} from 'next/root-params'
import {Suspense} from 'react'

import {Blocks} from '@/blocks'
import {Breadcrumb} from '@/components/Breadcrumb'
import {isLocale, type Locale} from '@/i18n/config'
import type {PageBlock} from '@/sanity/content-types'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {buildMetadata} from '@/sanity/metadata'
import {i18nParams} from '@/sanity/params'
import {INTEGRATION_QUERY, INTEGRATION_SLUGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/[locale]/integrations/[slug]'>

export async function generateStaticParams() {
  const locale = await localeParam()
  const {data} = isLocale(locale)
    ? await cachedSanity({query: INTEGRATION_SLUGS_QUERY, params: {language: locale}, ...publishedFetchOptions})
    : {data: []}
  // Cache Components needs at least one param; a placeholder simply 404s.
  return data.length ? data.map(({slug}) => ({slug})) : [{slug: '__placeholder__'}]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params
  if (!isLocale(locale)) return {}
  const {data} = await cachedSanity({
    query: INTEGRATION_QUERY,
    params: {slug, ...i18nParams(locale)},
    ...publishedFetchOptions,
  })
  if (!data) return {}
  return buildMetadata({
    locale,
    path: `/integrations/${data.slug}`,
    title: data.name,
    description: data.shortDescription,
    seo: data.seo,
  })
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

  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  return <IntegrationContent locale={locale} slug={slug} {...publishedFetchOptions} />
}

async function DraftIntegration({params}: Pick<Props, 'params'>) {
  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  return <IntegrationContent locale={locale} slug={slug} {...await getDraftFetchOptions()} />
}

async function IntegrationContent({locale, slug, ...options}: {locale: Locale; slug: string} & FetchOptions) {
  const {data: integration} = await cachedSanity({
    query: INTEGRATION_QUERY,
    params: {slug, ...i18nParams(locale)},
    ...options,
  })
  if (!integration) notFound()

  return (
    <>
      <Breadcrumb section="integrations" current={integration.name} />
      {/* Same page-builder projection as pages, so the block types line up. */}
      <Blocks blocks={integration.blocks as PageBlock[] | null} />
    </>
  )
}
