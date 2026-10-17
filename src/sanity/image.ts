import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import type {ImageData} from './content-types'
import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}

/** Builds a URL for a queried image (asset resolved with `asset->`), applying its crop. */
export function imageUrl(image: ImageData) {
  if (!image.asset?._id) return null
  return urlFor({
    asset: {_ref: image.asset._id},
    crop: image.crop ?? undefined,
    hotspot: image.hotspot ?? undefined,
  })
}

/** CSS object-position from the editor's hotspot, adjusted for any crop. */
export function hotspotPosition(image: ImageData, fallback = '50% 50%') {
  const {hotspot, crop} = image
  if (!hotspot) return fallback
  const left = crop?.left ?? 0
  const right = crop?.right ?? 0
  const top = crop?.top ?? 0
  const bottom = crop?.bottom ?? 0
  const x = (hotspot.x - left) / (1 - left - right)
  const y = (hotspot.y - top) / (1 - top - bottom)
  const clamp = (value: number) => Math.min(100, Math.max(0, value * 100))
  return `${clamp(x)}% ${clamp(y)}%`
}
