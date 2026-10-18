import {blockSettings, buttonFields, linkFields, richTextFields} from '../../sanity/fragments'

export const linkListBlockFields = /* groq */ `
  _type == "linkListBlock" => {
    heading,
    body[]{${richTextFields}},
    button{${buttonFields}},
    items[]{_key, label, meta, link{${linkFields}}},
    ${blockSettings}
  }
`
