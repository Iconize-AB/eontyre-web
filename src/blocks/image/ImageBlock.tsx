import {stegaClean} from 'next-sanity'

import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import type {BlockOf} from '@/sanity/content-types'

const aspects: Record<string, string> = {
  '21:8': 'aspect-[21/8]',
  '16:9': 'aspect-video',
  '3:2': 'aspect-[3/2]',
}

/** One wide photo inside the content width. Has no padding of its own below; the next block spaces it. */
export function ImageBlock({block}: {block: BlockOf<'imageBlock'>}) {
  const aspect = aspects[stegaClean(block.aspect) ?? '21:8'] ?? aspects['21:8']

  return (
    <Section settings={block} padded={false} className={stegaClean(block.paddingTop) === 'none' ? '' : 'block-pt'}>
      <div className="container-wide">
        <div className={`relative min-h-[280px] overflow-hidden bg-surface ${aspect}`}>
          <SanityImage image={block.image} sizes="(min-width: 1360px) 1280px, 100vw" />
        </div>
      </div>
    </Section>
  )
}
