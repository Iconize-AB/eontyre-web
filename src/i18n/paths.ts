import {defaultLocale, domainMode, domains, isLocale, type Locale} from './config'

const normalize = (path: string) => (path === '' || path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`)

/** Path inside one language: "/webshop" → "/webshop" (own domain) or "/sv/webshop" (path prefix). */
export function localizedPath(locale: Locale, path: string) {
  const clean = normalize(path)
  if (domainMode) return clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

/** URL protocol for a host: plain http only for local development. */
const protocolFor = (host: string) => (/^(localhost|127\.|.*\.localhost)(:|$)/.test(host) ? 'http' : 'https')

/** Link to a page in another language. Absolute when languages have their own domains. */
export function localizedUrl(locale: Locale, path: string) {
  const local = localizedPath(locale, path)
  const host = domains?.[locale]
  return host ? `${protocolFor(host)}://${host}${local}` : local
}

/** The language a host belongs to, or null (unknown host, or no domains configured). */
export function localeForHost(host: string | null | undefined): Locale | null {
  if (!domains || !host) return null
  const bare = host.replace(/^www\./, '').toLowerCase()
  const match = Object.entries(domains).find(([, domain]) => domain.replace(/^www\./, '').toLowerCase() === bare)
  return (match?.[0] as Locale | undefined) ?? null
}

/** Splits "/sv/webshop" into {locale: 'sv', rest: '/webshop'}; locale is null without a language prefix. */
export function splitLocale(pathname: string): {locale: Locale | null; rest: string} {
  const [, first, ...others] = pathname.split('/')
  if (!isLocale(first)) return {locale: null, rest: pathname || '/'}
  return {locale: first, rest: others.length ? `/${others.join('/')}` : '/'}
}

/** The path of a page without any language prefix, for switching language. */
export const pathWithoutLocale = (pathname: string) => splitLocale(pathname).rest

/** The language to use for the bare "/" on a host without its own language. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  const wanted = (acceptLanguage ?? '')
    .split(',')
    .map((part) => part.trim().split(';')[0].toLowerCase().split('-')[0])
    // Norwegian browsers often say "no" or "nn"; the site has one Norwegian version.
    .map((code) => (code === 'no' || code === 'nn' ? 'nb' : code))
  return wanted.find((code): code is Locale => isLocale(code)) ?? defaultLocale
}
