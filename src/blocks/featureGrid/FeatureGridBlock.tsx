import {stegaClean} from 'next-sanity'

import {RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {SmartLink} from '@/components/SmartLink'
import type {BlockOf} from '@/sanity/content-types'

type Block = BlockOf<'featureGridBlock'>
type Written = NonNullable<Block['items']>[number]

/** A related add-on or integration (the query reads these from the page the block sits on). */
interface RelatedCard {
  _id: string
  name: string
  shortDescription: string | null
  href: string | null
}

/** An item as the grids draw it: written in the block, or taken from the page's related items. */
interface GridItem {
  _key: string
  title: string
  body?: Written['body'] | null
  /** Plain text, for related items (their short description). */
  text?: string | null
  image?: Written['image'] | null
  link?: Written['link'] | null
}

export function FeatureGridBlock({block}: {block: Block}) {
  const related = stegaClean(block.source) === 'related'
  const items: GridItem[] = related
    ? ((block as {related?: (RelatedCard | null)[] | null}).related ?? [])
        .filter((item): item is RelatedCard => item !== null)
        .map((item) => ({
          _key: item._id,
          title: item.name,
          text: item.shortDescription,
          link: item.href ? {href: item.href, openInNewTab: false} : null,
        }))
    : (block.items ?? [])
  if (!items.length) return null

  // Related items are always shown as cards, linking to the item's page.
  const variant = related ? 'cards' : (stegaClean(block.variant) ?? 'topRule')
  const split = stegaClean(block.layout) === 'split'
  // Without a block heading, the item titles are the section headings.
  const ItemHeading = block.heading ? 'h3' : 'h2'
  // Items sit in a narrower column next to the text when split.
  const columns = split ? 'minmax(min(100%,220px),1fr)' : null

  const grid = (
    <>
      {variant === 'steps' && <Steps items={items} />}
      {variant === 'cards' && <Cards items={items} ItemHeading={ItemHeading} columns={columns ?? 'minmax(min(100%,280px),1fr)'} />}
      {(variant === 'topRule' || variant === 'numbered') && (
        <TopRule
          items={items}
          numbered={variant === 'numbered'}
          ItemHeading={ItemHeading}
          columns={columns ?? 'minmax(min(100%,240px),1fr)'}
        />
      )}
    </>
  )

  return (
    <Section settings={block}>
      <div className="container-wide">
        {split ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-12">
            <Header block={block} split />
            <div>{grid}</div>
          </div>
        ) : (
          <>
            <Header block={block} />
            {grid}
          </>
        )}
      </div>
    </Section>
  )
}

function Header({block, split = false}: {block: Block; split?: boolean}) {
  if (!block.heading && !block.body?.length) return null
  const link = block.headerLink

  return (
    <div className={split ? '' : 'mb-10'}>
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
      <RichText value={block.body} className={`mt-4 ${split ? 'max-w-[460px]' : 'max-w-[620px]'}`} />
    </div>
  )
}

function ItemImage({item}: {item: GridItem}) {
  // Logos are optional; until they arrive nothing is shown (no placeholder).
  if (!item.image?.asset) return null
  return (
    <div className="relative mb-3 h-16">
      <SanityImage image={item.image} sizes="260px" fit="contain" className="object-left" />
    </div>
  )
}

function ItemText({item, size = 'base', className = ''}: {item: GridItem; size?: 'base' | 'card'; className?: string}) {
  if (item.text) {
    const text = size === 'card' ? 'text-[15px]' : 'text-[16px]'
    return <p className={`${text} leading-[1.55] text-fg-muted ${className}`}>{item.text}</p>
  }
  return <RichText value={item.body} size={size} className={className} />
}

function ItemTitle({item, as: Tag, className}: {item: GridItem; as: 'h2' | 'h3'; className: string}) {
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
function TopRule({
  items,
  numbered,
  ItemHeading,
  columns,
}: {
  items: GridItem[]
  numbered: boolean
  ItemHeading: 'h2' | 'h3'
  columns: string
}) {
  const List = numbered ? 'ol' : 'ul'
  return (
    <List className="grid gap-8" style={{gridTemplateColumns: `repeat(auto-fit,${columns})`}}>
      {items.map((item, index) => (
        <li key={item._key} className="border-t-2 border-accent pt-4">
          <ItemImage item={item} />
          {numbered && <span className="mb-2 block font-bold text-accent-text">{index + 1}</span>}
          <ItemTitle item={item} as={ItemHeading} className="mb-2 text-[19px] font-bold" />
          <ItemText item={item} className="[&_a]:no-underline [&_a[href^=mailto]]:underline" />
        </li>
      ))}
    </List>
  )
}

/** Compact numbered list: number and title on one line between hairlines. */
function Steps({items}: {items: GridItem[]}) {
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
function Cards({items, ItemHeading, columns}: {items: GridItem[]; ItemHeading: 'h2' | 'h3'; columns: string}) {
  return (
    <ul className="grid gap-5" style={{gridTemplateColumns: `repeat(auto-fit,${columns})`}}>
      {items.map((item) => {
        const content = (
          <>
            <ItemImage item={item} />
            <ItemHeading className="text-[19px] font-bold">{item.title}</ItemHeading>
            <ItemText item={item} size="card" />
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
