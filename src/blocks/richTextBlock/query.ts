import {blockSettings, richTextFields} from '../../sanity/fragments'

export const richTextBlockFields = /* groq */ `
  _type == "richTextBlock" => {
    heading,
    body[]{${richTextFields}},
    layout,
    ${blockSettings}
  }
`
