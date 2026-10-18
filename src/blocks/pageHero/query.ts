import {buttonFields, imageFields, richTextFields} from '../../sanity/fragments'

export const pageHeroBlockFields = /* groq */ `
  _type == "pageHeroBlock" => {
    eyebrow,
    heading,
    body[]{${richTextFields}},
    buttons[]{_key, ${buttonFields}},
    contactLines[]{_key, label, href},
    media,
    image{${imageFields}},
    codeMethod,
    codePath,
    code,
    theme,
    anchorId
  }
`
