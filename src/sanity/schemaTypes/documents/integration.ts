import {PlugIcon} from '@sanity/icons/Plug'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockTypeNames} from '../../../blocks/schemas'
import {imageField} from '../fields'
import {isUniqueInLanguage, languageField, sameLanguage} from '../language'

export const integration = defineType({
  name: 'integration',
  title: 'Add-ons and integrations',
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
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'card',
      description: 'Add-on: a feature built into Eontyre that a garage switches on. Integration: connects Eontyre to another company’s system.',
      options: {
        list: [
          {title: 'Add-on (built into Eontyre)', value: 'addon'},
          {title: 'Integration (connects to another system)', value: 'integration'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'card',
      to: [{type: 'integrationCategory'}],
      options: sameLanguage,
      description: 'The filter group on the directory. Categories are managed under Integration categories.',
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
      name: 'relatedItems',
      title: 'Works well with',
      type: 'array',
      group: 'page',
      description: 'Up to three other add-ons or integrations, shown by a Feature grid block set to "Related items".',
      of: [defineArrayMember({type: 'reference', to: [{type: 'integration'}], options: sameLanguage})],
      validation: (rule) => rule.max(3),
      hidden: ({document}) => !document?.hasDetailPage,
    }),
    defineField({
      name: 'faq',
      title: 'Questions and answers',
      type: 'array',
      group: 'page',
      description: 'Shown by a FAQ block set to "From this page", and used for FAQ search results.',
      of: [defineArrayMember({type: 'faqItem'})],
      hidden: ({document}) => !document?.hasDetailPage,
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
    select: {title: 'name', kind: 'kind', category: 'category.title', status: 'status', media: 'logo'},
    prepare: ({title, kind, category, status, media}) => ({
      title,
      subtitle: [
        kind === 'addon' ? 'Add-on' : 'Integration',
        category,
        status === 'comingSoon' && 'Coming soon',
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
