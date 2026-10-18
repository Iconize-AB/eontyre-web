import {notFound} from 'next/navigation'
import {locale as localeParam} from 'next/root-params'

import {isLocale, type Locale} from './config'
import {getDictionaryFor, type Dictionary} from './dictionaries'

/** The language of the current request, from the /[locale] segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const locale = await localeParam()
  if (!isLocale(locale)) notFound()
  return locale
}

export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLocale())
}
