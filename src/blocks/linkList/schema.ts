import {UlistIcon} from '@sanity/icons/Ulist'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, richTextField} from '../../sanity/schemaTypes/fields'

export const linkListBlock = defineType({
  name: 'linkListBlock',
  title: 'Link list',
  type: 'object',
  icon: UlistIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    richTextField(),
    defineField({name: 'button', title: 'Button', type: 'button', group: 'content'}),
    defineField({
      name: 'items',
      title: 'Rows',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'linkListItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'meta',
              title: 'Detail',
              type: 'string',
              description: 'Shown right-aligned in monospace, e.g. an API path like /v1/tyres.',
            }),
            defineField({name: 'link', title: 'Link', type: 'link', description: 'Makes the whole row a link.'}),
          ],
          preview: {select: {title: 'label', subtitle: 'meta'}},
        }),
      ],
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', count: 'items.length'},
    prepare: ({title}) => ({title, subtitle: 'Link list'}),
  },
})
