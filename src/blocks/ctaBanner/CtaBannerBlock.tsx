import {stegaClean} from 'next-sanity'

import {Button} from '@/components/Button'
import {SanityImage} from '@/components/SanityImage'
import type {BlockOf} from '@/sanity/content-types'

export function CtaBannerBlock({block}: {block: BlockOf<'ctaBannerBlock'>}) {
  const theme = stegaClean(block.theme) ?? 'dark'
  const opacity = Math.min(0.8, Math.max(0, block.overlayOpacity ?? 0.55))

  return (
    <section
      data-theme={theme}
      className="relative flex min-h-[520px] items-center overflow-hidden bg-[#1a1a1a] text-fg"
    >
      <SanityImage image={block.image} sizes="100vw" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{background: `color-mix(in srgb, var(--bg) ${Math.round(opacity * 100)}%, transparent)`}}
      />

      <div className="container-site relative py-16">
        <h2 className="type-h2-lg mb-5 max-w-[760px]">{block.heading}</h2>
        {block.body && (
          <p className="mb-8 max-w-[520px] text-[19px] leading-[1.55] text-fg-on-image-strong">{block.body}</p>
        )}
        <Button button={block.button} />
      </div>
    </section>
  )
}
