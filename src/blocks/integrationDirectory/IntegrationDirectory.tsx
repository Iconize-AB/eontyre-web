'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import type {ReactNode} from 'react'

import {FilterChips, type Chip} from '@/components/FilterChips'

const ALL = 'all'

export interface DirectoryCategory {
  value: string
  label: string
}

interface Props {
  allLabel: string
  filterLabel: string
  categories: DirectoryCategory[]
  /** Category of each card, in the same order as `cards`. */
  cardCategories: string[]
  cards: ReactNode[]
  showFilter: boolean
}

/** Client-side category filter. The selected category is kept in the URL (?category=accounting). */
export function IntegrationDirectory(props: Props) {
  const selected = useSearchParams().get('category') ?? ALL
  const router = useRouter()
  const pathname = usePathname()

  function select(value: string) {
    const url = value === ALL ? pathname : `${pathname}?category=${encodeURIComponent(value)}`
    router.replace(url, {scroll: false})
  }

  return <DirectoryView {...props} selected={selected} onSelect={select} />
}

/** Unfiltered view, rendered while the URL is not yet available during prerendering. */
export function IntegrationDirectoryFallback(props: Props) {
  return <DirectoryView {...props} selected={ALL} />
}

function DirectoryView({
  allLabel,
  filterLabel,
  categories,
  cardCategories,
  cards,
  showFilter,
  selected,
  onSelect,
}: Props & {selected: string; onSelect?: (value: string) => void}) {
  const active = categories.some((category) => category.value === selected) ? selected : ALL
  const chips: Chip[] = [
    {value: ALL, label: allLabel, count: cards.length},
    ...categories.map((category) => ({
      ...category,
      count: cardCategories.filter((value) => value === category.value).length,
    })),
  ]
  const visible = cards.filter((_, index) => active === ALL || cardCategories[index] === active)

  return (
    <>
      {showFilter && categories.length > 1 && (
        <div className="mb-8 border-b border-hairline pb-6">
          <FilterChips chips={chips} active={active} onChange={(value) => onSelect?.(value)} label={filterLabel} />
        </div>
      )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-5">{visible}</ul>
    </>
  )
}
