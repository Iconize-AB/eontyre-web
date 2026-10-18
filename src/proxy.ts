import {NextResponse, type NextRequest} from 'next/server'

import {defaultLocale, domainMode} from './i18n/config'
import {localeForHost, negotiateLocale, splitLocale} from './i18n/paths'

/**
 * Language routing. Every page lives under /[locale]; this proxy decides the
 * locale for each request.
 *
 * - Domain mode (NEXT_PUBLIC_LOCALE_DOMAINS set): eontyre.se serves Swedish at
 *   "/", eontyre.com English, and so on. The domain is rewritten to /sv, /en…
 *   internally, so the visitor never sees the prefix. A path that repeats the
 *   domain's own language (/sv/webshop on eontyre.se) is redirected to the
 *   short form. Paths with another language (/nb/webshop on eontyre.com) are
 *   served as they are, so the Studio's preview can open any language on one
 *   host; search engines get the right domain from the page's canonical link.
 * - Path mode (no domains, e.g. local development and previews): "/" redirects
 *   to the visitor's language, and every page lives at /sv/…, /en/…
 */
export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl
  const {locale: prefixed, rest} = splitLocale(pathname)

  if (!domainMode) {
    if (prefixed) return NextResponse.next()
    const locale = negotiateLocale(request.headers.get('accept-language'))
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }

  const hostLocale = localeForHost(request.headers.get('host')) ?? defaultLocale

  if (prefixed) {
    if (prefixed !== hostLocale) return NextResponse.next()
    const url = request.nextUrl.clone()
    url.pathname = rest
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${hostLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Everything except the Studio, API routes (/api/…, but not the "API" page at /api), Next internals
  // and files with an extension.
  matcher: ['/((?!studio|api/|_next|.*\\..*).*)'],
}
