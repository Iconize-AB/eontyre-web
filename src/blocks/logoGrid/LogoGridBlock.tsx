import {stegaClean} from 'next-sanity'

import {Button} from '@/components/Button'
import {SanityImage} from '@/components/SanityImage'
import type {BlockOf} from '@/sanity/content-types'

import {spacingClasses} from '../spacing'

export function LogoGridBlock({block}: {block: BlockOf<'logoGridBlock'>}) {
  const theme = stegaClean(block.theme) ?? 'dark'
  const items = block.items?.filter((item) => item !== null) ?? []

  return (
    <section data-theme={theme} className={`bg-bg text-fg ${spacingClasses(block.spacing)}`}>
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
    </section>
  )
}
