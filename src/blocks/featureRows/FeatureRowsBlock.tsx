import {stegaClean} from 'next-sanity'

import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

type Block = BlockOf<'featureRowsBlock'>

export function FeatureRowsBlock({block}: {block: Block}) {
  if (!block.rows?.length) return null
  return stegaClean(block.style) === 'editorial' ? <EditorialRows block={block} /> : <PanelRows block={block} />
}

/** Home: stacked panels on `surface`, each row one link. */
function PanelRows({block}: {block: Block}) {
  const alternate = stegaClean(block.imagePosition) === 'alternate'
  const noTop = stegaClean(block.paddingTop) === 'none'
  const RowHeading = block.heading ? 'h3' : 'h2'

  return (
    <Section settings={block} padded={false} className={`${noTop ? '' : 'section-pt'} section-pb`}>
      <div className="container-wide">
        {block.heading && <h2 className="type-h2 mb-10">{block.heading}</h2>}

        <div className="flex flex-col gap-[2px]">
          {block.rows?.map((row, index) => {
            const imageLeft = alternate && index % 2 === 1
            const rowClasses = `group grid bg-surface text-fg transition-colors duration-150 ease-in-out hover:bg-surface-hover ${
              imageLeft
                ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'
                : 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'
            }`

            const content = (
              <>
                <div className="flex flex-col justify-center gap-4 p-[clamp(32px,4vw,56px)]">
                  <span className="font-mono text-[13px] text-accent-text">{String(index + 1).padStart(2, '0')}</span>
                  <RowHeading className="type-h2">{row.title}</RowHeading>
                  {row.body && <p className="max-w-[440px] text-[17px] leading-[1.55] text-fg-muted">{row.body}</p>}
                </div>
                <div className={`relative order-first min-h-[320px] ${imageLeft ? '' : 'md:order-last'}`}>
                  <SanityImage image={row.image} sizes="(min-width: 1280px) 600px, (min-width: 768px) 48vw, 100vw" />
                </div>
              </>
            )

            return row.link?.href ? (
              <SmartLink key={row._key} link={row.link} className={rowClasses}>
                {content}
              </SmartLink>
            ) : (
              <div key={row._key} className={rowClasses}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

/** Who it's for: rows divided by hairlines, photo 3:2 beside the text, text link per row. */
function EditorialRows({block}: {block: Block}) {
  const alternate = stegaClean(block.imagePosition) === 'alternate'
  const RowHeading = block.heading ? 'h3' : 'h2'

  return (
    <Section settings={block}>
      <div className="container-wide">
        {block.heading && <h2 className="type-block-h2 mb-10">{block.heading}</h2>}

        <div className="flex flex-col gap-[clamp(48px,6vw,88px)]">
          {block.rows?.map((row, index) => {
            // With "alternate", the first row has the image on the left.
            const imageLeft = alternate && index % 2 === 0
            const image = (
              <div className="relative aspect-[3/2] overflow-hidden bg-surface">
                <SanityImage image={row.image} sizes="(min-width: 1280px) 610px, (min-width: 960px) 48vw, 100vw" />
              </div>
            )
            return (
              <div
                key={row._key}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-16 gap-y-8 border-t border-hairline pt-[clamp(40px,5vw,64px)]"
              >
                {imageLeft && image}
                <div>
                  <RowHeading className="mb-4 font-display text-[clamp(28px,3vw,40px)] leading-[1.05] font-extrabold tracking-[-0.01em] uppercase [font-stretch:115%]">
                    {row.title}
                  </RowHeading>
                  {row.body && <p className="mb-5 text-[18px] leading-[1.55] text-fg-muted">{row.body}</p>}
                  {row.link?.href && row.linkLabel && (
                    <SmartLink link={row.link} className="link-underline text-[16px]">
                      {row.linkLabel}
                    </SmartLink>
                  )}
                </div>
                {!imageLeft && image}
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
