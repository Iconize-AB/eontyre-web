import {HashIcon} from '@sanity/icons/Hash'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields} from '../../sanity/schemaTypes/fields'

export const anchorNavBlock = defineType({
  name: 'anchorNavBlock',
  title: 'Jump links',
  type: 'object',
  icon: HashIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'items',
      title: 'Links',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'anchorNavItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'anchorId',
              title: 'Jumps to',
              type: 'string',
              description: 'The anchor ID of a block on this page (set under that block’s Style tab).',
              validation: (rule) =>
                rule.required().custom((value, context) => {
                  if (!value) return true
                  const blocks = (context.document?.blocks ?? []) as {anchorId?: string}[]
                  return blocks.some((block) => block.anchorId === value)
                    ? true
                    : `No block on this page has the anchor ID "${value}"`
                }),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'anchorId'}},
        }),
      ],
    }),
    ...blockSettingsFields({paddingTop: false}),
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}: {items?: {label?: string}[]}) => ({
      title: items?.map((item) => item.label).join(' · ') || 'Jump links',
      subtitle: 'Jump links',
    }),
  },
})
