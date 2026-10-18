import {buttonFields, imageFields} from '../../sanity/fragments'

export const ctaBannerBlockFields = /* groq */ `
  _type == "ctaBannerBlock" => {
    heading,
    body,
    "buttons": select(
      count(buttons) > 0 => buttons[]{_key, ${buttonFields}},
      defined(button) => [button{"_key": "legacy", ${buttonFields}}],
      []
    ),
    image{${imageFields}},
    style,
    overlayOpacity,
    theme,
    anchorId
  }
`
