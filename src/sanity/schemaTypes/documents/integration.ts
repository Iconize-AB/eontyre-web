import {PlugIcon} from '@sanity/icons/Plug'
import {defineField, defineType} from 'sanity'

import {imageField} from '../fields'

export const integration = defineType({
  name: 'integration',
  title: 'Integration',
  type: 'document',
  icon: PlugIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    imageField({name: 'logo', title: 'Logo'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Accounting', value: 'accounting'},
          {title: 'Payments and point of sale', value: 'payments'},
          {title: 'Check-in and inspection', value: 'inspection'},
          {title: 'Storage', value: 'storage'},
          {title: 'Suppliers', value: 'suppliers'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 3}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
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
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'logo'},
  },
})
