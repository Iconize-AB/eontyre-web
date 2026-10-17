/**
 * Draft content for the pages linked from the header and footer. Built only
 * from facts in docs/brief-home.md and the current eontyre.com; Eontyre should
 * review the copy before go-live.
 */
import {
  button,
  ctaBanner,
  featureRows,
  hero,
  image,
  logoGrid,
  page,
  stats,
  type Images,
} from './seed-helpers'

export function buildPages(img: Images) {
  const trial = button('Try free for 30 days', '/start')
  const demo = button('Book a demo', '/start', 'outline')

  const getStarted = ctaBanner({
    heading: 'We help you get started',
    body: 'We book a meeting, go through your workflow and set up Eontyre with you. Phone support, upgrades and backups are included.',
    button: trial,
    image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
  })

  return [
    page(
      'business-system',
      'Business system',
      'Sales, off-season tyre storage, booking, stock and customer registers for tyre workshops, in the browser.',
      [
        hero({
          eyebrow: 'Business system',
          heading: 'Run the whole workshop',
          body: 'Sales, off-season tyre storage, booking, stock and customer registers for tyre workshops. All you need is a browser.',
          image: image(img.warehouse, 'Racks of stored tyres'),
          buttons: [trial, demo],
        }),
        featureRows(
          [
            {
              title: 'Search and ordering',
              body: 'Find tyres in your own stock, from suppliers across Europe or from other Eontyre workshops, in every price range.',
              image: image(img.counter, 'Customer paying at a tyre shop counter'),
            },
            {
              title: 'Off-season tyre storage',
              body: 'Booking, wheel change, tread depth measurement, labels and storage locations, handled in one flow.',
              image: image(img.warehouse, 'Racks of stored tyres'),
            },
            {
              title: 'Booking calendar',
              body: "See today's, tomorrow's or any period's work, with the related order and stored set. Open 24/7 in the browser.",
              image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
            },
            {
              title: 'Stock and logistics',
              body: 'Eontyre tracks your stock and gets stored sets to the right place at the right time, whether you use racks, containers or stacks on the floor.',
              image: image(img.truck, 'Truck tyres at night'),
            },
          ],
          {imagePosition: 'alternate'},
        ),
        getStarted,
      ],
    ),

    page(
      'webshop',
      'Webshop',
      'A tyre webshop with registration number search, live stock, fitting bookings and online payment.',
      [
        hero({
          eyebrow: 'Webshop',
          heading: 'Sell tyres online',
          body: 'Registration number search, live stock, fitting bookings and online payment, connected to your business system.',
          image: image(img.counter, 'Customer paying at a tyre shop counter'),
          buttons: [trial, demo],
        }),
        featureRows(
          [
            {
              title: 'Registration number search',
              body: 'Customers enter their plate and see tyres that fit their car.',
              image: image(img.hero, 'Car on a gravel road through a pine forest at sunset'),
            },
            {
              title: 'Live stock',
              body: 'The webshop shows what you have in stock and what your suppliers can deliver, straight from Eontyre.',
              image: image(img.warehouse, 'Racks of stored tyres'),
            },
            {
              title: 'Fitting bookings and payment',
              body: 'Customers book a time for fitting and pay online when they order.',
              image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
            },
          ],
          {imagePosition: 'alternate'},
        ),
        getStarted,
      ],
    ),

    page(
      'api',
      'API and integrations',
      'A REST API and ready-made integrations that connect Eontyre to the rest of your business.',
      [
        hero({
          eyebrow: 'API and integrations',
          heading: 'Build on Eontyre',
          body: 'Fortnox, Unit4, point of sale, Vecheck, suppliers and a REST API for everything else.',
          image: image(img.truck, 'Truck tyres at night'),
          buttons: [button('Talk to us', '/start'), button('All integrations', '/integrations', 'outline')],
        }),
        featureRows([
          {
            title: 'REST API',
            body: 'Connect your own systems to Eontyre and build what the standard integrations do not cover.',
            image: image(img.truck, 'Truck tyres at night'),
          },
          {
            title: 'Ready-made integrations',
            body: 'Accounting, payments, check-in, inspections and storage, connected without custom development.',
            image: image(img.counter, 'Customer paying at a tyre shop counter'),
            link: '/integrations',
          },
        ]),
        logoGrid({
          heading: 'Connected to the rest of your business',
          body: 'Accounting, payments, check-in, inspections and storage work together with Eontyre.',
          button: button('All integrations', '/integrations', 'outline'),
          spacingTop: 'none',
        }),
        getStarted,
      ],
    ),

    page(
      'integrations',
      'Integrations',
      'Integrations and add-ons for Eontyre: accounting, payments, check-in, inspections and storage.',
      [
        hero({
          eyebrow: 'Integrations and add-ons',
          heading: 'Works with your tools',
          body: 'Accounting, payments, check-in, inspections and storage work together with Eontyre.',
          image: image(img.counter, 'Customer paying at a tyre shop counter'),
        }),
        logoGrid({
          heading: 'Available integrations',
          body: 'Missing something? Use the REST API, or tell us what you need.',
          button: button('About the API', '/api', 'outline'),
        }),
        getStarted,
      ],
    ),

    page(
      'who-its-for',
      "Who it's for",
      'Eontyre is built for tyre workshops, tyre hotels and tyre sellers.',
      [
        hero({
          eyebrow: "Who it's for",
          heading: 'Made for the tyre industry',
          body: 'For tyre workshops, tyre hotels and everyone who sells tyres, in the shop or online.',
          image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
        }),
        featureRows(
          [
            {
              title: 'Tyre workshops',
              body: 'Sales, booking, stock and customer registers in one system.',
              image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
              link: '/business-system',
            },
            {
              title: 'Tyre hotels',
              body: 'Off-season storage from booking and wheel change to labels and pick-up.',
              image: image(img.warehouse, 'Racks of stored tyres'),
              link: '/business-system',
            },
            {
              title: 'Online tyre sellers',
              body: 'A webshop with registration number search, live stock and online payment.',
              image: image(img.counter, 'Customer paying at a tyre shop counter'),
              link: '/webshop',
            },
            {
              title: 'Developers and partners',
              body: 'A REST API and integrations to build on.',
              image: image(img.truck, 'Truck tyres at night'),
              link: '/api',
            },
          ],
          {imagePosition: 'alternate'},
        ),
        getStarted,
      ],
    ),

    page('about', 'About Eontyre', 'Eontyre is the business system, webshop and API for the tyre industry.', [
      hero({
        eyebrow: 'About Eontyre',
        heading: 'Software for tyres',
        body: 'Eontyre is a web-based business system, webshop and API for the tyre industry, sold through resellers in Sweden and Norway.',
        image: image(img.hero, 'Car on a gravel road through a pine forest at sunset'),
      }),
      stats([
        ['2.4M', 'tyres sold'],
        ['38M', 'API calls a year'],
        ['140,000', 'sets in tyre hotels'],
      ]),
      getStarted,
    ]),

    page('support', 'Support', 'Phone support, continuous upgrades and backups are included with Eontyre.', [
      hero({
        eyebrow: 'Support',
        heading: "We're here to help",
        body: 'Phone support, continuous upgrades and backups are included. Sweden: +46 (0)20 - 12 10 34. Norway: +47 67 22 88 99.',
        image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
        buttons: [button('Call Sweden', 'tel:+4620121034'), button('Call Norway', 'tel:+4767228899', 'outline')],
      }),
      featureRows(
        [
          {
            title: 'Phone support',
            body: 'Call our resellers in Sweden or Norway when you need help.',
            image: image(img.counter, 'Customer paying at a tyre shop counter'),
          },
          {
            title: 'Continuous upgrades',
            body: 'Eontyre runs in the browser, so you always have the latest version.',
            image: image(img.truck, 'Truck tyres at night'),
          },
          {
            title: 'Always backed up',
            body: 'Your data is backed up, with no extra work for you.',
            image: image(img.warehouse, 'Racks of stored tyres'),
          },
        ],
        {imagePosition: 'alternate'},
      ),
    ]),

    page('start', 'Get started', 'Try Eontyre free for 30 days. We book a meeting and set it up with you.', [
      hero({
        eyebrow: 'Free for 30 days',
        heading: 'Try Eontyre',
        body: 'Call one of our resellers and we will set up your trial, book a meeting and go through your workflow with you.',
        image: image(img.hero, 'Car on a gravel road through a pine forest at sunset'),
        buttons: [button('Call Sweden', 'tel:+4620121034'), button('Call Norway', 'tel:+4767228899', 'outline')],
      }),
      featureRows(
        [
          {
            title: 'We book a meeting',
            body: 'We go through how you work today: sales, storage, booking and stock.',
            image: image(img.counter, 'Customer paying at a tyre shop counter'),
          },
          {
            title: 'We set it up with you',
            body: 'Eontyre is configured for your workshop, and we help you get started.',
            image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
          },
          {
            title: 'Free for 30 days',
            body: 'Use Eontyre in your daily work before you decide.',
            image: image(img.warehouse, 'Racks of stored tyres'),
          },
        ],
        {heading: 'How it works', imagePosition: 'alternate'},
      ),
    ]),
  ]
}
