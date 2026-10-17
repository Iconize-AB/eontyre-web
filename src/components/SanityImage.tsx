import Image from 'next/image'
import {stegaClean} from 'next-sanity'

import type {ImageData} from '@/sanity/content-types'
import {hotspotPosition, imageUrl} from '@/sanity/image'

interface SanityImageProps {
  image: ImageData | null | undefined
  /** Responsive sizes hint, e.g. "(min-width: 768px) 50vw, 100vw". */
  sizes: string
  /** Set for the LCP image: preloads it and skips lazy loading. */
  preload?: boolean
  fit?: 'cover' | 'contain'
  className?: string
}

/** Fills its positioned parent. Respects the editor's crop and hotspot. */
export function SanityImage({image, sizes, preload = false, fit = 'cover', className = ''}: SanityImageProps) {
  if (!image) return null
  const url = imageUrl(image)
  if (!url) return null

  const lqip = image.asset?.metadata?.lqip ?? undefined

  return (
    <Image
      src={url.url()}
      alt={stegaClean(image.alt) ?? ''}
      fill
      sizes={sizes}
      preload={preload}
      placeholder={lqip && fit === 'cover' ? 'blur' : 'empty'}
      blurDataURL={lqip}
      className={`${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
      style={{objectPosition: fit === 'cover' ? hotspotPosition(image) : undefined}}
    />
  )
}
