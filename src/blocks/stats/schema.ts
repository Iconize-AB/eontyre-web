import {BarChartIcon} from '@sanity/icons/BarChart'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, themeField} from '../../sanity/schemaTypes/fields'

export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  icon: BarChartIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.min(2).max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'For example "2.4M".',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    themeField,
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}: {items?: {value?: string}[]}) => ({
      title: items?.map((item) => item.value).join(' · ') || 'Stats',
      subtitle: 'Stats',
    }),
  },
})
