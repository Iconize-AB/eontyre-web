import {blockSettings} from '../../sanity/fragments'

export const anchorNavBlockFields = /* groq */ `
  _type == "anchorNavBlock" => {
    items[]{_key, label, anchorId},
    ${blockSettings}
  }
`
