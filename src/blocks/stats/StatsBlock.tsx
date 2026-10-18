import {stegaClean} from 'next-sanity'

import type {BlockOf} from '@/sanity/content-types'

export function StatsBlock({block}: {block: BlockOf<'statsBlock'>}) {
  if (!block.items?.length) return null
  const theme = stegaClean(block.theme) ?? 'dark'

  return (
    <section
      id={stegaClean(block.anchorId) || undefined}
      data-theme={theme}
      data-background={stegaClean(block.background) === 'surface' ? 'surface' : 'default'}
      className={`border-y border-line text-fg ${stegaClean(block.background) === 'surface' ? 'bg-surface' : 'bg-bg'}`}
    >
      <dl className="container-site grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {block.items.map((item) => (
          <div key={item._key} className="flex flex-col gap-1.5 py-8">
            <dt className="order-last text-[15px] leading-[normal] text-fg-subtle">{item.label}</dt>
            <dd className="type-stat leading-[normal] text-accent-text">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
