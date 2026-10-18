import {DesktopIcon} from '@sanity/icons/Desktop'
import {defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, richTextField} from '../../sanity/schemaTypes/fields'

export const productScreens = [
  {title: 'Booking calendar', value: 'bookingCalendar'},
  {title: 'Order summary', value: 'orderSummary'},
  {title: 'Plate search demo', value: 'plateSearchDemo'},
]

export const productScreenBlock = defineType({
  name: 'productScreenBlock',
  title: 'Product screen',
  type: 'object',
  icon: DesktopIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    richTextField(),
    defineField({
      name: 'note',
      title: 'Small print',
      type: 'string',
      group: 'content',
      description: 'Optional line under the body, e.g. "Demo data. Try ABC 123…".',
    }),
    defineField({
      name: 'screen',
      title: 'Screen',
      type: 'string',
      group: 'content',
      description: 'A coded picture of the product. The screens themselves are built into the website.',
      options: {list: productScreens, layout: 'radio'},
      initialValue: 'bookingCalendar',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'style',
      description: 'Leave empty to use the default: stacked for the booking calendar, split for the others.',
      options: {
        list: [
          {title: 'Split (text left, screen right)', value: 'split'},
          {title: 'Stacked (screen full width below)', value: 'stacked'},
        ],
        layout: 'radio',
      },
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', screen: 'screen'},
    prepare: ({title, screen}) => ({
      title,
      subtitle: blockSubtitle('Product screen', productScreens.find((s) => s.value === screen)?.title),
    }),
  },
})
