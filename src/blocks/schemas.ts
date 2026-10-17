import {ctaBannerBlock} from './ctaBanner/schema'
import {featureRowsBlock} from './featureRows/schema'
import {heroBlock} from './hero/schema'
import {logoGridBlock} from './logoGrid/schema'
import {statsBlock} from './stats/schema'

/**
 * Page-builder blocks, in the order they appear in the Studio's insert menu.
 * To add a block: create `src/blocks/<name>/` with schema.ts, query.ts and a
 * component, then register it here and in `./index.tsx` and `./query.ts`.
 */
export const blockSchemas = [heroBlock, statsBlock, featureRowsBlock, logoGridBlock, ctaBannerBlock]

export const blockTypeNames = blockSchemas.map((schema) => schema.name)
