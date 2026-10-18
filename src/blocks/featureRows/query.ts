import {blockSettings, imageFields, linkFields} from '../../sanity/fragments'

export const featureRowsBlockFields = /* groq */ `
  _type == "featureRowsBlock" => {
    heading,
    rows[]{_key, title, body, image{${imageFields}}, link{${linkFields}}, linkLabel},
    style,
    imagePosition,
    ${blockSettings}
  }
`
