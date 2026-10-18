import type {StegaBranded, StegaCleaned} from 'next-sanity'

import type {PAGE_QUERY_RESULT, SETTINGS_QUERY_RESULT} from './types'

/**
 * A query result that may or may not carry stega (Visual Editing) markers.
 * Render strings as-is; run `stegaClean()` before comparing them to literals.
 */
export type Stega<T> = StegaCleaned<T> | StegaBranded<T>

export type PageData = NonNullable<Stega<PAGE_QUERY_RESULT>>
export type SettingsData = NonNullable<Stega<SETTINGS_QUERY_RESULT>>

export type PageBlock = NonNullable<PageData['blocks']>[number]
export type BlockOf<T extends PageBlock['_type']> = Extract<PageBlock, {_type: T}>

export type ImageData = NonNullable<BlockOf<'heroBlock'>['image']>
export type ButtonData = Omit<NonNullable<BlockOf<'heroBlock'>['buttons']>[number], '_key'>
export type LinkData = NonNullable<ButtonData['link']>
export type NavItemData = NonNullable<SettingsData['primaryCta']>
