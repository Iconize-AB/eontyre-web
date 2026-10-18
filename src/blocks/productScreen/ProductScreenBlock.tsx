import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {RichText} from '@/components/RichText'
import {Section} from '@/components/Section'
import type {Dictionary} from '@/i18n/dictionaries'
import {getDictionary} from '@/i18n/server'
import type {BlockOf} from '@/sanity/content-types'

import {BookingCalendar} from './screens/BookingCalendar'
import {OrderSummary} from './screens/OrderSummary'
import {PlateSearchDemo, PlateSearchDemoFallback} from './screens/PlateSearchDemo'

function Screen({screen, dictionary}: {screen: string | null; dictionary: Dictionary}) {
  switch (screen) {
    case 'bookingCalendar':
      return <BookingCalendar dictionary={dictionary} />
    case 'orderSummary':
      return <OrderSummary dictionary={dictionary} />
    case 'plateSearchDemo':
      return (
        <Suspense fallback={<PlateSearchDemoFallback />}>
          <PlateSearchDemo />
        </Suspense>
      )
    default:
      return null
  }
}

export async function ProductScreenBlock({block}: {block: BlockOf<'productScreenBlock'>}) {
  const dictionary = await getDictionary()
  const screen = stegaClean(block.screen)
  const layout = stegaClean(block.layout) || (screen === 'bookingCalendar' ? 'stacked' : 'split')
  const note = block.note && <p className="mt-4 text-[15px] leading-[1.55] text-fg-subtle">{block.note}</p>

  if (layout === 'stacked') {
    return (
      <Section settings={block}>
        <div className="container-wide">
          <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-6">
            <h2 className="type-block-h2">{block.heading}</h2>
            <div className="max-w-[540px]">
              <RichText value={block.body} />
              {note}
            </div>
          </div>
          <Screen screen={screen} dictionary={dictionary} />
        </div>
      </Section>
    )
  }

  return (
    <Section settings={block}>
      <div className="container-wide grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-16 gap-y-12">
        <div>
          <h2 className="type-block-h2 mb-5">{block.heading}</h2>
          <RichText value={block.body} />
          {note}
        </div>
        <Screen screen={screen} dictionary={dictionary} />
      </div>
    </Section>
  )
}
