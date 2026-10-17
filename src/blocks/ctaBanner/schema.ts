import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {defineField, defineType} from 'sanity'

import {blockGroups, imageField, themeField} from '../../sanity/schemaTypes/fields'

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA banner',
  type: 'object',
  icon: BulbOutlineIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'button', title: 'Button', type: 'button', group: 'content'}),
    imageField({
      name: 'image',
      title: 'Background image',
      group: 'content',
      required: true,
      description: 'Set the hotspot to keep faces in view when the image is cropped.',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay darkness',
      type: 'number',
      group: 'style',
      description: '0 = no overlay, 0.8 = very dark. Default 0.55.',
      initialValue: 0.55,
      validation: (rule) => rule.min(0).max(0.8),
    }),
    themeField,
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({title, subtitle: 'CTA banner', media}),
  },
})
