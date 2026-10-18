import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle} from '../../sanity/schemaTypes/fields'

const sources = [
  {title: 'From this page (add-ons and integrations)', value: 'document'},
  {title: 'Written here (any page)', value: 'custom'},
]

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'Questions and answers',
  type: 'object',
  icon: HelpCircleIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      description: 'Optional. Leave empty for the built-in heading in each language ("Questions and answers").',
    }),
    defineField({
      name: 'source',
      title: 'Questions come from',
      type: 'string',
      group: 'content',
      description:
        '"From this page" uses the questions written on the add-on or integration itself. "Written here" lets you add questions to any page.',
      options: {list: sources, layout: 'radio'},
      initialValue: 'document',
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'faqItem'})],
      hidden: ({parent}) => parent?.source !== 'custom',
      validation: (rule) =>
        rule.custom((value, {parent}) =>
          (parent as {source?: string})?.source === 'custom' && !value?.length ? 'Add at least one question' : true,
        ),
    }),
    defineField({
      name: 'openFirst',
      title: 'Open the first question',
      type: 'boolean',
      group: 'style',
      initialValue: true,
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', source: 'source'},
    prepare: ({title, source}) => ({
      title: title || 'Questions and answers',
      subtitle: blockSubtitle('Questions and answers', source === 'custom' ? 'Written here' : 'From this page'),
    }),
  },
})
