/**
 * Shared GROQ projections. Block queries and page queries compose these so
 * links, images and buttons resolve the same way everywhere.
 */

/** Resolves a `link` object to `href`. Internal links to the home page become "/". */
export const linkFields = /* groq */ `
  openInNewTab,
  "href": select(
    linkType == "internal" => select(
      page._ref == *[_id == "siteSettings"][0].homePage._ref => "/",
      "/" + page->slug.current
    ),
    url
  )
`

export const imageFields = /* groq */ `
  alt,
  hotspot,
  crop,
  asset->{_id, metadata{lqip, dimensions{width, height}}}
`

export const buttonFields = /* groq */ `
  label,
  variant,
  link{${linkFields}}
`

export const navItemFields = /* groq */ `
  label,
  link{${linkFields}}
`
