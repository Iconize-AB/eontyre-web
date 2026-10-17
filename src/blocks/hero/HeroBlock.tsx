import {stegaClean} from 'next-sanity'

import {Button} from '@/components/Button'
import {SanityImage} from '@/components/SanityImage'
import type {BlockOf} from '@/sanity/content-types'

import {PlateSearch} from './PlateSearch'

const heights = {
  tall: 'min-h-[760px]',
  fullscreen: 'h-screen min-h-[720px] max-h-[1100px]',
} as const

export function HeroBlock({block, isFirst}: {block: BlockOf<'heroBlock'>; isFirst: boolean}) {
  const theme = stegaClean(block.theme) ?? 'dark'
  const height = stegaClean(block.height) === 'fullscreen' ? 'fullscreen' : 'tall'
  const action = stegaClean(block.action)
  const HeadingTag = isFirst ? 'h1' : 'h2'

  return (
    <section
      data-theme={theme}
      className={`relative flex items-end overflow-hidden bg-[#1a120b] text-fg ${heights[height]}`}
    >
      <SanityImage image={block.image} sizes="100vw" preload={isFirst} />
      <div
        aria-hidden="true"
        // On phones the text block covers more of the photo, so the fade runs the full height.
        className="absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(0deg,var(--bg)_8%,transparent)] md:h-[70%]"
      />

      <div className="container-site relative pb-16">
        {block.eyebrow && <p className="mb-3 text-[20px] text-fg-on-image-strong">{block.eyebrow}</p>}
        <HeadingTag className="type-h1">{block.heading}</HeadingTag>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8">
          {block.body && (
            <p className="max-w-[520px] text-[19px] leading-[1.55] text-fg-on-image">{block.body}</p>
          )}

          {action === 'plateSearch' && block.plateSearch && (
            <PlateSearch
              placeholder={block.plateSearch.placeholder ?? 'ABC 123'}
              buttonLabel={block.plateSearch.buttonLabel ?? 'Find tyres'}
              targetUrl={stegaClean(block.plateSearch.targetUrl) || '/webshop'}
            />
          )}

          {action === 'buttons' && block.buttons && block.buttons.length > 0 && (
            <div className="flex w-full max-w-[520px] flex-wrap gap-3 justify-self-end sm:justify-end">
              {block.buttons.map((button) => (
                <Button key={button._key} button={button} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
