import {stegaClean} from 'next-sanity'

import {Button} from '@/components/Button'
import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import type {BlockOf} from '@/sanity/content-types'

export function LogoGridBlock({block}: {block: BlockOf<'logoGridBlock'>}) {
  const items = block.items?.filter((item) => item !== null) ?? []

  return (
    // Home spacing (phase 1): section-pt/pb rather than the phase 2 block padding.
    <Section settings={block} padded={false} className={`${stegaClean(block.paddingTop) === 'none' ? '' : 'section-pt'} section-pb`}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-x-16 gap-y-10">
        <div className="flex flex-col gap-5">
          <h2 className="type-h2">{block.heading}</h2>
          {block.body && <p className="max-w-[480px] text-[18px] leading-[1.55] text-fg-muted">{block.body}</p>}
          <Button button={block.button} className="self-start" />
        </div>

        {items.length > 0 && (
          <ul className="grid grid-cols-2 gap-[2px] min-[480px]:grid-cols-3">
            {items.map((item) => (
              <li key={item._id} className="flex items-center bg-surface px-5 py-7 text-[18px] font-semibold">
                {item.logo?.asset ? (
                  <span className="relative block h-7 w-full">
                    <SanityImage image={item.logo} sizes="160px" fit="contain" className="object-left" />
                  </span>
                ) : (
                  item.name
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}
