import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/** Connects documents in the Studio with the URLs that show them, for the Presentation tool. */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {route: '/', filter: `_id == *[_id == "siteSettings"][0].homePage._ref`},
    {route: '/integrations/:slug', filter: `_type == "integration" && slug.current == $slug`},
    {route: '/news/:slug', filter: `_type == "post" && slug.current == $slug`},
    {route: '/:slug+', filter: `_type == "page" && slug.current == $slug`},
  ]),
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [{title: doc?.title || 'Untitled', href: `/${doc?.slug ?? ''}`}],
      }),
    }),
    integration: defineLocations({
      select: {title: 'name', slug: 'slug.current', hasDetailPage: 'hasDetailPage'},
      resolve: (doc) => ({
        locations: [
          ...(doc?.hasDetailPage ? [{title: doc.title || 'Untitled', href: `/integrations/${doc.slug}`}] : []),
          {title: 'Integrations', href: '/integrations'},
        ],
      }),
    }),
    post: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled', href: `/news/${doc?.slug ?? ''}`},
          {title: 'News', href: '/news'},
        ],
      }),
    }),
    siteSettings: defineLocations({
      message: 'Used on every page (header and footer)',
      locations: [{title: 'Home', href: '/'}],
    }),
  },
}
