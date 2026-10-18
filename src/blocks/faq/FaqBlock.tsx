import {RichText} from '@/components/RichText'
import {Section} from '@/components/Section'
import {getDictionary} from '@/i18n/server'
import type {BlockOf} from '@/sanity/content-types'
import {stegaClean} from 'next-sanity'

import {FaqList} from './FaqList'

type Block = BlockOf<'faqBlock'>

/** Plain text of a Portable Text value, for the FAQ structured data. */
function plainText(value: unknown): string {
  if (!Array.isArray(value)) return ''
  return value
    .map((block: {children?: {text?: string}[]}) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .filter(Boolean)
    .join(' ')
}

export async function FaqBlock({block}: {block: Block}) {
  const dictionary = await getDictionary()
  const source = stegaClean(block.source) === 'custom' ? 'custom' : 'document'
  const items = ((source === 'custom' ? block.items : block.documentItems) ?? []).filter(
    (item) => item.question && item.answer?.length,
  )
  if (!items.length) return null

  // FAQPage structured data, so the questions can appear in search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: stegaClean(item.question),
      acceptedAnswer: {'@type': 'Answer', text: stegaClean(plainText(item.answer))},
    })),
  }

  return (
    <Section settings={block}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-10">
        <h2 className="type-block-h2">{block.heading || dictionary.faq.heading}</h2>
        <FaqList
          questions={items.map((item) => item.question)}
          answers={items.map((item) => (
            <RichText key={item._key} value={item.answer} size="answer" />
          ))}
          openFirst={block.openFirst ?? true}
        />
      </div>
      <script
        type="application/ld+json"
        // "<" is escaped so answer text can never close the script tag.
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
    </Section>
  )
}
