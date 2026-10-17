import {DocumentIcon} from '@sanity/icons/Document'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockTypeNames} from '../../../blocks/schemas'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL path',
      type: 'slug',
      group: 'content',
      description: 'For example "webshop" or "integrations/fortnox". The home page is chosen in Site settings.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) =>
        rule.required().custom((slug) => {
          const value = slug?.current
          if (!value) return true
          return /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value)
            ? true
            : 'Use lowercase letters, numbers and hyphens, with "/" between levels'
        }),
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      group: 'content',
      of: blockTypeNames.map((type) => defineArrayMember({type})),
      options: {
        insertMenu: {
          views: [{name: 'list'}],
        },
      },
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare: ({title, slug}) => ({title, subtitle: slug ? `/${slug}` : 'No URL yet'}),
  },
})
