import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown in search results and browser tabs. Falls back to the page title.',
      validation: (rule) => rule.max(70).warning('Keep titles under 70 characters'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Share image',
      type: 'image',
      description: 'Used when the page is shared on social media. 1200 × 630 px.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
