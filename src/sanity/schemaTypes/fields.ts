import {defineField, type FieldDefinition} from 'sanity'

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

/** Paragraphs with bold and links. Used for body copy in blocks. */
export function richTextField(options: {name?: string; title?: string; group?: string; description?: string} = {}) {
  return defineField({name: 'body', title: 'Body', group: 'content', ...options, type: 'richText'})
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

export const backgroundField = defineField({
  name: 'background',
  title: 'Background',
  type: 'string',
  options: {
    list: [
      {title: 'Default', value: 'default'},
      {title: 'Surface', value: 'surface'},
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'default',
  group: 'style',
})

export const paddingTopField = defineField({
  name: 'paddingTop',
  title: 'Space above',
  type: 'string',
  description: 'Choose "None" when the block continues the one above it.',
  options: {
    list: [
      {title: 'Default', value: 'default'},
      {title: 'None', value: 'none'},
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'default',
  group: 'style',
})

export const anchorIdField = defineField({
  name: 'anchorId',
  title: 'Anchor ID',
  type: 'string',
  group: 'style',
  description: 'Lets jump links point here, e.g. "booking" for /business-system#booking.',
  validation: (rule) =>
    rule.regex(/^[a-z][a-z0-9-]*$/, {name: 'anchor'}).error('Lowercase letters, numbers and hyphens'),
})

/** The style settings every block has (BRIEF-2, "Rules for every block"). */
export function blockSettingsFields({
  background = true,
  paddingTop = true,
}: {background?: boolean; paddingTop?: boolean} = {}): FieldDefinition[] {
  return [
    themeField,
    ...(background ? [backgroundField] : []),
    anchorIdField,
    ...(paddingTop ? [paddingTopField] : []),
  ]
}

/**
 * Small interface texts (button labels, empty states). Left empty, each language
 * shows its own built-in default, so a translated block needs no extra work.
 */
export function labelsField(labels: {name: string; title: string; initialValue: string}[]) {
  return defineField({
    name: 'labels',
    title: 'Interface texts',
    type: 'object',
    group: 'content',
    description: 'Optional. Leave a text empty to use the built-in text for this language.',
    options: {collapsible: true, collapsed: true},
    fields: labels.map(({initialValue, ...label}) =>
      defineField({...label, type: 'string', description: `Built-in text in English: "${initialValue}"`}),
    ),
  })
}

export const blockGroups = [
  {name: 'content', title: 'Content', default: true},
  {name: 'style', title: 'Style'},
]

/** Builds a Studio preview subtitle such as "Feature grid · Top rule". */
export function blockSubtitle(blockTitle: string, variant?: string | null) {
  return variant ? `${blockTitle} · ${variant}` : blockTitle
}
