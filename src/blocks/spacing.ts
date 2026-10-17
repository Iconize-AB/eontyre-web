import {stegaClean} from 'next-sanity'

/** Section padding classes from a block's `spacing` field. Both sides default to on. */
export function spacingClasses(spacing: {top?: string | null; bottom?: string | null} | null | undefined) {
  const top = stegaClean(spacing?.top) === 'none' ? '' : 'section-pt'
  const bottom = stegaClean(spacing?.bottom) === 'none' ? '' : 'section-pb'
  return `${top} ${bottom}`
}
