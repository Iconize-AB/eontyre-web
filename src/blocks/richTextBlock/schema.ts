import {TextIcon} from '@sanity/icons/Text'
import {defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle} from '../../sanity/schemaTypes/fields'

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content'}),
    defineField({name: 'body', title: 'Body', type: 'richText', group: 'content', validation: (rule) => rule.required()}),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Split (heading left, text right)', value: 'split'},
          {title: 'Single column', value: 'single'},
        ],
        layout: 'radio',
      },
      initialValue: 'split',
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', layout: 'layout'},
    prepare: ({title, layout}) => ({
      title: title || 'Text',
      subtitle: blockSubtitle('Text', layout === 'single' ? 'Single column' : 'Split'),
    }),
  },
})
