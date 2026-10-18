import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import {getDictionary} from '@/i18n/server'
import type {BlockOf} from '@/sanity/content-types'

import {withLabels} from '../labels'
import {IntegrationDirectory, IntegrationDirectoryFallback} from './IntegrationDirectory'

type Block = BlockOf<'integrationDirectoryBlock'>
type Card = NonNullable<NonNullable<Block['integrations']>[number]>

type Labels = {all: string; readMore: string; available: string; comingSoon: string; empty: string}

export async function IntegrationDirectoryBlock({block}: {block: Block}) {
  const dictionary = await getDictionary()
  const integrations = (block.integrations ?? []).filter((item): item is Card => Boolean(item))
  const used = new Set<string | null>(integrations.map((item) => stegaClean(item.category)))
  const chosen: string[] = (block.filterCategories ?? []).map((value) => stegaClean(value))
  // Categories come from the Integration category documents, in their order.
  const categories = (block.categories ?? [])
    .map((category) => ({value: stegaClean(category.value) ?? '', label: category.title ?? ''}))
    .filter((category) => (chosen.length ? chosen.includes(category.value) : used.has(category.value)))

  // Texts set on the block win; empty ones fall back to this language's defaults.
  const {integrations: text} = dictionary
  const labels: Labels = withLabels(
    {all: text.all, readMore: text.readMore, available: text.available, comingSoon: text.comingSoon, empty: text.empty},
    block.labels,
  )

  const props = {
    allLabel: labels.all,
    filterLabel: text.filter,
    categories,
    cardCategories: integrations.map((item) => stegaClean(item.category) ?? ''),
    cards: integrations.map((item) => <IntegrationCard key={item._id} item={item} labels={labels} />),
    showFilter: Boolean(block.showFilter),
  }

  return (
    <Section settings={block}>
      <div className="container-wide">
        {block.heading && <h2 className="type-block-h2 mb-10">{block.heading}</h2>}
        {integrations.length === 0 ? (
          <p className="text-[18px] text-fg-muted">{labels.empty}</p>
        ) : (
          <Suspense fallback={<IntegrationDirectoryFallback {...props} />}>
            <IntegrationDirectory {...props} />
          </Suspense>
        )}
      </div>
    </Section>
  )
}

function IntegrationCard({item, labels}: {item: Card; labels: Labels}) {
  const comingSoon = stegaClean(item.status) === 'comingSoon'
  const accent = Boolean(item.accentTile)

  return (
    <li className="flex min-h-[250px] flex-col gap-3.5 border border-hairline p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={`relative flex size-12 items-center justify-center text-[17px] font-bold ${
            accent ? 'bg-accent text-on-accent' : 'bg-tile text-fg'
          }`}
        >
          {item.logo?.asset ? <SanityImage image={item.logo} sizes="48px" fit="contain" className="p-1.5" /> : item.shortName}
        </span>
        <span className={`text-[13px] font-medium ${comingSoon ? 'text-accent-text' : 'text-status-ok'}`}>
          {comingSoon ? labels.comingSoon : labels.available}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[20px] font-bold tracking-[-0.01em]">{item.name}</h3>
        {item.categoryTitle && <span className="text-[14px] text-fg-subtle">{item.categoryTitle}</span>}
      </div>
      {item.shortDescription && <p className="text-[15px] leading-[1.55] text-fg-muted">{item.shortDescription}</p>}
      {item.href && (
        <SmartLink
          link={{href: item.href, openInNewTab: false}}
          className="link-underline mt-auto self-start text-[15px]"
          aria-label={`${labels.readMore}: ${stegaClean(item.name)}`}
        >
          {labels.readMore}
        </SmartLink>
      )}
    </li>
  )
}

