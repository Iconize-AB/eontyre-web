import {defineField, type ReferenceOptions, type SlugValidationContext} from 'sanity'

/**
 * Written by the translation plugin (@sanity/document-internationalization);
 * editors never change it by hand.
 */
export const languageField = defineField({name: 'language', title: 'Language', type: 'string', readOnly: true, hidden: true})

/**
 * Slugs only have to be unique within one language, so the same page can use
 * the same address in every language.
 */
export async function isUniqueInLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2025-02-19'})
  const id = document?._id.replace(/^drafts\./, '')
  const params = {draft: `drafts.${id}`, published: id, language: document?.language, type: document?._type, slug}
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    _type == $type &&
    language == $language &&
    slug.current == $slug
  ][0]._id)`
  return client.fetch<boolean>(query, params)
}

/**
 * References should only offer documents in the same language as the document being edited.
 * Use as `options: sameLanguage` on a reference field.
 */
export const sameLanguage: ReferenceOptions = {
  filter: ({document}) => ({
    filter: 'language == $language',
    params: {language: (document as {language?: string} | undefined)?.language ?? 'en'},
  }),
}
