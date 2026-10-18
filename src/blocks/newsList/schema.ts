import {DocumentsIcon} from '@sanity/icons/Documents'
import {defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, labelsField} from '../../sanity/schemaTypes/fields'

export const newsListBlock = defineType({
  name: 'newsListBlock',
  title: 'News list',
  type: 'object',
  icon: DocumentsIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content'}),
    defineField({
      name: 'showFeatured',
      title: 'Show the featured post large',
      type: 'boolean',
      group: 'content',
      description: 'The newest post marked "Featured" is shown at the top.',
      initialValue: true,
    }),
    defineField({name: 'showFilter', title: 'Show category filter', type: 'boolean', group: 'content', initialValue: true}),
    defineField({
      name: 'pageSize',
      title: 'Posts per page',
      type: 'number',
      group: 'content',
      description: 'More posts load with the "Load more" button.',
      initialValue: 10,
      validation: (rule) => rule.min(1).max(50).integer(),
    }),
    labelsField([
      {name: 'all', title: 'Filter: all', initialValue: 'All'},
      {name: 'readArticle', title: 'Featured post link', initialValue: 'Read the article'},
      {name: 'loadMore', title: 'Load more button', initialValue: 'Load more'},
      {name: 'empty', title: 'No posts', initialValue: 'No news yet.'},
    ]),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'News list', subtitle: 'News list'}),
  },
})
