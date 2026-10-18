import {stegaClean} from 'next-sanity'

import {Button} from '@/components/Button'
import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

type Block = BlockOf<'ctaBannerBlock'>

export function CtaBannerBlock({block}: {block: Block}) {
  const style = stegaClean(block.style) ?? 'photo'
  if (style === 'accent') return <AccentBanner block={block} />
  if (style === 'surface') return <SurfaceBanner block={block} />
  return <PhotoBanner block={block} />
}

function PhotoBanner({block}: {block: Block}) {
  const opacity = Math.min(0.8, Math.max(0, block.overlayOpacity ?? 0.55))

  return (
    <Section
      settings={block}
      padded={false}
      className="relative flex min-h-[520px] items-center overflow-hidden !bg-[#1a1a1a]"
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
        <div className="flex flex-wrap gap-3">
          {block.buttons?.map((button, index) => <Button key={button?._key ?? index} button={button} />)}
        </div>
      </div>
    </Section>
  )
}

/** Orange band with a black pill. Closes most pages. */
function AccentBanner({block}: {block: Block}) {
  // First button: black pill. Second: outline pill. Both dark text on the orange.
  const buttons = (block.buttons ?? [])
    .filter((button): button is NonNullable<typeof button> => Boolean(button?.label))
    .slice(0, 2)
  const pill =
    'inline-flex items-center rounded-full px-[22px] py-[15px] text-[16px] font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-[#141414]'

  return (
    <Section
      settings={block}
      padded={false}
      className="!bg-accent py-[clamp(56px,7vw,88px)] !text-on-accent"
    >
      <div className="container-wide flex flex-wrap items-center justify-between gap-8">
        <h2 className="max-w-[640px] font-display text-[clamp(32px,4vw,56px)] leading-none font-extrabold tracking-[-0.01em] uppercase [font-stretch:115%]">
          {block.heading}
        </h2>
        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {buttons.map((button, index) => (
              <SmartLink
                key={button._key ?? index}
                link={button.link}
                className={
                  index === 0
                    ? `${pill} bg-[#141414] text-white hover:bg-[#2a2725]`
                    : `${pill} border border-[#141414] text-[#141414] hover:bg-[#141414]/10`
                }
              >
                {button.label}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

function SurfaceBanner({block}: {block: Block}) {
  return (
    <Section
      settings={{...block, background: 'surface'}}
      padded={false}
      className="py-[clamp(56px,7vw,96px)]"
    >
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-x-16 gap-y-8">
        <div>
          <h2 className="type-block-h2 mb-4">{block.heading}</h2>
          {block.body && <p className="max-w-[520px] text-[18px] leading-[1.55] text-fg-muted">{block.body}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {block.buttons?.map((button, index) => <Button key={button?._key ?? index} button={button} />)}
        </div>
      </div>
    </Section>
  )
}
