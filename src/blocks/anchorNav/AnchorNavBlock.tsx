import {stegaClean} from 'next-sanity'

import {Section} from '@/components/Section'
import type {BlockOf} from '@/sanity/content-types'

export function AnchorNavBlock({block}: {block: BlockOf<'anchorNavBlock'>}) {
  if (!block.items?.length) return null

  return (
    <Section settings={block} padded={false} as="nav" aria-label="On this page" className="border-b border-line">
      <div className="container-wide flex flex-wrap gap-x-8 gap-y-2 text-[15px] font-medium">
        {block.items.map((item) => (
          <a
            key={item._key}
            href={`#${stegaClean(item.anchorId)}`}
            className="py-[18px] text-fg transition-colors duration-150 hover:text-accent-text"
          >
            {item.label}
          </a>
        ))}
      </div>
    </Section>
  )
}
