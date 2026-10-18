import {PlugIcon} from '@sanity/icons/Plug'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, labelsField} from '../../sanity/schemaTypes/fields'
import {sameLanguage} from '../../sanity/schemaTypes/language'

export const integrationDirectoryBlock = defineType({
  name: 'integrationDirectoryBlock',
  title: 'Integration directory',
  type: 'object',
  icon: PlugIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content'}),
    defineField({
      name: 'items',
      title: 'Integrations',
      type: 'array',
      group: 'content',
      description: 'Leave empty to show every integration, in the order set under Integrations.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'integration'}], options: sameLanguage})],
    }),
    defineField({
      name: 'showFilter',
      title: 'Show category filter',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'filterCategories',
      title: 'Filter categories',
      type: 'array',
      group: 'content',
      description:
        'Leave empty to show every category that has at least one card. Categories are managed under Integration categories.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'integrationCategory'}], options: sameLanguage})],
      hidden: ({parent}) => !parent?.showFilter,
    }),
    labelsField([
      {name: 'all', title: 'Filter: all', initialValue: 'All'},
      {name: 'readMore', title: 'Card link', initialValue: 'Read more'},
      {name: 'available', title: 'Status: available', initialValue: 'Available'},
      {name: 'comingSoon', title: 'Status: coming soon', initialValue: 'Coming soon'},
      {name: 'empty', title: 'No integrations', initialValue: 'No integrations to show yet.'},
    ]),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', count: 'items.length'},
    prepare: ({title, count}) => ({
      title: title || 'Integration directory',
      subtitle: count ? `Integration directory · ${count} selected` : 'Integration directory · All',
    }),
  },
})
