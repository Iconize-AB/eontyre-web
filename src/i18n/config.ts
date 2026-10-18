/**
 * Languages of the site. Import-free so the Studio config, the proxy and the
 * pages can all use it.
 */

export const locales = [
  {id: 'sv', title: 'Svenska', short: 'SV', englishTitle: 'Swedish', htmlLang: 'sv', intl: 'sv-SE'},
  {id: 'en', title: 'English', short: 'EN', englishTitle: 'English', htmlLang: 'en', intl: 'en-GB'},
  {id: 'nb', title: 'Norsk', short: 'NO', englishTitle: 'Norwegian (Bokmål)', htmlLang: 'nb', intl: 'nb-NO'},
  {id: 'fi', title: 'Suomi', short: 'FI', englishTitle: 'Finnish', htmlLang: 'fi', intl: 'fi-FI'},
] as const

export type Locale = (typeof locales)[number]['id']

export const localeIds: Locale[] = locales.map((locale) => locale.id)

/**
 * Used for hosts without a language of their own (previews, the bare
 * vercel.app address) and for the hreflang "x-default".
 */
export const defaultLocale: Locale = 'en'

export const isLocale = (value: string | null | undefined): value is Locale =>
  localeIds.includes(value as Locale)

export const localeInfo = (locale: Locale) => locales.find((item) => item.id === locale) ?? locales[1]

/**
 * One domain per language, e.g. "sv=eontyre.se,en=eontyre.com,nb=eontyre.no,fi=eontyre.fi".
 * When unset, every language lives under a path prefix instead (/sv, /en, /nb, /fi).
 * NEXT_PUBLIC_ so the language switcher can build links to the other domains.
 */
export function parseDomains(value: string | undefined): Record<Locale, string> | null {
  if (!value?.trim()) return null
  const entries = value
    .split(',')
    .map((pair) => pair.split('=').map((part) => part.trim()))
    .filter(([id, host]) => isLocale(id) && host)
  if (!entries.length) return null
  return Object.fromEntries(entries) as Record<Locale, string>
}

export const domains = parseDomains(process.env.NEXT_PUBLIC_LOCALE_DOMAINS)

/** True when each language has its own domain. */
export const domainMode = domains !== null
