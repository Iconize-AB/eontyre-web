'use client'

import {createContext, useContext, type ReactNode} from 'react'

import type {Locale} from './config'
import type {Dictionary} from './dictionaries'
import {localizedPath} from './paths'
import type {SwitcherGroup} from './groups'

interface LocaleContextValue {
  locale: Locale
  dictionary: Dictionary
  /** Translated paths of every page, for the language switcher. */
  groups: SwitcherGroup[]
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({value, children}: {value: LocaleContextValue; children: ReactNode}) {
  return <LocaleContext value={value}>{children}</LocaleContext>
}

function useLocaleContext() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('LocaleProvider is missing')
  return value
}

export const useLocale = () => useLocaleContext().locale
export const useDictionary = () => useLocaleContext().dictionary
export const useSwitcherGroups = () => useLocaleContext().groups

/** A path inside the current language, e.g. "/webshop" → "/sv/webshop" or "/webshop". */
export function useLocalizedPath() {
  const locale = useLocale()
  return (path: string) => localizedPath(locale, path)
}
