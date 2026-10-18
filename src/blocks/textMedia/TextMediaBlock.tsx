import {stegaClean} from 'next-sanity'

import {RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

export function TextMediaBlock({block}: {block: BlockOf<'textMediaBlock'>}) {
  const imageLeft = stegaClean(block.imagePosition) !== 'right'
  const numbered = stegaClean(block.listStyle) === 'numbered'
  const list = block.list?.filter(Boolean) ?? []
  const ListTag = numbered ? 'ol' : 'ul'

  const image = (
    <div className="relative aspect-[3/2] overflow-hidden bg-surface">
      <SanityImage image={block.image} sizes="(min-width: 1280px) 610px, (min-width: 960px) 48vw, 100vw" />
    </div>
  )

  return (
    <Section settings={block}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-16 gap-y-12">
        {imageLeft && image}
        <div>
          <h2 className="type-block-h2 mb-5">{block.heading}</h2>
          <RichText value={block.body} className="max-w-[540px]" />

          {list.length > 0 && (
            <ListTag className="mt-7 flex flex-col border-b border-hairline text-[16px]">
              {list.map((item, index) =>
                numbered ? (
                  <li key={index} className="grid grid-cols-[32px_1fr] border-t border-hairline py-3.5">
                    <span className="font-bold text-accent-text">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ) : (
                  <li key={index} className="border-t border-hairline py-3">
                    {item}
                  </li>
                ),
              )}
            </ListTag>
          )}

          {block.link?.link?.href && block.link.label && (
            <SmartLink link={block.link.link} className="link-underline mt-7 inline-block text-[16px]">
              {block.link.label}
            </SmartLink>
          )}
        </div>
        {!imageLeft && image}
      </div>
    </Section>
  )
}
