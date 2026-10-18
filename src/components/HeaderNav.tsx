'use client'

import {usePathname} from 'next/navigation'
import {useState, type ReactNode} from 'react'

import {LanguageSwitcher} from '@/i18n/LanguageSwitcher'
import {useDictionary} from '@/i18n/LocaleProvider'
import {pathWithoutLocale} from '@/i18n/paths'
import type {NavItemData} from '@/sanity/content-types'

import {SmartLink} from './SmartLink'

interface HeaderNavProps {
  logo: ReactNode
  navItems: (NavItemData & {_key: string})[]
  secondaryLink: NavItemData | null
  primaryCta: NavItemData | null
}

const navLink =
  'relative py-[22px] text-[15px] font-medium text-fg after:absolute after:inset-x-0 after:bottom-[14px] after:h-[2px] after:bg-accent after:opacity-0 aria-[current=page]:after:opacity-100'

const ctaLink =
  'whitespace-nowrap rounded-[2px] bg-accent px-4 py-2.5 text-[15px] font-semibold text-on-accent transition-colors duration-150 ease-in-out hover:bg-accent-hover'

export function HeaderNav({logo, navItems, secondaryLink, primaryCta}: HeaderNavProps) {
  const pathname = usePathname()
  const {header} = useDictionary()
  const [open, setOpen] = useState(false)

  // The home page ("/", or "/sv" under a path prefix) is never marked as the active page.
  const isActive = (href: string | null | undefined) =>
    !!href && pathWithoutLocale(href) !== '/' && (pathname === href || pathname.startsWith(`${href}/`))

  const links = navItems.map((item) => (
    <SmartLink
      key={item._key}
      link={item.link}
      className={navLink}
      aria-current={isActive(item.link?.href) ? 'page' : undefined}
    >
      {item.label}
    </SmartLink>
  ))

  return (
    <div className="container-site flex min-h-16 flex-wrap items-center justify-between gap-5">
      {logo}

      <nav aria-label={header.mainNav} className="hidden items-center gap-[clamp(16px,2.4vw,32px)] nav:flex">
        {links}
      </nav>

      <div className="hidden items-center gap-5 nav:flex">
        <LanguageSwitcher />
        {secondaryLink && (
          <SmartLink link={secondaryLink.link} className="text-[15px] font-medium text-fg">
            {secondaryLink.label}
          </SmartLink>
        )}
        {primaryCta && (
          <SmartLink link={primaryCta.link} className={ctaLink}>
            {primaryCta.label}
          </SmartLink>
        )}
      </div>

      <button
        type="button"
        className="-mr-2 cursor-pointer p-2 text-[15px] font-medium text-fg nav:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? header.closeMenu : header.menu}
      </button>

      {open && (
        // Clicking any link in the panel closes it.
        <div id="mobile-menu" className="flex w-full flex-col pb-6 nav:hidden" onClick={() => setOpen(false)}>
          <nav aria-label={header.mainNav} className="flex flex-col [&>a]:py-3 [&>a]:after:hidden">
            {links}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-line pt-5">
            <LanguageSwitcher labels="full" className="w-full" />
            {secondaryLink && (
              <SmartLink link={secondaryLink.link} className="text-[15px] font-medium text-fg">
                {secondaryLink.label}
              </SmartLink>
            )}
            {primaryCta && (
              <SmartLink link={primaryCta.link} className={ctaLink}>
                {primaryCta.label}
              </SmartLink>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
