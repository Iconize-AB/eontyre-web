import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {RichText} from '@/components/RichText'
import {Section} from '@/components/Section'
import type {BlockOf} from '@/sanity/content-types'

import {BookingCalendar} from './screens/BookingCalendar'
import {OrderSummary} from './screens/OrderSummary'
import {PlateSearchDemo, PlateSearchDemoFallback} from './screens/PlateSearchDemo'

function Screen({screen}: {screen: string | null}) {
  switch (screen) {
    case 'bookingCalendar':
      return <BookingCalendar />
    case 'orderSummary':
      return <OrderSummary />
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

export function ProductScreenBlock({block}: {block: BlockOf<'productScreenBlock'>}) {
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
          <Screen screen={screen} />
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
        <Screen screen={screen} />
      </div>
    </Section>
  )
}
