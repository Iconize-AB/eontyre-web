import {cacheLife} from 'next/cache'
import {stegaClean} from 'next-sanity'

import type {SettingsData} from '@/sanity/content-types'
import {cachedSanity, getDraftFetchOptions, publishedFetchOptions} from '@/sanity/live'
import {SETTINGS_QUERY} from '@/sanity/queries'

import {HeaderNav} from './HeaderNav'
import {Logo} from './Logo'
import {SmartLink} from './SmartLink'

async function currentYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

async function getSettings(draft: boolean) {
  const options = draft ? await getDraftFetchOptions() : publishedFetchOptions
  const {data} = await cachedSanity({query: SETTINGS_QUERY, ...options})
  return data as SettingsData | null
}

export async function SiteHeader({draft}: {draft: boolean}) {
  const settings = await getSettings(draft)
  if (!settings) return null
  const siteTitle = stegaClean(settings.siteTitle) ?? 'Eontyre'

  return (
    <header className="relative z-10 border-b border-line bg-bg">
      <HeaderNav
        logo={<Logo image={settings.logo} height={26} siteTitle={siteTitle} />}
        navItems={settings.navItems ?? []}
        secondaryLink={settings.secondaryLink}
        primaryCta={settings.primaryCta}
      />
    </header>
  )
}

const footerLink = 'text-footer-link transition-colors duration-150 ease-in-out hover:text-white'

export async function SiteFooter({draft}: {draft: boolean}) {
  const settings = await getSettings(draft)
  if (!settings) return null
  const siteTitle = stegaClean(settings.siteTitle) ?? 'Eontyre'
  const copyright = settings.legal?.copyright?.replace('{year}', String(await currentYear()))

  return (
    <footer className="bg-footer text-[15px] text-footer-link">
      <div className="container-site pt-16 pb-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-10">
          <div className="flex flex-col gap-3.5">
            <Logo image={settings.logo} height={28} siteTitle={siteTitle} />
            {settings.tagline && <p className="max-w-[260px] leading-[1.55]">{settings.tagline}</p>}
          </div>

          {settings.footerColumns?.map((column) => (
            <div key={column._key} className="flex flex-col gap-2.5">
              <h2 className="mb-1 font-semibold text-white">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.links?.map((item) => (
                  <li key={item._key}>
                    <SmartLink link={item.link} className={footerLink}>
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {settings.contact && (
            <div className="flex flex-col gap-2.5">
              {settings.contact.title && <h2 className="mb-1 font-semibold text-white">{settings.contact.title}</h2>}
              {settings.contact.lines?.map((line, index) => <p key={index}>{line}</p>)}
              {settings.contact.link && (
                <SmartLink
                  link={settings.contact.link.link}
                  className={`${footerLink} self-start underline underline-offset-3`}
                >
                  {settings.contact.link.label}
                </SmartLink>
              )}
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-footer-line pt-5 text-[13px] text-fg-subtle">
          {copyright && <span>{copyright}</span>}
          {settings.legal?.link && (
            <SmartLink
              link={settings.legal.link.link}
              className="text-fg-subtle transition-colors duration-150 ease-in-out hover:text-white"
            >
              {settings.legal.link.label}
            </SmartLink>
          )}
        </div>
      </div>
    </footer>
  )
}
