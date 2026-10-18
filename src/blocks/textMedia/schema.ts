import {BlockContentIcon} from '@sanity/icons/BlockContent'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, imageField, richTextField} from '../../sanity/schemaTypes/fields'

export const textMediaBlock = defineType({
  name: 'textMediaBlock',
  title: 'Text and image',
  type: 'object',
  icon: BlockContentIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'content',
      description: 'Optional small orange label above the heading, e.g. "Tip".',
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    richTextField(),
    defineField({
      name: 'list',
      title: 'List',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'listStyle',
      title: 'List style',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Numbered', value: 'numbered'},
          {title: 'Plain', value: 'plain'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'plain',
      hidden: ({parent}) => !parent?.list?.length,
    }),
    defineField({name: 'link', title: 'Text link', type: 'navItem', group: 'content'}),
    imageField({name: 'image', title: 'Image', group: 'content', required: true, description: 'Shown at 3:2.'}),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', media: 'image', position: 'imagePosition'},
    prepare: ({title, media, position}) => ({
      title,
      subtitle: blockSubtitle('Text and image', position === 'right' ? 'Image right' : 'Image left'),
      media,
    }),
  },
})
