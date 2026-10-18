import {PortableText, type PortableTextBlock, type PortableTextComponents} from 'next-sanity'

import {SmartLink} from './SmartLink'

const sizes = {
  /** Block body copy: 18px, muted. */
  lg: 'text-[18px] leading-[1.55] text-fg-muted [&>p+p]:mt-4',
  /** Hero intro: 19px. */
  xl: 'text-[19px] leading-[1.55] text-fg-muted [&>p+p]:mt-4',
  /** Short item text in grids and cards. */
  base: 'text-[16px] leading-[1.55] text-fg-muted [&>p+p]:mt-2',
  /** Text inside bordered cards: 15px. */
  card: 'text-[15px] leading-[1.55] text-fg-muted [&>p+p]:mt-2',
  /** FAQ answers: 16px with a little more air. */
  answer: 'text-[16px] leading-[1.6] text-fg-muted [&>p+p]:mt-3',
  /** Long-form text: About, legal pages. */
  prose: 'text-[18px] leading-[1.6] text-fg-muted [&>p+p]:mt-5',
} as const

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-fg">{children}</strong>,
    link: ({value, children}) => (
      <SmartLink link={value} className="underline underline-offset-3 transition-colors duration-150 hover:text-fg">
        {children}
      </SmartLink>
    ),
  },
}

export type RichTextValue = PortableTextBlock[] | null | undefined

interface RichTextProps {
  // Query results are structurally Portable Text; TypeGen's shape is narrower than the library's.
  value: unknown
  size?: keyof typeof sizes
  className?: string
}

export function RichText({value, size = 'lg', className = ''}: RichTextProps) {
  const blocks = value as RichTextValue
  if (!blocks?.length) return null
  return (
    <div className={`${sizes[size]} ${className}`}>
      <PortableText value={blocks} components={components} />
    </div>
  )
}

/** True when a Portable Text value has any content. */
export function hasRichText(value: unknown) {
  return Array.isArray(value) && value.length > 0
}
