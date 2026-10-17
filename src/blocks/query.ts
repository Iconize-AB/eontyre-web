import {ctaBannerBlockFields} from './ctaBanner/query'
import {featureRowsBlockFields} from './featureRows/query'
import {heroBlockFields} from './hero/query'
import {logoGridBlockFields} from './logoGrid/query'
import {statsBlockFields} from './stats/query'

export const blocksProjection = /* groq */ `
  blocks[]{
    _key,
    _type,
    ${heroBlockFields},
    ${statsBlockFields},
    ${featureRowsBlockFields},
    ${logoGridBlockFields},
    ${ctaBannerBlockFields}
  }
`
