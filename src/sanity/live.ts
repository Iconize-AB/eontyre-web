import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live'

import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  browserToken: token,
  serverToken: token,
  strict: true,
})

/** Put on every cached Sanity fetch, so the webhook at /api/revalidate can clear them all at once. */
export const SITE_CONTENT_TAG = 'site-content'

/**
 * The app's single `'use cache'` boundary for Sanity data. `sanityFetch` tags
 * results so the Live Content API can revalidate exactly what changed.
 */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch({...options, tags: [...(options.tags ?? []), SITE_CONTENT_TAG]})
}

export interface FetchOptions {
  perspective: LivePerspective
  variant?: string
  stega: boolean
}

export const publishedFetchOptions = {perspective: 'published', stega: false} as const

/** Resolves request-time values (cookies) outside cached scopes. */
export async function getDraftFetchOptions(): Promise<FetchOptions> {
  const {isEnabled} = await draftMode()
  if (!isEnabled) return publishedFetchOptions

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  const variant = await resolveVariantFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', variant, stega: true}
}
