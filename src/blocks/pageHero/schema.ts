import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, imageField, richTextField} from '../../sanity/schemaTypes/fields'

const mediaOptions = [
  {title: 'None (text only)', value: 'none'},
  {title: 'Image right', value: 'image'},
  {title: 'Image on top', value: 'imageTop'},
  {title: 'Code panel', value: 'code'},
]

export const pageHeroBlock = defineType({
  name: 'pageHeroBlock',
  title: 'Page hero',
  type: 'object',
  icon: ImagesIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      description: 'The page title (H1).',
      validation: (rule) => rule.required(),
    }),
    richTextField(),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'button'})],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: 'contactLines',
      title: 'Contact lines',
      type: 'array',
      group: 'content',
      description: 'Phone and e-mail shown large under the text. The first line is the biggest.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactLine',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'url',
              description: 'tel:020121034 or mailto:support@eontyre.com',
              validation: (rule) => rule.uri({scheme: ['tel', 'mailto', 'http', 'https']}),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'string',
      group: 'content',
      options: {list: mediaOptions, layout: 'radio'},
      initialValue: 'none',
    }),
    imageField({name: 'image', title: 'Image', group: 'content'}),
    defineField({
      name: 'codeMethod',
      title: 'Code: method',
      type: 'string',
      group: 'content',
      initialValue: 'GET',
      hidden: ({parent}) => parent?.media !== 'code',
    }),
    defineField({
      name: 'codePath',
      title: 'Code: path',
      type: 'string',
      group: 'content',
      hidden: ({parent}) => parent?.media !== 'code',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 12,
      group: 'content',
      hidden: ({parent}) => parent?.media !== 'code',
    }),
    ...blockSettingsFields({background: false, paddingTop: false}),
  ],
  validation: (rule) =>
    rule.custom((value: {media?: string; image?: unknown} | undefined) =>
      (value?.media === 'image' || value?.media === 'imageTop') && !value.image
        ? 'Add an image, or set Media to "None"'
        : true,
    ),
  preview: {
    select: {title: 'heading', media: 'image', mode: 'media'},
    prepare: ({title, media, mode}) => ({
      title,
      subtitle: blockSubtitle('Page hero', mediaOptions.find((o) => o.value === (mode ?? 'none'))?.title),
      media,
    }),
  },
})
