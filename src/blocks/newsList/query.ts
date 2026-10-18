import {blockSettings, imageFields} from '../../sanity/fragments'

export const postCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  category,
  excerpt,
  featured,
  mainImage{${imageFields}}
`

export const newsListBlockFields = /* groq */ `
  _type == "newsListBlock" => {
    heading,
    showFeatured,
    showFilter,
    pageSize,
    labels,
    "posts": *[_type == "post" && language == $language && defined(slug.current)] | order(publishedAt desc) {${postCardFields}},
    ${blockSettings}
  }
`
