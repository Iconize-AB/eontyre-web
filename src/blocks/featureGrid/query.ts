import {blockSettings, imageFields, linkFields, navItemFields, richTextFields} from '../../sanity/fragments'

export const featureGridBlockFields = /* groq */ `
  _type == "featureGridBlock" => {
    heading,
    body[]{${richTextFields}},
    headerLink{${navItemFields}},
    items[]{
      _key,
      title,
      body[]{${richTextFields}},
      image{${imageFields}},
      link{${linkFields}}
    },
    variant,
    ${blockSettings}
  }
`
