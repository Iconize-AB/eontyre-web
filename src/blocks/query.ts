import {anchorNavBlockFields} from './anchorNav/query'
import {ctaBannerBlockFields} from './ctaBanner/query'
import {faqBlockFields} from './faq/query'
import {featureGridBlockFields} from './featureGrid/query'
import {featureRowsBlockFields} from './featureRows/query'
import {formBlockFields} from './form/query'
import {heroBlockFields} from './hero/query'
import {imageBlockFields} from './image/query'
import {integrationDirectoryBlockFields} from './integrationDirectory/query'
import {linkListBlockFields} from './linkList/query'
import {logoGridBlockFields} from './logoGrid/query'
import {newsListBlockFields} from './newsList/query'
import {pageHeroBlockFields} from './pageHero/query'
import {productScreenBlockFields} from './productScreen/query'
import {richTextBlockFields} from './richTextBlock/query'
import {statsBlockFields} from './stats/query'
import {textMediaBlockFields} from './textMedia/query'

export const blocksProjection = /* groq */ `
  blocks[]{
    _key,
    _type,
    ${heroBlockFields},
    ${pageHeroBlockFields},
    ${anchorNavBlockFields},
    ${productScreenBlockFields},
    ${textMediaBlockFields},
    ${featureGridBlockFields},
    ${featureRowsBlockFields},
    ${linkListBlockFields},
    ${richTextBlockFields},
    ${imageBlockFields},
    ${statsBlockFields},
    ${logoGridBlockFields},
    ${integrationDirectoryBlockFields},
    ${newsListBlockFields},
    ${faqBlockFields},
    ${formBlockFields},
    ${ctaBannerBlockFields}
  }
`
