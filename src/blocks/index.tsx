import type {ComponentType} from 'react'

import type {BlockOf, PageBlock} from '@/sanity/content-types'

import {AnchorNavBlock} from './anchorNav/AnchorNavBlock'
import {CtaBannerBlock} from './ctaBanner/CtaBannerBlock'
import {FeatureGridBlock} from './featureGrid/FeatureGridBlock'
import {FeatureRowsBlock} from './featureRows/FeatureRowsBlock'
import {FormBlock} from './form/FormBlock'
import {HeroBlock} from './hero/HeroBlock'
import {ImageBlock} from './image/ImageBlock'
import {IntegrationDirectoryBlock} from './integrationDirectory/IntegrationDirectoryBlock'
import {LinkListBlock} from './linkList/LinkListBlock'
import {LogoGridBlock} from './logoGrid/LogoGridBlock'
import {NewsListBlock} from './newsList/NewsListBlock'
import {PageHeroBlock} from './pageHero/PageHeroBlock'
import {ProductScreenBlock} from './productScreen/ProductScreenBlock'
import {RichTextBlock} from './richTextBlock/RichTextBlock'
import {StatsBlock} from './stats/StatsBlock'
import {TextMediaBlock} from './textMedia/TextMediaBlock'

type BlockProps<T extends PageBlock['_type']> = {block: BlockOf<T>; isFirst: boolean}

const components: {[T in PageBlock['_type']]: ComponentType<BlockProps<T>>} = {
  heroBlock: HeroBlock,
  pageHeroBlock: PageHeroBlock,
  anchorNavBlock: AnchorNavBlock,
  productScreenBlock: ProductScreenBlock,
  textMediaBlock: TextMediaBlock,
  featureGridBlock: FeatureGridBlock,
  featureRowsBlock: FeatureRowsBlock,
  linkListBlock: LinkListBlock,
  richTextBlock: RichTextBlock,
  imageBlock: ImageBlock,
  statsBlock: StatsBlock,
  logoGridBlock: LogoGridBlock,
  integrationDirectoryBlock: IntegrationDirectoryBlock,
  newsListBlock: NewsListBlock,
  formBlock: FormBlock,
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
