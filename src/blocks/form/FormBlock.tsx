import {stegaClean} from 'next-sanity'

import {hasRichText, RichText} from '@/components/RichText'
import {SanityImage} from '@/components/SanityImage'
import {Section} from '@/components/Section'
import {getDictionary} from '@/i18n/server'
import {isFormType} from '@/lib/forms'
import type {BlockOf} from '@/sanity/content-types'

import {FormClient} from './FormClient'

type Block = BlockOf<'formBlock'>

export async function FormBlock({block, isFirst}: {block: Block; isFirst: boolean}) {
  const dictionary = await getDictionary()
  const formType = stegaClean(block.formType)
  if (!isFormType(formType)) return null

  const layout = stegaClean(block.layout) ?? 'split'
  const isH1 = stegaClean(block.headingLevel) === 'h1'
  const Heading = isH1 ? 'h1' : 'h2'

  const form = (
    <FormClient
      formType={formType}
      arrangement={layout === 'inline' ? 'inline' : formType === 'trial' ? 'columns' : 'stack'}
      submitLabel={block.submitLabel ?? ''}
      successHeading={block.successHeading ?? ''}
      successBody={block.successBody}
      errorText={block.errorText || dictionary.forms.error}
      finePrint={hasRichText(block.finePrint) ? <RichText value={block.finePrint} size="base" className="!text-[13px]" /> : undefined}
    />
  )

  if (layout === 'withImage') {
    return (
      <Section settings={block} padded={false} className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))]">
          <div className="px-[clamp(20px,4vw,40px)] py-[clamp(56px,7vw,96px)]">
            <Heading className="mb-4 font-display text-[clamp(40px,4.6vw,64px)] leading-none font-extrabold tracking-[-0.01em] text-balance uppercase [font-stretch:118%]">
              {block.heading}
            </Heading>
            <RichText value={block.body} className="mb-10 max-w-[500px]" />
            {form}
          </div>
          <div className="relative min-h-[560px] bg-surface">
            <SanityImage image={block.image} sizes="(min-width: 1280px) 640px, (min-width: 1000px) 50vw, 100vw" preload={isFirst} />
          </div>
        </div>
      </Section>
    )
  }

  if (layout === 'inline') {
    return (
      <Section settings={block} padded={false} className="py-[clamp(56px,7vw,88px)]">
        <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-x-16 gap-y-6">
          <div>
            <Heading className="mb-3 font-display text-[28px] font-extrabold tracking-[-0.01em] uppercase [font-stretch:115%]">
              {block.heading}
            </Heading>
            <RichText value={block.body} size="base" />
          </div>
          {form}
        </div>
      </Section>
    )
  }

  return (
    <Section settings={block}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-8">
        <div>
          <Heading
            className={
              isH1
                ? 'type-page-h1 mb-4'
                : 'mb-3 text-[24px] font-bold tracking-[-0.015em]'
            }
          >
            {block.heading}
          </Heading>
          <RichText value={block.body} size="base" className="max-w-[420px]" />
        </div>
        {form}
      </div>
    </Section>
  )
}
