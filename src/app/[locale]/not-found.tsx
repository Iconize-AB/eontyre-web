import Link from 'next/link'

import {getDictionary, getLocale} from '@/i18n/server'
import {localizedPath} from '@/i18n/paths'

export default async function NotFound() {
  const [dictionary, locale] = await Promise.all([getDictionary(), getLocale()])
  const {heading, text, home} = dictionary.notFound

  return (
    <main className="container-site flex flex-1 flex-col items-start justify-center gap-6 py-32">
      <h1 className="type-h2">{heading}</h1>
      <p className="text-[18px] text-fg-muted">{text}</p>
      <Link href={localizedPath(locale, '/')} className="text-fg underline underline-offset-3">
        {home}
      </Link>
    </main>
  )
}
