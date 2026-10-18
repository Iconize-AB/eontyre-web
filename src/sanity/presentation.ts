import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/**
 * Connects documents in the Studio with the URLs that show them, for the Presentation tool.
 * Previews always use the language prefix (/sv/webshop), which every host serves.
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/:locale',
      filter: `_id == *[_type == "siteSettings" && language == $locale][0].homePage._ref`,
    },
    {
      route: '/:locale/integrations/:slug',
      filter: `_type == "integration" && language == $locale && slug.current == $slug`,
    },
    {route: '/:locale/news/:slug', filter: `_type == "post" && language == $locale && slug.current == $slug`},
    {route: '/:locale/:slug+', filter: `_type == "page" && language == $locale && slug.current == $slug`},
  ]),
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current', language: 'language'},
      resolve: (doc) => ({
        locations: [{title: doc?.title || 'Untitled', href: `/${doc?.language ?? 'en'}/${doc?.slug ?? ''}`}],
      }),
    }),
    integration: defineLocations({
      select: {title: 'name', slug: 'slug.current', language: 'language', hasDetailPage: 'hasDetailPage'},
      resolve: (doc) => ({
        locations: [
          ...(doc?.hasDetailPage
            ? [{title: doc.title || 'Untitled', href: `/${doc.language ?? 'en'}/integrations/${doc.slug}`}]
            : []),
          {title: 'Integrations', href: `/${doc?.language ?? 'en'}/integrations`},
        ],
      }),
    }),
    post: defineLocations({
      select: {title: 'title', slug: 'slug.current', language: 'language'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled', href: `/${doc?.language ?? 'en'}/news/${doc?.slug ?? ''}`},
          {title: 'News', href: `/${doc?.language ?? 'en'}/news`},
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: {language: 'language'},
      resolve: (doc) => ({
        message: 'Used on every page (header and footer)',
        locations: [{title: 'Home', href: `/${doc?.language ?? 'en'}`}],
      }),
    }),
  },
}
