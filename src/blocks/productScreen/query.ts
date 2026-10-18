import {blockSettings, richTextFields} from '../../sanity/fragments'

export const productScreenBlockFields = /* groq */ `
  _type == "productScreenBlock" => {
    heading,
    body[]{${richTextFields}},
    note,
    screen,
    layout,
    ${blockSettings}
  }
`
