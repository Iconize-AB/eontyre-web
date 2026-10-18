import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {locale as localeParam} from 'next/root-params'
import {Suspense} from 'react'

import {categoryTitle, PostRow, type PostCard} from '@/blocks/newsList/NewsListBlock'
import {Breadcrumb} from '@/components/Breadcrumb'
import {PostBody} from '@/components/PostBody'
import {SanityImage} from '@/components/SanityImage'
import {isLocale, type Locale} from '@/i18n/config'
import {getDictionaryFor} from '@/i18n/dictionaries'
import {formatDate} from '@/lib/date'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {buildMetadata} from '@/sanity/metadata'
import {i18nParams} from '@/sanity/params'
import {POST_QUERY, POST_SLUGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/[locale]/news/[slug]'>

export async function generateStaticParams() {
  const locale = await localeParam()
  const {data} = isLocale(locale)
    ? await cachedSanity({query: POST_SLUGS_QUERY, params: {language: locale}, ...publishedFetchOptions})
    : {data: []}
  // Cache Components needs at least one param; a placeholder simply 404s (e.g. while all posts are drafts).
  return data.length ? data.map(({slug}) => ({slug})) : [{slug: '__placeholder__'}]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params
  if (!isLocale(locale)) return {}
  const {data} = await cachedSanity({query: POST_QUERY, params: {slug, ...i18nParams(locale)}, ...publishedFetchOptions})
  if (!data) return {}
  return buildMetadata({
    locale,
    path: `/news/${data.slug}`,
    title: data.title,
    description: data.excerpt,
    seo: data.seo,
  })
}

export default async function PostPage({params}: Props) {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense>
        <DraftPost params={params} />
      </Suspense>
    )
  }

  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  return <PostContent locale={locale} slug={slug} {...publishedFetchOptions} />
}

async function DraftPost({params}: Pick<Props, 'params'>) {
  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  return <PostContent locale={locale} slug={slug} {...await getDraftFetchOptions()} />
}

/** Not designed yet (BRIEF-2): built simply from the site's tokens. */
async function PostContent({locale, slug, ...options}: {locale: Locale; slug: string} & FetchOptions) {
  const {data: post} = await cachedSanity({query: POST_QUERY, params: {slug, ...i18nParams(locale)}, ...options})
  if (!post) notFound()
  const dictionary = getDictionaryFor(locale)
  const published = stegaClean(post.publishedAt)
  const related = (post.related ?? []) as PostCard[]

  return (
    <>
      <Breadcrumb section="news" current={post.title} />

      <article className="container-wide block-pt block-pb">
        <div className="flex gap-3 text-[14px] text-fg-subtle">
          <span className="font-semibold text-accent-text">{categoryTitle(post.category, dictionary)}</span>
          <time dateTime={published ?? undefined}>{formatDate(published, locale)}</time>
        </div>
        <h1 className="type-page-h1 mt-4 max-w-[1000px]">{post.title}</h1>

        {post.mainImage?.asset && (
          <div className="relative mt-12 aspect-video overflow-hidden bg-surface">
            <SanityImage image={post.mainImage} sizes="(min-width: 1360px) 1280px, 100vw" preload />
          </div>
        )}

        <div className="mt-12">
          {post.body?.length ? (
            <PostBody value={post.body} />
          ) : (
            post.excerpt && <p className="max-w-[720px] text-[18px] leading-[1.6] text-fg-muted">{post.excerpt}</p>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section data-background="surface" className="bg-surface block-pt block-pb">
          <div className="container-wide">
            <h2 className="type-block-h2 mb-6">{dictionary.news.moreNews}</h2>
            <ul className="border-t border-hairline">
              {related.map((item) => (
                <PostRow key={item._id} post={item} locale={locale} dictionary={dictionary} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
