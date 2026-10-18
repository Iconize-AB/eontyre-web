import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Archivo, IBM_Plex_Mono, Schibsted_Grotesk} from 'next/font/google'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'

import {SiteFooter, SiteHeader} from '@/components/SiteChrome'
import {isLocale, localeIds, localeInfo} from '@/i18n/config'
import {getDictionaryFor} from '@/i18n/dictionaries'
import {LocaleProvider} from '@/i18n/LocaleProvider'
import {getSwitcherGroups} from '@/i18n/translations'
import {SanityLive} from '@/sanity/live'

import '../globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
})

const schibsted = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export function generateStaticParams() {
  return localeIds.map((locale) => ({locale}))
}

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()

  const {isEnabled: isDraftMode} = await draftMode()
  const groups = await getSwitcherGroups()

  return (
    <html
      lang={localeInfo(locale).htmlLang}
      data-theme="dark"
      className={`${archivo.variable} ${schibsted.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider value={{locale, dictionary: getDictionaryFor(locale), groups}}>
          <Suspense fallback={<div className="min-h-16 border-b border-line" />}>
            <SiteHeader draft={isDraftMode} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense>
            <SiteFooter draft={isDraftMode} />
          </Suspense>
        </LocaleProvider>
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
