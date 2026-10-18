import {defineArrayMember, defineType} from 'sanity'

/** Body copy in blocks: paragraphs, bold and links (BRIEF-2). */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Paragraph', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [{title: 'Bold', value: 'strong'}],
        annotations: [defineArrayMember({name: 'link', type: 'link'})],
      },
    }),
  ],
})

/** Article body for news posts: headings, lists and images as well. */
export const postBody = defineType({
  name: 'postBody',
  title: 'Article body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullets', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [defineArrayMember({name: 'link', type: 'link'})],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', title: 'Alt text', type: 'string', validation: (rule) => rule.required()},
        {name: 'caption', title: 'Caption', type: 'string'},
      ],
    }),
  ],
})
