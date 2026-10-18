import {stegaClean} from 'next-sanity'
import type {ReactNode} from 'react'

export interface BlockSettings {
  theme?: string | null
  background?: string | null
  anchorId?: string | null
  paddingTop?: string | null
}

interface SectionProps {
  settings: BlockSettings
  children: ReactNode
  className?: string
  /** Vertical padding. Blocks with their own layout (heroes, banners) pass false. */
  padded?: boolean
  /** Overrides `settings.paddingTop` for blocks that always sit flush. */
  flushTop?: boolean
  as?: 'section' | 'nav'
  'aria-label'?: string
}

/**
 * The outer element of every phase 2 block: theme, background, anchor and
 * section padding from the block's style settings.
 */
export function Section({
  settings,
  children,
  className = '',
  padded = true,
  flushTop,
  as: Tag = 'section',
  ...rest
}: SectionProps) {
  const theme = stegaClean(settings.theme) === 'light' ? 'light' : 'dark'
  const background = stegaClean(settings.background) === 'surface' ? 'surface' : 'default'
  const anchorId = stegaClean(settings.anchorId) || undefined
  const noTop = flushTop ?? stegaClean(settings.paddingTop) === 'none'

  const padding = padded ? `${noTop ? '' : 'block-pt'} block-pb` : ''
  const bg = background === 'surface' ? 'bg-surface' : 'bg-bg'

  return (
    <Tag
      id={anchorId}
      data-theme={theme}
      data-background={background}
      className={`${bg} text-fg ${padding} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Small orange label above a heading. */
export function Eyebrow({children, className = 'mb-4'}: {children: ReactNode; className?: string}) {
  if (!children) return null
  return <p className={`text-[16px] font-semibold text-accent-text ${className}`}>{children}</p>
}
