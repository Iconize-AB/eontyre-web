import {blockSettings, richTextFields} from '../../sanity/fragments'

/** "documentItems" is the FAQ of the add-on or integration the block sits on (`^` is that document). */
export const faqBlockFields = /* groq */ `
  _type == "faqBlock" => {
    heading,
    source,
    openFirst,
    items[]{_key, question, answer[]{${richTextFields}}},
    "documentItems": ^.faq[]{_key, question, answer[]{${richTextFields}}},
    ${blockSettings}
  }
`
