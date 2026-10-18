/**
 * Shared GROQ projections. Block queries and page queries compose these so
 * links, images and buttons resolve the same way everywhere.
 */

/**
 * Resolves a `link` object to `href`. Internal links to the home page become "/",
 * integrations and posts get their template paths, and an optional anchor is appended.
 */
export const linkFields = /* groq */ `
  openInNewTab,
  "href": select(
    linkType == "internal" => select(
      page._ref == *[_id == "siteSettings"][0].homePage._ref => "/",
      page->_type == "integration" => "/integrations/" + page->slug.current,
      page->_type == "post" => "/news/" + page->slug.current,
      "/" + page->slug.current
    ) + select(defined(anchor) && anchor != "" => "#" + anchor, ""),
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

/** Portable Text with link annotations resolved to `href`. */
export const richTextFields = /* groq */ `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {${linkFields}}
  }
`

/** The style settings every block has (see blockSettingsFields). */
export const blockSettings = /* groq */ `
  theme,
  background,
  anchorId,
  paddingTop
`
