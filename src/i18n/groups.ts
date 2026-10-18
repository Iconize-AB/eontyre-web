import type {Locale} from './config'

/** One page in every language it exists in, as paths without any language prefix. */
export type SwitcherGroup = Partial<Record<Locale, string>>

/** The same page in another language: from the links when known, otherwise the same path. */
export function pathInLocale(groups: SwitcherGroup[], current: Locale, path: string, target: Locale) {
  const group = groups.find((candidate) => candidate[current] === path)
  return group ? (group[target] ?? '/') : path
}
