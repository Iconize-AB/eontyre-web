import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/** Connects documents in the Studio with the URLs that show them, for the Presentation tool. */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {route: '/', filter: `_id == *[_id == "siteSettings"][0].homePage._ref`},
    {route: '/:slug+', filter: `_type == "page" && slug.current == $slug`},
  ]),
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [{title: doc?.title || 'Untitled', href: `/${doc?.slug ?? ''}`}],
      }),
    }),
    siteSettings: defineLocations({
      message: 'Used on every page (header and footer)',
      locations: [{title: 'Home', href: '/'}],
    }),
  },
}
