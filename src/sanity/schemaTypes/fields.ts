import {defineField} from 'sanity'

interface ImageFieldOptions {
  name: string
  title: string
  description?: string
  group?: string
  required?: boolean
}

/** Image with hotspot and required alt text. Every image on the site uses this. */
export function imageField(options: ImageFieldOptions) {
  const {required, ...rest} = options
  return defineField({
    ...rest,
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the image for screen readers and search engines.',
        validation: (rule) => rule.required(),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  })
}

export const themeField = defineField({
  name: 'theme',
  title: 'Theme',
  type: 'string',
  options: {
    list: [
      {title: 'Dark', value: 'dark'},
      {title: 'Light', value: 'light'},
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'dark',
  group: 'style',
})

const spacingOptions = {
  list: [
    {title: 'Default', value: 'default'},
    {title: 'None', value: 'none'},
  ],
  layout: 'radio' as const,
  direction: 'horizontal' as const,
}

/** Vertical section padding, e.g. to let a block sit directly under the previous one. */
export const spacingField = defineField({
  name: 'spacing',
  title: 'Spacing',
  type: 'object',
  group: 'style',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'top', title: 'Top', type: 'string', options: spacingOptions, initialValue: 'default'}),
    defineField({name: 'bottom', title: 'Bottom', type: 'string', options: spacingOptions, initialValue: 'default'}),
  ],
})

export const blockGroups = [
  {name: 'content', title: 'Content', default: true},
  {name: 'style', title: 'Style'},
]
