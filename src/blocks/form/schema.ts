import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

import {blockGroups, blockSettingsFields, blockSubtitle, imageField, richTextField} from '../../sanity/schemaTypes/fields'

export const formTypes = [
  {title: 'Contact (name, e-mail, message)', value: 'contact'},
  {title: 'Free trial sign-up', value: 'trial'},
  {title: 'Newsletter (e-mail only)', value: 'newsletter'},
]

export const formBlock = defineType({
  name: 'formBlock',
  title: 'Form',
  type: 'object',
  icon: EnvelopeIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'formType',
      title: 'Form',
      type: 'string',
      group: 'content',
      description: 'The fields of each form are fixed in the website code.',
      options: {list: formTypes, layout: 'radio'},
      initialValue: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    richTextField(),
    defineField({
      name: 'submitLabel',
      title: 'Button text',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'finePrint',
      title: 'Fine print',
      type: 'richText',
      group: 'content',
      description: 'Shown under the button, e.g. "By signing up you accept the terms and conditions."',
    }),
    defineField({name: 'successHeading', title: 'Success heading', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    defineField({name: 'successBody', title: 'Success text', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'errorText',
      title: 'Error text',
      type: 'string',
      group: 'content',
      initialValue: 'Something went wrong. Please try again, or call us.',
    }),
    imageField({name: 'image', title: 'Image', group: 'content', description: 'Used by the "With image" layout.'}),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Split (text left, form right)', value: 'split'},
          {title: 'With image (text and form left, photo right)', value: 'withImage'},
          {title: 'Inline (field and button on one line)', value: 'inline'},
        ],
        layout: 'radio',
      },
      initialValue: 'split',
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading level',
      type: 'string',
      group: 'style',
      description: 'H1 when the form is the main content of the page (e.g. /start).',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'h2',
    }),
    ...blockSettingsFields(),
  ],
  preview: {
    select: {title: 'heading', formType: 'formType', media: 'image'},
    prepare: ({title, formType, media}) => ({
      title,
      subtitle: blockSubtitle('Form', formTypes.find((type) => type.value === formType)?.title.split(' (')[0]),
      media,
    }),
  },
})
