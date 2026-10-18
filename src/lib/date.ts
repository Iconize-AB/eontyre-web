import {localeInfo, type Locale} from '@/i18n/config'

/** "2026-09-12" → "12 September 2026" (or "12 september 2026", "12. syyskuuta 2026" …) */
export function formatDate(value: string | null | undefined, locale: Locale) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(localeInfo(locale).intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
