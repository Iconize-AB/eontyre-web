import {blockSettings, imageFields, linkFields} from '../../sanity/fragments'

/** One integration card. "href" is where "Read more" goes, or null when there's nowhere to go. */
export const integrationCardFields = /* groq */ `
  _id,
  name,
  shortName,
  "category": category->slug.current,
  "categoryTitle": category->title,
  "accentTile": category->accentTile,
  shortDescription,
  status,
  logo{${imageFields}},
  "href": select(
    defined(linkOverride.linkType) => linkOverride{${linkFields}}.href,
    hasDetailPage == true => string($prefix) + "/integrations/" + slug.current,
    null
  )
`

export const integrationDirectoryBlockFields = /* groq */ `
  _type == "integrationDirectoryBlock" => {
    heading,
    showFilter,
    "filterCategories": filterCategories[]->slug.current,
    labels,
    "categories": *[_type == "integrationCategory" && language == $language && defined(slug.current)] | order(orderRank) {
      _id,
      "value": slug.current,
      title
    },
    "integrations": select(
      count(items) > 0 => items[]->{${integrationCardFields}},
      *[_type == "integration" && language == $language && defined(slug.current)] | order(orderRank) {${integrationCardFields}}
    ),
    ${blockSettings}
  }
`
