import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {categoryTitle, PostRow, type PostCard} from '@/blocks/newsList/NewsListBlock'
import {Breadcrumb} from '@/components/Breadcrumb'
import {PostBody} from '@/components/PostBody'
import {SanityImage} from '@/components/SanityImage'
import {formatDate} from '@/lib/date'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions, type FetchOptions} from '@/sanity/live'
import {buildMetadata} from '@/sanity/metadata'
import {POST_QUERY, POST_SLUGS_QUERY} from '@/sanity/queries'

type Props = PageProps<'/news/[slug]'>

export async function generateStaticParams() {
  const {data} = await cachedSanity({query: POST_SLUGS_QUERY, ...publishedFetchOptions})
  // Cache Components needs at least one param; a placeholder simply 404s (e.g. while all posts are drafts).
  return data.length ? data.map(({slug}) => ({slug})) : [{slug: '__placeholder__'}]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await cachedSanity({query: POST_QUERY, params: {slug}, ...publishedFetchOptions})
  if (!data) return {}
  return buildMetadata({title: data.title, description: data.excerpt, seo: data.seo})
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

  const {slug} = await params
  return <PostContent slug={slug} {...publishedFetchOptions} />
}

async function DraftPost({params}: Pick<Props, 'params'>) {
  const {slug} = await params
  return <PostContent slug={slug} {...await getDraftFetchOptions()} />
}

/** Not designed yet (BRIEF-2): built simply from the site's tokens. */
async function PostContent({slug, ...options}: {slug: string} & FetchOptions) {
  const {data: post} = await cachedSanity({query: POST_QUERY, params: {slug}, ...options})
  if (!post) notFound()
  const published = stegaClean(post.publishedAt)
  const related = (post.related ?? []) as PostCard[]

  return (
    <>
      <Breadcrumb parent={{label: 'News', href: '/news'}} current={post.title} />

      <article className="container-wide block-pt block-pb">
        <div className="flex gap-3 text-[14px] text-fg-subtle">
          <span className="font-semibold text-accent-text">{categoryTitle(post.category)}</span>
          <time dateTime={published ?? undefined}>{formatDate(published)}</time>
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
            <h2 className="type-block-h2 mb-6">More news</h2>
            <ul className="border-t border-hairline">
              {related.map((item) => (
                <PostRow key={item._id} post={item} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
