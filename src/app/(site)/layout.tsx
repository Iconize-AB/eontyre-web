import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'

import {SiteFooter, SiteHeader} from '@/components/SiteChrome'
import {SanityLive} from '@/sanity/live'

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <>
      <Suspense fallback={<div className="min-h-16 border-b border-line" />}>
        <SiteHeader draft={isDraftMode} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense>
        <SiteFooter draft={isDraftMode} />
      </Suspense>
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode && <VisualEditing />}
    </>
  )
}
