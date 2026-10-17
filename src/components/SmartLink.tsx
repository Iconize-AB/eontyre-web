import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import type {ComponentProps, ReactNode} from 'react'

import type {LinkData} from '@/sanity/content-types'

type SmartLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  link: LinkData | null | undefined
  children: ReactNode
}

/** Renders a CMS link: next/link for paths on this site, a plain anchor otherwise. */
export function SmartLink({link, children, ...props}: SmartLinkProps) {
  const href = stegaClean(link?.href)
  if (!href) return <span className={props.className}>{children}</span>

  const newTab = link?.openInNewTab ? {target: '_blank', rel: 'noopener noreferrer'} : {}

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...newTab} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...newTab} {...props}>
      {children}
    </a>
  )
}
