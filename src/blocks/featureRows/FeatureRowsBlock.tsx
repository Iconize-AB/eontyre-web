import {stegaClean} from 'next-sanity'

import {SanityImage} from '@/components/SanityImage'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

import {spacingClasses} from '../spacing'

export function FeatureRowsBlock({block}: {block: BlockOf<'featureRowsBlock'>}) {
  if (!block.rows?.length) return null
  const theme = stegaClean(block.theme) ?? 'dark'
  const alternate = stegaClean(block.imagePosition) === 'alternate'
  const RowHeading = block.heading ? 'h3' : 'h2'

  return (
    <section data-theme={theme} className={`bg-bg text-fg ${spacingClasses(block.spacing)}`}>
      <div className="container-wide">
        {block.heading && <h2 className="type-h2 mb-10">{block.heading}</h2>}

        <div className="flex flex-col gap-[2px]">
          {block.rows.map((row, index) => {
            const imageLeft = alternate && index % 2 === 1
            const rowClasses = `group grid bg-surface text-fg transition-colors duration-150 ease-in-out hover:bg-surface-hover ${
              imageLeft
                ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'
                : 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'
            }`

            const content = (
              <>
                <div className="flex flex-col justify-center gap-4 p-[clamp(32px,4vw,56px)]">
                  <span className="font-mono text-[13px] text-accent-text">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <RowHeading className="type-h2">{row.title}</RowHeading>
                  {row.body && (
                    <p className="max-w-[440px] text-[17px] leading-[1.55] text-fg-muted">{row.body}</p>
                  )}
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
    </section>
  )
}
