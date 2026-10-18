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
    source,
    layout,
    "related": ^.relatedItems[]->{
      _id,
      name,
      shortDescription,
      "href": select(
        defined(linkOverride.linkType) => linkOverride{${linkFields}}.href,
        hasDetailPage == true => string($prefix) + "/integrations/" + slug.current,
        string($prefix) + "/integrations?category=" + category->slug.current
      )
    },
    ${blockSettings}
  }
`
