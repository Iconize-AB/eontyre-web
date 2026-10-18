import {Button} from '@/components/Button'
import {RichText} from '@/components/RichText'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

export function LinkListBlock({block}: {block: BlockOf<'linkListBlock'>}) {
  const items = block.items ?? []

  return (
    <Section settings={block}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-10">
        <div>
          <h2 className="type-block-h2 mb-5">{block.heading}</h2>
          <RichText value={block.body} className="max-w-[480px]" />
          {block.button?.label && <Button button={block.button} className="mt-7" />}
        </div>

        {items.length > 0 && (
          <ul className="flex flex-col border-b border-hairline text-[16px]">
            {items.map((item) => {
              const row = 'flex flex-wrap justify-between gap-4 border-t border-hairline'
              const meta = item.meta && <span className="font-mono text-[14px] text-fg-subtle">{item.meta}</span>
              return (
                <li key={item._key}>
                  {item.link?.href ? (
                    <SmartLink
                      link={item.link}
                      className={`${row} py-[18px] text-[17px] text-fg transition-colors duration-150 hover:text-accent-text`}
                    >
                      <span>{item.label}</span>
                      <span className="flex items-center gap-4">
                        {meta}
                        <span aria-hidden="true">→</span>
                      </span>
                    </SmartLink>
                  ) : (
                    <div className={`${row} py-4`}>
                      <span className="font-semibold">{item.label}</span>
                      {meta}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Section>
  )
}
