'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {locales} from './config'
import {useDictionary, useLocale, useSwitcherGroups} from './LocaleProvider'
import {localizedUrl, pathWithoutLocale} from './paths'
import {pathInLocale} from './groups'

/** Links to the same page in every other language. "labels" shows full names instead of codes. */
export function LanguageSwitcher({labels = 'short', className = ''}: {labels?: 'short' | 'full'; className?: string}) {
  const current = useLocale()
  const dictionary = useDictionary()
  const groups = useSwitcherGroups()
  const pathname = usePathname()

  // "/sv/webshop/" → "/webshop"
  const path = pathWithoutLocale(pathname).replace(/(.)\/$/, '$1')

  return (
    <nav aria-label={dictionary.header.language} className={className}>
      <ul className="flex items-center gap-1">
        {locales.map((locale) => {
          const active = locale.id === current
          const href = localizedUrl(locale.id, pathInLocale(groups, current, path, locale.id))
          const classes = `rounded-[2px] px-2 py-1 text-[14px] font-medium transition-colors duration-150 ${
            active ? 'bg-fg text-bg' : 'text-fg hover:text-accent-text'
          }`
          const content = labels === 'short' ? locale.short : locale.title

          return (
            <li key={locale.id}>
              {active ? (
                <span aria-current="true" lang={locale.htmlLang} className={classes}>
                  {content}
                </span>
              ) : href.startsWith('/') ? (
                <Link href={href} hrefLang={locale.htmlLang} lang={locale.htmlLang} title={locale.title} className={classes}>
                  {content}
                </Link>
              ) : (
                <a href={href} hrefLang={locale.htmlLang} lang={locale.htmlLang} title={locale.title} className={classes}>
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
