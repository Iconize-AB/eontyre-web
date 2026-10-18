/**
 * Turns the English seed content into one set of documents per language.
 *
 * Swedish, Norwegian and Finnish text comes from scripts/translations/<lang>.json,
 * which maps each English string to its translation. Strings without a
 * translation stay in English and are reported, so nothing is silently missing.
 */
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

export type Lang = 'sv' | 'en' | 'nb' | 'fi'
export const LANGS: Lang[] = ['sv', 'en', 'nb', 'fi']

/** Document types that exist once per language and carry a `language` field. */
const TRANSLATED_TYPES = new Set(['page', 'integration', 'post', 'siteSettings'])

/** Fields whose text is visible copy. Everything else (ids, urls, enums, code) is left alone. */
const TEXT_KEYS = new Set([
  'alt',
  'buttonLabel',
  'copyright',
  'description',
  'eyebrow',
  'excerpt',
  'heading',
  'label',
  'lines',
  'linkLabel',
  'list',
  'name',
  'note',
  'shortDescription',
  'submitLabel',
  'successBody',
  'successHeading',
  'tagline',
  'text',
  'title',
  'body', // plain-text bodies; Portable Text bodies are arrays and are searched for `text` spans
])

/** Phone numbers, e-mail addresses and the like are the same in every language. */
const isTranslatable = (value: string) => value.trim().length > 0 && !/^[\d+()\s.-]+$/.test(value) && !value.includes('@')

type Json = null | string | number | boolean | Json[] | {[key: string]: Json}

/** Visits every translatable string; `replace` returns the string to keep. */
function mapStrings(node: Json, key: string | null, replace: (value: string) => string): Json {
  if (typeof node === 'string') {
    return key && TEXT_KEYS.has(key) && isTranslatable(node) ? replace(node) : node
  }
  if (Array.isArray(node)) return node.map((item) => mapStrings(item, key, replace))
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, mapStrings(v, k, replace)]))
  }
  return node
}

/** Every distinct English string that needs translating, in a stable order. */
export function collectStrings(docs: object[]): string[] {
  const found = new Set<string>()
  for (const doc of docs) {
    mapStrings(doc as Json, null, (value) => {
      found.add(value)
      return value
    })
  }
  return [...found].sort((a, b) => a.localeCompare(b))
}

const dictionaries = new Map<Lang, Record<string, string>>()

function dictionaryFor(lang: Lang): Record<string, string> {
  if (!dictionaries.has(lang)) {
    const file = path.join(process.cwd(), 'scripts/translations', `${lang}.json`)
    dictionaries.set(lang, existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {})
  }
  return dictionaries.get(lang)!
}

/** Placeholder for the registration plate field: plates look different in each country. */
const platePlaceholders: Record<Lang, string> = {sv: 'ABC 123', en: 'ABC 123', nb: 'AB 12345', fi: 'ABC-123'}

const SEPARATOR = '-'

/** "page-home" → "page-home-sv"; "drafts.post-x" → "drafts.post-x-sv". Asset references are left alone. */
const withLang = (id: string, lang: Lang) => (id.startsWith('image-') || id.startsWith('file-') ? id : `${id}${SEPARATOR}${lang}`)

function retarget(node: Json, lang: Lang): Json {
  if (Array.isArray(node)) return node.map((item) => retarget(item, lang))
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => {
        if (k === '_ref' && typeof v === 'string') return [k, withLang(v, lang)]
        if (k === '_id' && typeof v === 'string') return [k, withLang(v, lang)]
        return [k, retarget(v, lang)]
      }),
    )
  }
  return node
}

export interface LocalizeReport {
  missing: Set<string>
}

/** One document in one language: its own id, its references pointing at the same language, translated text. */
export function localize(doc: object, lang: Lang, report: LocalizeReport): Record<string, unknown> {
  const dictionary = dictionaryFor(lang)
  const translated = (lang === 'en' ? doc : mapStrings(doc as Json, null, (value) => {
    const text = dictionary[value]
    if (text === undefined) {
      report.missing.add(value)
      return value
    }
    return text
  })) as Json

  const result = retarget(translated, lang) as Record<string, unknown>
  const type = result._type as string

  if (TRANSLATED_TYPES.has(type)) result.language = lang

  // Plates look different in every country.
  for (const block of (result.blocks as {_type?: string; plateSearch?: {placeholder?: string}}[] | undefined) ?? []) {
    if (block._type === 'heroBlock' && block.plateSearch) block.plateSearch.placeholder = platePlaceholders[lang]
  }
  return result
}

/** The id a document gets in a language. */
export const idInLanguage = (baseId: string, lang: Lang) => withLang(baseId, lang)
