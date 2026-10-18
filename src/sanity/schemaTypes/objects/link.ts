import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link to',
      type: 'string',
      options: {
        list: [
          {title: 'Page on this site', value: 'internal'},
          {title: 'URL or path', value: 'external'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'integration'}, {type: 'post'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, {parent}) =>
          (parent as {linkType?: string})?.linkType === 'internal' && !value
            ? 'Choose a page'
            : true,
        ),
    }),
    defineField({
      name: 'anchor',
      title: 'Section on the page',
      type: 'string',
      description: 'Optional anchor ID of a block on that page, e.g. "contact".',
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) => rule.regex(/^[a-z][a-z0-9-]*$/).error('Lowercase letters, numbers and hyphens'),
    }),
    defineField({
      name: 'url',
      title: 'URL or path',
      type: 'url',
      description: 'Full URL (https://…), a path on this site (/start), mailto: or tel:.',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule
          .uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})
          .custom((value, {parent}) =>
            (parent as {linkType?: string})?.linkType === 'external' && !value
              ? 'Enter a URL or path'
              : true,
          ),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
