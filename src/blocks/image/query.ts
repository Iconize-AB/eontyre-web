import {blockSettings, imageFields} from '../../sanity/fragments'

export const imageBlockFields = /* groq */ `
  _type == "imageBlock" => {
    image{${imageFields}},
    aspect,
    ${blockSettings}
  }
`
