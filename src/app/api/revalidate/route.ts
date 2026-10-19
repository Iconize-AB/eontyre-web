import {timingSafeEqual} from 'node:crypto'

import {revalidateTag} from 'next/cache'
import {NextResponse, type NextRequest} from 'next/server'

import {SITE_CONTENT_TAG} from '@/sanity/live'

/**
 * Called by a Sanity webhook whenever content is published, so the site shows the change
 * right away, whether or not anyone has the site open. Send the header
 * `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''

  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  revalidateTag(SITE_CONTENT_TAG, {expire: 0})
  return NextResponse.json({revalidated: true})
}
