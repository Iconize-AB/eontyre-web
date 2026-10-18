import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, imageField} from '../../sanity/schemaTypes/fields'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  groups: blockGroups,
  fields: [
    imageField({name: 'image', title: 'Image', group: 'content', required: true}),
    defineField({
      name: 'aspect',
      title: 'Shape',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Panorama (21:8)', value: '21:8'},
          {title: 'Wide (16:9)', value: '16:9'},
          {title: 'Photo (3:2)', value: '3:2'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '21:8',
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'image.alt', media: 'image', aspect: 'aspect'},
    prepare: ({title, media, aspect}) => ({title: title || 'Image', subtitle: blockSubtitle('Image', aspect), media}),
  },
})
