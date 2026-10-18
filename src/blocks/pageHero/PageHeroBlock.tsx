import {stegaClean} from 'next-sanity'
import type {ReactNode} from 'react'

import {Button} from '@/components/Button'
import {hasRichText, RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {Eyebrow, Section} from '@/components/Section'
import type {BlockOf} from '@/sanity/content-types'

type Block = BlockOf<'pageHeroBlock'>

export function PageHeroBlock({block, isFirst}: {block: Block; isFirst: boolean}) {
  switch (stegaClean(block.media)) {
    case 'image':
      return <ImageHero block={block} isFirst={isFirst} />
    case 'imageTop':
      return <ImageTopHero block={block} isFirst={isFirst} />
    case 'code':
      return <CodeHero block={block} />
    default:
      return <TextHero block={block} />
  }
}

function Heading({block}: {block: Block}) {
  return (
    <>
      <Eyebrow>{block.eyebrow}</Eyebrow>
      <h1 className="type-page-h1">{block.heading}</h1>
    </>
  )
}

function Actions({block}: {block: Block}) {
  const buttons = block.buttons?.filter((button) => button.label) ?? []
  const lines = block.contactLines ?? []
  if (!buttons.length && !lines.length) return null

  return (
    <>
      {buttons.length > 0 && (
        <div className="mt-9 flex flex-wrap gap-3">
          {buttons.map((button) => (
            <Button key={button._key} button={button} />
          ))}
        </div>
      )}
      {lines.length > 0 && (
        <div className="mt-9 flex flex-col gap-1">
          {lines.map((line, index) => (
            <ContactLine key={line._key} href={line.href} primary={index === 0}>
              {line.label}
            </ContactLine>
          ))}
        </div>
      )}
    </>
  )
}

function ContactLine({href, primary, children}: {href: string | null; primary: boolean; children: ReactNode}) {
  const className = primary
    ? 'text-[32px] font-bold tracking-[-0.02em] text-fg'
    : 'text-[18px] text-fg-muted underline underline-offset-3 hover:text-fg'
  const url = stegaClean(href)
  return url ? (
    <a href={url} className={`self-start transition-colors duration-150 ${className}`}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  )
}

/** Text only. With a body, the body sits in a right column aligned to the bottom of the heading. */
function TextHero({block}: {block: Block}) {
  const withBody = hasRichText(block.body)

  return (
    <Section
      settings={block}
      padded={false}
      className={`block-pt ${withBody ? 'pb-12' : 'pb-[clamp(40px,5vw,64px)]'}`}
    >
      {withBody ? (
        <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-6">
          <div>
            <Heading block={block} />
            <Actions block={block} />
          </div>
          <RichText value={block.body} size="xl" className="max-w-[520px]" />
        </div>
      ) : (
        <div className="container-wide [&_h1]:max-w-[960px]">
          <Heading block={block} />
          <Actions block={block} />
        </div>
      )}
    </Section>
  )
}

/** Text left, photo right at full hero height. */
function ImageHero({block, isFirst}: {block: Block; isFirst: boolean}) {
  return (
    <Section settings={block} padded={false} className="border-b border-line">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))]">
        <div className="flex flex-col justify-center px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,112px)]">
          <Heading block={block} />
          <RichText value={block.body} size="xl" className="mt-7 max-w-[520px]" />
          <Actions block={block} />
        </div>
        <div className="relative min-h-[520px] bg-surface">
          <SanityImage image={block.image} sizes="(min-width: 1280px) 640px, (min-width: 960px) 50vw, 100vw" preload={isFirst} />
        </div>
      </div>
    </Section>
  )
}

/** Full-width photo, then heading left and body right on the surface colour. */
function ImageTopHero({block, isFirst}: {block: Block; isFirst: boolean}) {
  return (
    <Section settings={block} padded={false}>
      <div className="relative h-[clamp(320px,38vw,520px)] overflow-hidden bg-surface">
        <SanityImage image={block.image} sizes="100vw" preload={isFirst} />
      </div>
      <div data-background="surface" className="border-b border-line bg-surface">
        <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-16 gap-y-6 pt-12 pb-14">
          <div>
            <Heading block={block} />
          </div>
          <div>
            <RichText value={block.body} size="xl" className="max-w-[520px]" />
            <Actions block={block} />
          </div>
        </div>
      </div>
    </Section>
  )
}

/** Text left, an API request and response right. */
function CodeHero({block}: {block: Block}) {
  return (
    <Section settings={block} padded={false} className="block-pt block-pb border-b border-line">
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-x-16 gap-y-12">
        <div>
          <Heading block={block} />
          <RichText value={block.body} size="xl" className="mt-7 max-w-[520px]" />
          <Actions block={block} />
        </div>
        {block.code && (
          <figure className="m-0 overflow-hidden border border-[#2E2B28] bg-[#0A0A0A]">
            <figcaption className="flex items-center gap-2.5 border-b border-[#2E2B28] px-4 py-3 font-mono text-[13px]">
              <span className="font-medium text-[#F26B1D]">{block.codeMethod}</span>
              <span className="truncate text-[#E8E3DD]">{block.codePath}</span>
            </figcaption>
            <pre
              tabIndex={0}
              className="m-0 overflow-x-auto px-[18px] py-5 font-mono text-[13px] leading-[1.7] whitespace-pre text-[#C9C3BC]"
            >
              {block.code}
            </pre>
          </figure>
        )}
      </div>
    </Section>
  )
}
