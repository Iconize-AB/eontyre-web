import {defineField, defineType} from 'sanity'

export const button = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'link', title: 'Link', type: 'link', validation: (rule) => rule.required()}),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary (orange)', value: 'primary'},
          {title: 'Outline', value: 'outline'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'variant'},
  },
})

/** A labelled link without button styling: nav items, footer links. */
export const navItem = defineType({
  name: 'navItem',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'link', title: 'Link', type: 'link', validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {title: 'label', url: 'link.url', page: 'link.page.slug.current'},
    prepare: ({title, url, page}) => ({title, subtitle: page ? `/${page}` : url}),
  },
})
