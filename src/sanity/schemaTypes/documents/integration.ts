import {PlugIcon} from '@sanity/icons/Plug'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockTypeNames} from '../../../blocks/schemas'
import {integrationCategories} from '../categories'
import {imageField} from '../fields'
import {isUniqueInLanguage, languageField} from '../language'

export const integration = defineType({
  name: 'integration',
  title: 'Integration',
  type: 'document',
  icon: PlugIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'card', title: 'Card', default: true},
    {name: 'page', title: 'Detail page'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    defineField({name: 'name', title: 'Name', type: 'string', group: 'card', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'card',
      description: 'The detail page lives at /integrations/{slug}.',
      options: {source: 'name', maxLength: 96, isUnique: isUniqueInLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short name',
      type: 'string',
      group: 'card',
      description: 'Two or three letters shown on the tile until a logo is uploaded, e.g. "Fx".',
      validation: (rule) => rule.required().max(3),
    }),
    imageField({name: 'logo', title: 'Logo', group: 'card'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'card',
      options: {list: integrationCategories},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'card',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'card',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Coming soon', value: 'comingSoon'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'available',
    }),
    defineField({
      name: 'linkOverride',
      title: 'Link somewhere else',
      type: 'link',
      group: 'card',
      description: 'For integrations that have their own page, e.g. Webshop → /webshop. "Read more" goes here.',
    }),
    defineField({
      name: 'hasDetailPage',
      title: 'Has a detail page',
      type: 'boolean',
      group: 'page',
      description: 'Publishes /integrations/{slug} and shows "Read more" on the card.',
      initialValue: false,
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      group: 'page',
      hidden: ({document}) => !document?.hasDetailPage,
      of: blockTypeNames.map((type) => defineArrayMember({type})),
      options: {insertMenu: {views: [{name: 'list'}]}},
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
    orderRankField({type: 'integration'}),
  ],
  preview: {
    select: {title: 'name', category: 'category', status: 'status', media: 'logo'},
    prepare: ({title, category, status, media}) => ({
      title,
      subtitle: [integrationCategories.find((c) => c.value === category)?.title, status === 'comingSoon' && 'Coming soon']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
