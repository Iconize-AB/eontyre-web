import {blockSettings, imageFields, linkFields} from '../../sanity/fragments'

/** One integration card. "href" is where "Read more" goes, or null when there's nowhere to go. */
export const integrationCardFields = /* groq */ `
  _id,
  name,
  shortName,
  category,
  shortDescription,
  status,
  logo{${imageFields}},
  "href": select(
    defined(linkOverride.linkType) => linkOverride{${linkFields}}.href,
    hasDetailPage == true => "/integrations/" + slug.current,
    null
  )
`

export const integrationDirectoryBlockFields = /* groq */ `
  _type == "integrationDirectoryBlock" => {
    heading,
    showFilter,
    filterCategories,
    labels,
    "integrations": select(
      count(items) > 0 => items[]->{${integrationCardFields}},
      *[_type == "integration" && defined(slug.current)] | order(orderRank) {${integrationCardFields}}
    ),
    ${blockSettings}
  }
`
