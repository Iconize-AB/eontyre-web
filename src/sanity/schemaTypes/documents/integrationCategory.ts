import {TagIcon} from '@sanity/icons/Tag'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

import {isUniqueInLanguage, languageField} from '../language'

/** A group in the integration directory's filter: "Accounting", "Payments", "Add-ons"… */
export const integrationCategory = defineType({
  name: 'integrationCategory',
  title: 'Integration category',
  type: 'document',
  icon: TagIcon,
  orderings: [orderRankOrdering],
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown on the filter chips and on the cards.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Key',
      type: 'slug',
      description: 'Used in the address when a filter is selected, e.g. /integrations?category=accounting.',
      options: {source: 'title', maxLength: 48, isUnique: isUniqueInLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accentTile',
      title: 'Orange tiles',
      type: 'boolean',
      description: 'Shows the cards’ logo tile in orange instead of grey, e.g. for developer tools.',
      initialValue: false,
    }),
    orderRankField({type: 'integrationCategory'}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
