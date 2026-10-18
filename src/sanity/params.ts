import {domainMode, type Locale} from '@/i18n/config'

/**
 * Parameters every content query takes: which language, and what to put in
 * front of internal links ("" on a language's own domain, "/sv" under a path prefix).
 */
export function i18nParams(locale: Locale) {
  return {
    language: locale,
    prefix: domainMode ? '' : `/${locale}`,
    home: domainMode ? '/' : `/${locale}`,
  }
}
