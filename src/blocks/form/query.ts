import {blockSettings, imageFields, richTextFields} from '../../sanity/fragments'

export const formBlockFields = /* groq */ `
  _type == "formBlock" => {
    formType,
    heading,
    body[]{${richTextFields}},
    submitLabel,
    finePrint[]{${richTextFields}},
    successHeading,
    successBody,
    errorText,
    image{${imageFields}},
    layout,
    headingLevel,
    ${blockSettings}
  }
`
