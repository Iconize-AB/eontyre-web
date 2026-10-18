import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, imageField, richTextField} from '../../sanity/schemaTypes/fields'

export const featureGridVariants = [
  {title: 'Top rule', value: 'topRule'},
  {title: 'Numbered', value: 'numbered'},
  {title: 'Steps (compact list)', value: 'steps'},
  {title: 'Cards', value: 'cards'},
]

const layouts = [
  {title: 'Full width', value: 'full'},
  {title: 'Split (text left, items right)', value: 'split'},
]

const sources = [
  {title: 'Written here', value: 'manual'},
  {title: 'Related items of this add-on or integration', value: 'related'},
]

export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature grid',
  type: 'object',
  icon: ThLargeIcon,
  groups: blockGroups,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content'}),
    richTextField(),
    defineField({
      name: 'headerLink',
      title: 'Link next to the heading',
      type: 'navItem',
      group: 'content',
      description: 'E.g. "See all integrations", shown right-aligned.',
    }),
    defineField({
      name: 'source',
      title: 'Items come from',
      type: 'string',
      group: 'content',
      description:
        '"Related items" shows the "Works well with" list of the add-on or integration this block sits on, as cards.',
      options: {list: sources, layout: 'radio'},
      initialValue: 'manual',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      group: 'content',
      hidden: ({parent}) => parent?.source === 'related',
      validation: (rule) =>
        rule.max(12).custom((value, {parent}) =>
          (parent as {source?: string})?.source !== 'related' && !value?.length ? 'Add at least one item' : true,
        ),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureGridItem',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'richText',
              description: 'Phone numbers and e-mail addresses can be links (tel:, mailto:).',
            }),
            imageField({name: 'image', title: 'Logo or image', description: 'Shown as a 64px tall strip above the title.'}),
            defineField({name: 'link', title: 'Link', type: 'link', description: 'Cards: the whole card links here.'}),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'style',
      options: {list: layouts, layout: 'radio'},
      initialValue: 'full',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      group: 'style',
      options: {list: featureGridVariants, layout: 'radio'},
      initialValue: 'topRule',
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {heading: 'heading', firstItem: 'items.0.title', variant: 'variant'},
    prepare: ({heading, firstItem, variant}) => ({
      title: heading || firstItem || 'Feature grid',
      subtitle: blockSubtitle('Feature grid', featureGridVariants.find((v) => v.value === (variant ?? 'topRule'))?.title),
    }),
  },
})
