import {PortableText, type PortableTextBlock, type PortableTextComponents} from 'next-sanity'

import type {ImageData} from '@/sanity/content-types'

import {SanityImage} from './SanityImage'
import {SmartLink} from './SmartLink'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h2: ({children}) => <h2 className="mt-12 text-[28px] leading-[1.2] font-bold tracking-[-0.015em] text-fg">{children}</h2>,
    h3: ({children}) => <h3 className="mt-8 text-[22px] leading-[1.25] font-bold text-fg">{children}</h3>,
    blockquote: ({children}) => <blockquote className="border-l-2 border-accent pl-5 text-fg">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-6 [&>li+li]:mt-2">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-6 [&>li+li]:mt-2">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-fg">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({value, children}) => (
      <SmartLink link={value} className="text-fg underline underline-offset-3 hover:text-accent-text">
        {children}
      </SmartLink>
    ),
  },
  types: {
    image: ({value}: {value: ImageData & {caption?: string}}) => (
      <figure className="my-10">
        <div className="relative aspect-[3/2] overflow-hidden bg-surface">
          <SanityImage image={value} sizes="(min-width: 800px) 720px, 100vw" />
        </div>
        {value.caption && <figcaption className="mt-3 text-[14px] text-fg-subtle">{value.caption}</figcaption>}
      </figure>
    ),
  },
}

/** Article body for news posts: 18px, line height 1.6, max 720px wide. */
export function PostBody({value}: {value: unknown}) {
  const blocks = value as PortableTextBlock[] | null | undefined
  if (!blocks?.length) return null
  return (
    <div className="max-w-[720px] text-[18px] leading-[1.6] text-fg-muted [&>*+*]:mt-5">
      <PortableText value={blocks} components={components} />
    </div>
  )
}
