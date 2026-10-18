import Link from 'next/link'
import {stegaClean} from 'next-sanity'

import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import type {Locale} from '@/i18n/config'
import type {Dictionary} from '@/i18n/dictionaries'
import {localizedPath} from '@/i18n/paths'
import {getDictionary, getLocale} from '@/i18n/server'
import {formatDate} from '@/lib/date'
import type {BlockOf} from '@/sanity/content-types'
import {postCategories} from '@/sanity/schemaTypes/categories'

import {withLabels} from '../labels'
import {NewsList} from './NewsList'

type Block = BlockOf<'newsListBlock'>
export type PostCard = NonNullable<Block['posts']>[number]

export const categoryTitle = (value: string | null | undefined, dictionary: Dictionary) => {
  const category = postCategories.find((item) => item.value === stegaClean(value))
  return category ? dictionary.news.categories[category.value as keyof Dictionary['news']['categories']] : ''
}

export async function NewsListBlock({block}: {block: Block}) {
  const [locale, dictionary] = await Promise.all([getLocale(), getDictionary()])
  // Texts set on the block win; empty ones fall back to this language's defaults.
  const labels = withLabels(
    {
      all: dictionary.news.all,
      readArticle: dictionary.news.readArticle,
      loadMore: dictionary.news.loadMore,
      empty: dictionary.news.empty,
    },
    block.labels,
  )
  const posts = block.posts ?? []
  const featured = block.showFeatured ? posts.find((post) => post.featured) : undefined
  const list = posts.filter((post) => post !== featured)
  const used = new Set<string | null>(list.map((post) => stegaClean(post.category)))

  return (
    <Section settings={block}>
      <div className="container-wide">
        {block.heading && <h2 className="type-block-h2 mb-10">{block.heading}</h2>}
        {posts.length === 0 && <p className="text-[18px] text-fg-muted">{labels.empty}</p>}

        {featured && <FeaturedPost post={featured} linkLabel={labels.readArticle} locale={locale} dictionary={dictionary} />}

        {list.length > 0 && (
          <NewsList
            rows={list.map((post) => (
              <PostRow key={post._id} post={post} locale={locale} dictionary={dictionary} />
            ))}
            rowCategories={list.map((post) => stegaClean(post.category) ?? '')}
            categories={postCategories
              .filter((category) => used.has(category.value))
              .map(({value}) => ({value, label: dictionary.news.categories[value as keyof Dictionary['news']['categories']]}))}
            showFilter={Boolean(block.showFilter)}
            pageSize={Math.max(1, block.pageSize ?? 10)}
            labels={labels}
            filterLabel={dictionary.news.filter}
          />
        )}
      </div>
    </Section>
  )
}

function FeaturedPost({
  post,
  linkLabel,
  locale,
  dictionary,
}: {
  post: PostCard
  linkLabel: string
  locale: Locale
  dictionary: Dictionary
}) {
  return (
    <Link
      href={localizedPath(locale, `/news/${stegaClean(post.slug)}`)}
      className="group mb-[clamp(56px,7vw,88px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-center gap-x-14 gap-y-8 text-fg"
    >
      {post.mainImage?.asset && (
        <div className="relative aspect-[3/2] overflow-hidden bg-surface">
          <SanityImage image={post.mainImage} sizes="(min-width: 1280px) 610px, (min-width: 1000px) 48vw, 100vw" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 text-[14px] text-fg-subtle">
          <span className="font-semibold text-accent-text">{categoryTitle(post.category, dictionary)}</span>
          <time dateTime={stegaClean(post.publishedAt) ?? undefined}>
            {formatDate(stegaClean(post.publishedAt), locale)}
          </time>
        </div>
        <h2 className="type-block-h2 text-balance">{post.title}</h2>
        {post.excerpt && <p className="text-[18px] leading-[1.55] text-fg-muted">{post.excerpt}</p>}
        <span className="link-underline text-[15px] group-hover:text-accent-text">{linkLabel}</span>
      </div>
    </Link>
  )
}

export function PostRow({post, locale, dictionary}: {post: PostCard; locale: Locale; dictionary: Dictionary}) {
  return (
    <li>
      <Link
        href={localizedPath(locale, `/news/${stegaClean(post.slug)}`)}
        className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-8 gap-y-2 border-b border-hairline py-7 text-fg sm:grid-cols-[minmax(140px,180px)_minmax(0,1fr)_auto]"
      >
        <span className="col-span-2 flex flex-col gap-1 text-[14px] sm:col-span-1">
          <time className="text-fg-subtle" dateTime={stegaClean(post.publishedAt) ?? undefined}>
            {formatDate(stegaClean(post.publishedAt), locale)}
          </time>
          <span className="font-semibold text-accent-text">{categoryTitle(post.category, dictionary)}</span>
        </span>
        <span className="flex flex-col gap-2">
          <span className="text-[22px] leading-[1.2] font-bold tracking-[-0.015em] transition-colors duration-150 group-hover:text-accent-text">
            {post.title}
          </span>
          {post.excerpt && <span className="max-w-[680px] text-[16px] leading-[1.55] text-fg-muted">{post.excerpt}</span>}
        </span>
        <span aria-hidden="true" className="text-[20px]">
          →
        </span>
      </Link>
    </li>
  )
}
