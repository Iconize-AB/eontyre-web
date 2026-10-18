import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineField, defineType} from 'sanity'

/** One question and its answer. Used by the FAQ block, and by add-on and integration documents. */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question and answer',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'richText',
      description: 'Paragraphs, bold text and links.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'question'}},
})
