import {ThListIcon} from '@sanity/icons/ThList'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, imageField, spacingField, themeField} from '../../sanity/schemaTypes/fields'

export const featureRowsBlock = defineType({
  name: 'featureRowsBlock',
  title: 'Feature rows',
  type: 'object',
  icon: ThListIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content'}),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      group: 'content',
      description: 'Rows are numbered 01, 02, 03… in this order.',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureRow',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
            imageField({name: 'image', title: 'Image', required: true}),
            defineField({name: 'link', title: 'Link', type: 'link', description: 'The whole row links here.'}),
          ],
          preview: {select: {title: 'title', subtitle: 'body', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Right', value: 'right'},
          {title: 'Alternate', value: 'alternate'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'right',
    }),
    themeField,
    spacingField,
  ],
  preview: {
    select: {heading: 'heading', rows: 'rows'},
    prepare: ({heading, rows}: {heading?: string; rows?: {title?: string}[]}) => ({
      title: heading || rows?.map((row) => row.title).join(' · ') || 'Feature rows',
      subtitle: 'Feature rows',
    }),
  },
})
