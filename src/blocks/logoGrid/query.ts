import {buttonFields, imageFields} from '../../sanity/fragments'

export const logoGridBlockFields = /* groq */ `
  _type == "logoGridBlock" => {
    heading,
    body,
    button{${buttonFields}},
    items[]->{_id, name, logo{${imageFields}}},
    theme,
    spacing
  }
`
