'use client'

import {useState, type ReactNode} from 'react'

import {FilterChips, type Chip} from '@/components/FilterChips'

const ALL = 'all'

interface Props {
  rows: ReactNode[]
  /** Category of each row, in the same order as `rows`. */
  rowCategories: string[]
  categories: {value: string; label: string}[]
  showFilter: boolean
  pageSize: number
  labels: {all: string; loadMore: string}
}

/** Category filter and "Load more" paging for the news list. */
export function NewsList({rows, rowCategories, categories, showFilter, pageSize, labels}: Props) {
  const [active, setActive] = useState(ALL)
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const filtered = rows.filter((_, index) => active === ALL || rowCategories[index] === active)
  const chips: Chip[] = [{value: ALL, label: labels.all}, ...categories]

  function select(value: string) {
    setActive(value)
    setVisibleCount(pageSize)
  }

  return (
    <>
      {showFilter && categories.length > 1 && (
        <div className="mb-2 border-y border-hairline py-6">
          <FilterChips chips={chips} active={active} onChange={select} label="Filter by category" />
        </div>
      )}
      <ul>{filtered.slice(0, visibleCount)}</ul>
      {filtered.length > visibleCount && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
            className="cursor-pointer rounded-full border border-fg px-[22px] py-[14px] text-[16px] font-semibold text-fg transition-colors duration-150 hover:bg-fg/8"
          >
            {labels.loadMore}
          </button>
        </div>
      )}
    </>
  )
}
