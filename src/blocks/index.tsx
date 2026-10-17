import type {ComponentType} from 'react'

import type {BlockOf, PageBlock} from '@/sanity/content-types'

import {CtaBannerBlock} from './ctaBanner/CtaBannerBlock'
import {FeatureRowsBlock} from './featureRows/FeatureRowsBlock'
import {HeroBlock} from './hero/HeroBlock'
import {LogoGridBlock} from './logoGrid/LogoGridBlock'
import {StatsBlock} from './stats/StatsBlock'

type BlockProps<T extends PageBlock['_type']> = {block: BlockOf<T>; isFirst: boolean}

const components: {[T in PageBlock['_type']]: ComponentType<BlockProps<T>>} = {
  heroBlock: HeroBlock,
  statsBlock: StatsBlock,
  featureRowsBlock: FeatureRowsBlock,
  logoGridBlock: LogoGridBlock,
  ctaBannerBlock: CtaBannerBlock,
}

export function Blocks({blocks}: {blocks: PageBlock[] | null | undefined}) {
  if (!blocks?.length) return null

  return blocks.map((block, index) => {
    const Component = components[block._type] as ComponentType<BlockProps<typeof block._type>> | undefined
    if (!Component) return null
    return <Component key={block._key} block={block} isFirst={index === 0} />
  })
}
