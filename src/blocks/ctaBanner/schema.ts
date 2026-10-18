import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {anchorIdField, blockGroups, blockSubtitle, imageField, themeField} from '../../sanity/schemaTypes/fields'

const styles = [
  {title: 'Photo', value: 'photo'},
  {title: 'Accent (orange band)', value: 'accent'},
  {title: 'Surface', value: 'surface'},
]

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA banner',
  type: 'object',
  icon: BulbOutlineIcon,
  groups: blockGroups,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Not shown in the accent style.',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      group: 'content',
      description: 'Accent style shows the first button only, as a black pill.',
      of: [defineArrayMember({type: 'button'})],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      // Replaced by `buttons`. Kept read-only so older content still shows; queries fall back to it.
      name: 'button',
      title: 'Button (old)',
      type: 'button',
      group: 'content',
      readOnly: true,
      hidden: ({value}) => !value,
      description: 'Move this into "Buttons" above, then clear it.',
    }),
    imageField({
      name: 'image',
      title: 'Background image',
      group: 'content',
      description: 'Photo style only. Set the hotspot to keep faces in view when the image is cropped.',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      group: 'style',
      options: {list: styles, layout: 'radio'},
      initialValue: 'photo',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay darkness',
      type: 'number',
      group: 'style',
      description: 'Photo style. 0 = no overlay, 0.8 = very dark. Default 0.55.',
      initialValue: 0.55,
      hidden: ({parent}) => (parent?.style ?? 'photo') !== 'photo',
      validation: (rule) => rule.min(0).max(0.8),
    }),
    themeField,
    anchorIdField,
  ],
  validation: (rule) =>
    rule.custom((value: {style?: string; image?: unknown} | undefined) =>
      (value?.style ?? 'photo') === 'photo' && !value?.image ? 'The photo style needs a background image' : true,
    ),
  preview: {
    select: {title: 'heading', media: 'image', style: 'style'},
    prepare: ({title, media, style}) => ({
      title,
      subtitle: blockSubtitle('CTA banner', styles.find((s) => s.value === (style ?? 'photo'))?.title.split(' (')[0]),
      media,
    }),
  },
})
