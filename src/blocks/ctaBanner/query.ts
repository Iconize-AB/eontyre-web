import {buttonFields, imageFields} from '../../sanity/fragments'

export const ctaBannerBlockFields = /* groq */ `
  _type == "ctaBannerBlock" => {
    heading,
    body,
    button{${buttonFields}},
    image{${imageFields}},
    overlayOpacity,
    theme
  }
`
