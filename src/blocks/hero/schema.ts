import {ImageIcon} from '@sanity/icons/Image'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, imageField, themeField} from '../../sanity/schemaTypes/fields'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3, group: 'content'}),
    imageField({name: 'image', title: 'Image', group: 'content', required: true}),
    defineField({
      name: 'action',
      title: 'Action',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Buttons', value: 'buttons'},
          {title: 'Registration plate search', value: 'plateSearch'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'button'})],
      validation: (rule) => rule.max(2),
      hidden: ({parent}) => parent?.action !== 'buttons',
    }),
    defineField({
      name: 'plateSearch',
      title: 'Plate search',
      type: 'object',
      group: 'content',
      hidden: ({parent}) => parent?.action !== 'plateSearch',
      fields: [
        defineField({name: 'placeholder', title: 'Placeholder', type: 'string', initialValue: 'ABC 123'}),
        defineField({name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Find tyres'}),
        defineField({
          name: 'targetUrl',
          title: 'Target path',
          type: 'string',
          description: 'The plate is sent as ?plate=ABC123.',
          initialValue: '/webshop',
        }),
      ],
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Tall', value: 'tall'},
          {title: 'Full screen', value: 'fullscreen'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'tall',
    }),
    themeField,
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', media: 'image'},
    prepare: ({title, subtitle, media}) => ({title, subtitle: subtitle ? `Hero · ${subtitle}` : 'Hero', media}),
  },
})
