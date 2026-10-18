import {blockSettings, imageFields, navItemFields, richTextFields} from '../../sanity/fragments'

export const textMediaBlockFields = /* groq */ `
  _type == "textMediaBlock" => {
    eyebrow,
    heading,
    body[]{${richTextFields}},
    list,
    listStyle,
    link{${navItemFields}},
    image{${imageFields}},
    imagePosition,
    ${blockSettings}
  }
`
