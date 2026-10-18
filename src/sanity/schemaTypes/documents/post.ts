import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

import {postCategories} from '../categories'
import {imageField} from '../fields'

export const post = defineType({
  name: 'post',
  title: 'News post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The post lives at /news/{slug}.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'date',
      group: 'content',
      options: {dateFormat: 'D MMMM YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {list: postCategories, layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown in the news list. Max 200 characters.',
      validation: (rule) => rule.required().max(200),
    }),
    imageField({name: 'mainImage', title: 'Main image', group: 'content'}),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'content',
      description: 'The newest featured post is shown large at the top of /news.',
      initialValue: false,
    }),
    defineField({name: 'body', title: 'Body', type: 'postBody', group: 'content'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Newest first', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', date: 'publishedAt', category: 'category', media: 'mainImage'},
    prepare: ({title, date, category, media}) => ({
      title,
      subtitle: [postCategories.find((c) => c.value === category)?.title, date].filter(Boolean).join(' · '),
      media,
    }),
  },
})
