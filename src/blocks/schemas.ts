import {anchorNavBlock} from './anchorNav/schema'
import {ctaBannerBlock} from './ctaBanner/schema'
import {faqBlock} from './faq/schema'
import {featureGridBlock} from './featureGrid/schema'
import {featureRowsBlock} from './featureRows/schema'
import {formBlock} from './form/schema'
import {heroBlock} from './hero/schema'
import {imageBlock} from './image/schema'
import {integrationDirectoryBlock} from './integrationDirectory/schema'
import {linkListBlock} from './linkList/schema'
import {logoGridBlock} from './logoGrid/schema'
import {newsListBlock} from './newsList/schema'
import {pageHeroBlock} from './pageHero/schema'
import {productScreenBlock} from './productScreen/schema'
import {richTextBlock} from './richTextBlock/schema'
import {statsBlock} from './stats/schema'
import {textMediaBlock} from './textMedia/schema'

/**
 * Page-builder blocks, in the order they appear in the Studio's insert menu.
 * To add a block: create `src/blocks/<name>/` with schema.ts, query.ts and a
 * component, then register it here and in `./index.tsx` and `./query.ts`.
 */
export const blockSchemas = [
  // Page tops
  heroBlock,
  pageHeroBlock,
  anchorNavBlock,
  // Content
  productScreenBlock,
  textMediaBlock,
  featureGridBlock,
  featureRowsBlock,
  linkListBlock,
  richTextBlock,
  imageBlock,
  statsBlock,
  // Lists from other documents
  logoGridBlock,
  integrationDirectoryBlock,
  newsListBlock,
  // Endings
  faqBlock,
  formBlock,
  ctaBannerBlock,
]

export const blockTypeNames = blockSchemas.map((schema) => schema.name)
