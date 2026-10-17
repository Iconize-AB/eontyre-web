import {buttonFields, imageFields} from '../../sanity/fragments'

export const heroBlockFields = /* groq */ `
  _type == "heroBlock" => {
    eyebrow,
    heading,
    body,
    image{${imageFields}},
    action,
    buttons[]{_key, ${buttonFields}},
    plateSearch{placeholder, buttonLabel, targetUrl},
    height,
    theme
  }
`
