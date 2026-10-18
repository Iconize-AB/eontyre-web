import {stegaClean} from 'next-sanity'

import {RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

type Block = BlockOf<'featureGridBlock'>
type Item = NonNullable<Block['items']>[number]

export function FeatureGridBlock({block}: {block: Block}) {
  const items = block.items ?? []
  if (!items.length) return null
  const variant = stegaClean(block.variant) ?? 'topRule'
  // Without a block heading, the item titles are the section headings.
  const ItemHeading = block.heading ? 'h3' : 'h2'

  return (
    <Section settings={block}>
      <div className="container-wide">
        <Header block={block} />
        {variant === 'steps' && <Steps items={items} />}
        {variant === 'cards' && <Cards items={items} ItemHeading={ItemHeading} />}
        {(variant === 'topRule' || variant === 'numbered') && (
          <TopRule items={items} numbered={variant === 'numbered'} ItemHeading={ItemHeading} />
        )}
      </div>
    </Section>
  )
}

function Header({block}: {block: Block}) {
  if (!block.heading && !block.body?.length) return null
  const link = block.headerLink

  return (
    <div className="mb-10">
      {block.heading && (
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="type-block-h2">{block.heading}</h2>
          {link?.link?.href && link.label && (
            <SmartLink link={link.link} className="link-underline text-[16px]">
              {link.label}
            </SmartLink>
          )}
        </div>
      )}
      <RichText value={block.body} className="mt-4 max-w-[620px]" />
    </div>
  )
}

function ItemImage({item}: {item: Item}) {
  // Logos are optional; until they arrive nothing is shown (no placeholder).
  if (!item.image?.asset) return null
  return (
    <div className="relative mb-3 h-16">
      <SanityImage image={item.image} sizes="260px" fit="contain" className="object-left" />
    </div>
  )
}

function ItemTitle({item, as: Tag, className}: {item: Item; as: 'h2' | 'h3'; className: string}) {
  return (
    <Tag className={className}>
      {item.link?.href ? (
        <SmartLink link={item.link} className="transition-colors duration-150 hover:text-accent-text">
          {item.title}
        </SmartLink>
      ) : (
        item.title
      )}
    </Tag>
  )
}

/** 2px orange rule above each item. "numbered" adds 1, 2, 3 above the title. */
function TopRule({items, numbered, ItemHeading}: {items: Item[]; numbered: boolean; ItemHeading: 'h2' | 'h3'}) {
  const List = numbered ? 'ol' : 'ul'
  return (
    <List className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-8">
      {items.map((item, index) => (
        <li key={item._key} className="border-t-2 border-accent pt-4">
          <ItemImage item={item} />
          {numbered && <span className="mb-2 block font-bold text-accent-text">{index + 1}</span>}
          <ItemTitle item={item} as={ItemHeading} className="mb-2 text-[19px] font-bold" />
          <RichText value={item.body} size="base" className="[&_a]:no-underline [&_a[href^=mailto]]:underline" />
        </li>
      ))}
    </List>
  )
}

/** Compact numbered list: number and title on one line between hairlines. */
function Steps({items}: {items: Item[]}) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8">
      {items.map((item, index) => (
        <li key={item._key} className="grid grid-cols-[32px_1fr] border-t border-hairline py-4 text-[17px]">
          <span className="font-bold text-accent-text">{index + 1}</span>
          <span>{item.title}</span>
        </li>
      ))}
    </ol>
  )
}

/** Bordered cards; a card with a link is clickable as a whole. */
function Cards({items, ItemHeading}: {items: Item[]; ItemHeading: 'h2' | 'h3'}) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
      {items.map((item) => {
        const content = (
          <>
            <ItemImage item={item} />
            <ItemHeading className="text-[19px] font-bold">{item.title}</ItemHeading>
            <RichText value={item.body} size="base" className="text-[15px]" />
          </>
        )
        const card = 'flex h-full flex-col gap-2 border border-hairline p-6 text-fg transition-colors duration-150'
        return (
          <li key={item._key}>
            {item.link?.href ? (
              <SmartLink link={item.link} className={`${card} hover:border-accent`}>
                {content}
              </SmartLink>
            ) : (
              <div className={card}>{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
