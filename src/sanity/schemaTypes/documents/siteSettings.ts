import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {imageField} from '../fields'

export const SITE_SETTINGS_ID = 'siteSettings'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      group: 'general',
      description: 'Appended to page titles, e.g. "Webshop | Eontyre".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'homePage',
      title: 'Home page',
      type: 'reference',
      to: [{type: 'page'}],
      group: 'general',
      description: 'The page shown at eontyre.com/.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'seo', title: 'Default SEO', type: 'seo', group: 'general'}),

    imageField({name: 'logo', title: 'Logo (for dark backgrounds)', group: 'header', required: true}),
    imageField({name: 'logoOnLight', title: 'Logo (for light backgrounds)', group: 'header'}),
    defineField({
      name: 'navItems',
      title: 'Navigation',
      type: 'array',
      group: 'header',
      of: [defineArrayMember({type: 'navItem'})],
    }),
    defineField({name: 'secondaryLink', title: 'Secondary link', type: 'navItem', group: 'header'}),
    defineField({name: 'primaryCta', title: 'Primary button', type: 'navItem', group: 'header'}),

    defineField({name: 'tagline', title: 'Tagline', type: 'text', rows: 2, group: 'footer'}),
    defineField({
      name: 'footerColumns',
      title: 'Link columns',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({type: 'navItem'})],
            }),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'lines', title: 'Lines', type: 'array', of: [defineArrayMember({type: 'string'})]}),
        defineField({name: 'link', title: 'Link', type: 'navItem'}),
      ],
    }),
    defineField({
      name: 'legal',
      title: 'Legal',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'copyright',
          title: 'Copyright',
          type: 'string',
          description: '{year} is replaced with the current year.',
        }),
        defineField({name: 'link', title: 'Link', type: 'navItem'}),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
