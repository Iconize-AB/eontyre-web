import type {Locale} from '../config'
import {en} from './en'
import {fi} from './fi'
import {nb} from './nb'
import {sv} from './sv'
import type {Dictionary} from './types'

export * from './types'

const dictionaries: Record<Locale, Dictionary> = {sv, en, nb, fi}

export const getDictionaryFor = (locale: Locale): Dictionary => dictionaries[locale]
