import Image from 'next/image'
import Link from 'next/link'

import {localizedPath} from '@/i18n/paths'
import {getLocale} from '@/i18n/server'
import type {ImageData} from '@/sanity/content-types'
import {imageUrl} from '@/sanity/image'

/** Site logo at a fixed height; width follows the image's aspect ratio. Links to the home page of the current language. */
export async function Logo({image, height, siteTitle}: {image: ImageData | null; height: number; siteTitle: string}) {
  const locale = await getLocale()
  const url = image && imageUrl(image)
  const dimensions = image?.asset?.metadata?.dimensions
  const width = dimensions ? Math.round((dimensions.width / dimensions.height) * height) : height * 5

  return (
    <Link href={localizedPath(locale, '/')} className="flex items-center">
      {url ? (
        <Image src={url.url()} alt={siteTitle} width={width} height={height} style={{height, width: 'auto'}} />
      ) : (
        <span className="text-[20px] font-bold">{siteTitle}</span>
      )}
    </Link>
  )
}
