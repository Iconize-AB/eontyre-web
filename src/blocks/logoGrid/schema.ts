import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {blockGroups, spacingField, themeField} from '../../sanity/schemaTypes/fields'

export const logoGridBlock = defineType({
  name: 'logoGridBlock',
  title: 'Logo grid',
  type: 'object',
  icon: ThLargeIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'button', title: 'Button', type: 'button', group: 'content'}),
    defineField({
      name: 'items',
      title: 'Integrations',
      type: 'array',
      group: 'content',
      description: 'Shows the logo when one is uploaded, otherwise the name.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'integration'}]})],
    }),
    themeField,
    spacingField,
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title, subtitle: 'Logo grid'}),
  },
})
