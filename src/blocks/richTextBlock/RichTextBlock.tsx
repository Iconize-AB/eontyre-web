import {stegaClean} from 'next-sanity'

import {RichText} from '@/components/RichText'
import {Section} from '@/components/Section'
import type {BlockOf} from '@/sanity/content-types'

const headingClass =
  'max-w-[480px] font-display text-[clamp(28px,3vw,40px)] leading-[1.1] font-extrabold tracking-[-0.01em] uppercase [font-stretch:115%]'

export function RichTextBlock({block}: {block: BlockOf<'richTextBlock'>}) {
  if (stegaClean(block.layout) === 'single') {
    return (
      <Section settings={block}>
        <div className="container-wide">
          <div className="max-w-[720px]">
            {block.heading && <h2 className={`${headingClass} mb-8`}>{block.heading}</h2>}
            <RichText value={block.body} size="prose" />
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section settings={block}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-16 gap-y-10">
        {block.heading ? <h2 className={headingClass}>{block.heading}</h2> : <span />}
        <RichText value={block.body} size="prose" />
      </div>
    </Section>
  )
}
