import {ThListIcon} from '@sanity/icons/ThList'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, imageField} from '../../sanity/schemaTypes/fields'

const styles = [
  {title: 'Panels (whole row is a link)', value: 'panels'},
  {title: 'Editorial (text link per row)', value: 'editorial'},
]

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
      description: 'In the panels style, rows are numbered 01, 02, 03… in this order.',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureRow',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
            imageField({name: 'image', title: 'Image', required: true}),
            defineField({name: 'link', title: 'Link', type: 'link'}),
            defineField({
              name: 'linkLabel',
              title: 'Link text',
              type: 'string',
              description: 'Editorial style only. The panels style makes the whole row the link.',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'body', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      group: 'style',
      options: {list: styles, layout: 'radio'},
      initialValue: 'panels',
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
    ...blockSettingsFields({background: false}),
  ],
  preview: {
    select: {heading: 'heading', rows: 'rows', style: 'style', media: 'rows.0.image'},
    prepare: ({heading, rows, style, media}) => ({
      title: heading || (rows as {title?: string}[] | undefined)?.map((row) => row.title).join(' · ') || 'Feature rows',
      subtitle: blockSubtitle('Feature rows', styles.find((s) => s.value === (style ?? 'panels'))?.title.split(' (')[0]),
      media,
    }),
  },
})
