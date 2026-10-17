/**
 * Seeds the home page (copy from docs/brief-home.md), the other site pages
 * (scripts/seed-pages.ts), Site settings and integrations. Safe to re-run:
 * documents use fixed IDs and are replaced, so edits made in the Studio to
 * these documents are overwritten.
 *
 *   npm run seed
 *
 * Needs SANITY_API_WRITE_TOKEN (an Editor token) in .env.local.
 */
import {createClient} from 'next-sanity'

import {
  button,
  ctaBanner,
  featureRows,
  image,
  integrations,
  key,
  link,
  logoGrid,
  navItem,
  page,
  stats,
  type Images,
} from './seed-helpers'
import {buildPages} from './seed-pages'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN in .env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-10-01',
  token,
  useCdn: false,
})

/** The images were uploaded once from the brief; reuse them from the Sanity media library. */
async function findAsset(filename: string) {
  const id = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    {filename},
  )
  if (!id) throw new Error(`Image "${filename}" is not in Sanity. Upload it in the Studio first.`)
  return id
}

function homePage(img: Images) {
  return {
    ...page(
      'home',
      'Home',
      'The business system, webshop and API for the tyre industry. Sales, tyre storage, booking and stock in one place, in the browser.',
      [
        {
          _key: key(),
          _type: 'heroBlock',
          eyebrow: 'Welcome to a',
          heading: 'World of Tyres',
          body: 'The business system, webshop and API for the tyre industry. Sales, tyre storage, booking and stock in one place, in the browser.',
          image: image(img.hero, 'Car on a gravel road through a pine forest at sunset'),
          height: 'tall',
          action: 'plateSearch',
          plateSearch: {placeholder: 'ABC 123', buttonLabel: 'Find tyres', targetUrl: '/webshop'},
          theme: 'dark',
        },
        stats([
          ['2.4M', 'tyres sold'],
          ['38M', 'API calls a year'],
          ['140,000', 'sets in tyre hotels'],
        ]),
        featureRows([
          {
            title: 'Business system',
            body: 'Sales, off-season tyre storage, booking, stock and customer registers for tyre workshops.',
            image: image(img.warehouse, 'Racks of stored tyres'),
            link: '/business-system',
          },
          {
            title: 'Webshop',
            body: 'Registration number search, live stock, fitting bookings and online payment.',
            image: image(img.counter, 'Customer paying at a tyre shop counter'),
            link: '/webshop',
          },
          {
            title: 'API and integrations',
            body: 'Fortnox, Unit4, point of sale, Vecheck, suppliers and a REST API for everything else.',
            image: image(img.truck, 'Truck tyres at night'),
            link: '/api',
          },
        ]),
        logoGrid({
          heading: 'Connected to the rest of your business',
          body: 'Accounting, payments, check-in, inspections and storage work together with Eontyre.',
          button: button('All integrations', '/integrations', 'outline'),
          spacingTop: 'none',
        }),
        ctaBanner({
          heading: 'We help you get started',
          body: 'We book a meeting, go through your workflow and set up Eontyre with you. Phone support, upgrades and backups are included.',
          button: button('Try free for 30 days', '/start'),
          image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
        }),
      ],
    ),
    seo: {
      _type: 'seo',
      title: 'Eontyre — Business system, webshop and API for the tyre industry',
      description:
        'The business system, webshop and API for the tyre industry. Sales, tyre storage, booking and stock in one place, in the browser.',
      noIndex: false,
    },
  }
}

function siteSettings(logoWhite: string, logoBlack: string) {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'Eontyre',
    homePage: {_type: 'reference', _ref: 'page-home'},
    logo: image(logoWhite, 'Eontyre'),
    logoOnLight: image(logoBlack, 'Eontyre'),
    navItems: [
      navItem('Business system', '/business-system'),
      navItem('Webshop', '/webshop'),
      navItem('API', '/api'),
      navItem('Integrations', '/integrations'),
      navItem("Who it's for", '/who-its-for'),
    ],
    primaryCta: {_type: 'navItem', label: 'Try free for 30 days', link: link('/start')},
    tagline: 'Business system, webshop and API for the tyre industry.',
    footerColumns: [
      {
        _key: key(),
        _type: 'footerColumn',
        title: 'Product',
        links: [
          navItem('Business system', '/business-system'),
          navItem('Webshop', '/webshop'),
          navItem('API and integrations', '/api'),
          navItem('Integrations and add-ons', '/integrations'),
          navItem("Who it's for", '/who-its-for'),
          navItem('About Eontyre', '/about'),
          navItem('Support', '/support'),
        ],
      },
      {
        _key: key(),
        _type: 'footerColumn',
        title: 'Get started',
        links: [
          navItem('Free 30-day trial', '/start'),
          navItem('Book a demo', '/start'),
          navItem('News', '/news'),
        ],
      },
    ],
    contact: {
      title: 'Contact our resellers',
      lines: ['Sweden: +46 (0)20 - 12 10 34', 'Norway: +47 67 22 88 99'],
      link: {_type: 'navItem', label: 'E-mail us', link: link('/start')},
    },
    legal: {
      copyright: '© {year} Eontyre',
      link: {
        _type: 'navItem',
        label: 'Terms and conditions',
        link: link('https://eontyre.com/assets/docs/General_Terms_EONTYRE_20241201.pdf'),
      },
    },
  }
}

async function seed() {
  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}`)

  const [logoWhite, logoBlack, hero, warehouse, counter, truck, repair] = await Promise.all([
    findAsset('eontyre-logo-white.png'),
    findAsset('eontyre-logo-black.png'),
    findAsset('hero-forest-road.jpg'),
    findAsset('px-tyre-warehouse.jpg'),
    findAsset('counter-payment.jpg'),
    findAsset('truck-night.jpg'),
    findAsset('px-kneeling-repair.jpg'),
  ])
  const img: Images = {hero, warehouse, counter, truck, repair}

  const tx = client.transaction()

  for (const integration of integrations) {
    tx.createOrReplace({
      _id: `integration-${integration.id}`,
      _type: 'integration',
      name: integration.name,
      slug: {_type: 'slug', current: integration.id},
      category: integration.category,
      status: 'available',
    })
  }

  // Pages first: links in Site settings and on other pages reference them.
  const pages = [homePage(img), ...buildPages(img)]
  for (const doc of pages) tx.createOrReplace(doc)
  tx.createOrReplace(siteSettings(logoWhite, logoBlack))

  await tx.commit()
  console.log(`Done: ${pages.length} pages, Site settings and ${integrations.length} integrations published.`)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
