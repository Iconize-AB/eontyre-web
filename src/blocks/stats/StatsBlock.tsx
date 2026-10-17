import {stegaClean} from 'next-sanity'

import type {BlockOf} from '@/sanity/content-types'

export function StatsBlock({block}: {block: BlockOf<'statsBlock'>}) {
  if (!block.items?.length) return null
  const theme = stegaClean(block.theme) ?? 'dark'

  return (
    <section data-theme={theme} className="border-y border-line bg-bg text-fg">
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
