/**
 * Content for every page, copied verbatim from the design reference
 * (docs/brief-2.md, reference/site/*.dc.html). The "Log in" links to the
 * Eontyre app in the reference are left out on purpose.
 */
import {
  anchorNav,
  button,
  ctaBanner,
  featureGrid,
  featureRows,
  form,
  image,
  imageBlock,
  integrationDirectory,
  key,
  linkList,
  logoGrid,
  navItem,
  newsList,
  page,
  pageHero,
  productScreen,
  pt,
  richTextBlock,
  stats,
  textMedia,
  type Images,
} from './seed-helpers'

const TERMS = 'https://eontyre.com/assets/docs/General_Terms_EONTYRE_20241201.pdf'
const HELP_CENTRE = 'https://eontyre.freshdesk.com'

export function buildPages(img: Images) {
  const accentTrial = ctaBanner({
    heading: 'Try Eontyre free for 30 days',
    buttons: [button('Start your trial', '/start')],
    style: 'accent',
  })

  return [
    page(
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
          items: ['fortnox', 'unit4', 'integrated-point-of-sale', 'check-in', 'vecheck', 'tread-scanning'],
          paddingTop: 'none',
        }),
        ctaBanner({
          heading: 'We help you get started',
          body: 'We book a meeting, go through your workflow and set up Eontyre with you. Phone support, upgrades and backups are included.',
          buttons: [button('Try free for 30 days', '/start')],
          style: 'photo',
          image: image(img.repair, 'Mechanic tightening wheel bolts', {x: 0.5, y: 0.3}),
        }),
      ],
    ),

    page(
      'business-system',
      'Business system',
      'Eontyre simplifies handling and administration when working with tyres and wheels. Manage sales, off-season storage, booking and stock from any browser.',
      [
        pageHero({
          eyebrow: 'Business system',
          heading: 'An easy and smart business system for the tyre industry',
          body: pt(
            'Eontyre simplifies handling and administration when working with tyres and wheels. Manage sales, off-season storage, booking and stock from any browser.',
          ),
          buttons: [button('Try free for 30 days', '/start')],
          media: 'image',
          image: image(img.repair, 'Mechanic tightening wheel bolts with an impact wrench', {x: 0.5, y: 0.3}),
        }),
        anchorNav([
          ['Search and ordering', 'search'],
          ['Off-season tyre storage', 'storage'],
          ['Booking calendar', 'booking'],
          ['Stock and logistics', 'stock'],
          ['Customer, car and driver registers', 'registers'],
        ]),
        productScreen(
          {
            heading: 'Search and ordering',
            body: pt(
              'Find what you are looking for quickly. Choose products from your own stock, external suppliers or other Eontyre partners.',
              'That gives you a broad range of tyres in every price range, and the order goes straight to the supplier.',
            ),
            screen: 'orderSummary',
            layout: 'split',
          },
          {anchorId: 'search'},
        ),
        textMedia(
          {
            heading: 'Off-season tyre storage',
            body: pt(
              'Eontyre simplifies your tyre hotel. The system handles everything from booking and wheel change to tread depth measurement, labels and stock management.',
            ),
            image: image(img.warehouse, 'Racks of stored tyres in a tyre hotel'),
            imagePosition: 'left',
            list: [
              'Check in the set with tread depth for each tyre',
              'Print labels and assign a shelf',
              "Pick the set before the customer's booking",
              'Offer new tyres when the tread is low',
            ],
            listStyle: 'numbered',
          },
          {background: 'surface', anchorId: 'storage'},
        ),
        productScreen(
          {
            heading: 'Booking calendar',
            body: pt(
              'See the work for today, tomorrow or any period you choose, with the related order and stored tyres. Because Eontyre is web based, the calendar is available around the clock.',
            ),
            screen: 'bookingCalendar',
            layout: 'stacked',
          },
          {anchorId: 'booking'},
        ),
        textMedia(
          {
            heading: 'Stock and logistics',
            body: pt(
              'Eontyre keeps track of your stock and makes sure stored tyres are picked up and transported to the right place at the right time.',
              'It handles every kind of storage system, whether SSI Schäfer racks, containers or stacks of tyres on the floor.',
            ),
            image: image(img.stackAlloy, 'Stack of tyres with an alloy wheel on top'),
            imagePosition: 'right',
          },
          {background: 'surface', anchorId: 'stock'},
        ),
        featureGrid(
          {
            heading: 'Also included',
            variant: 'topRule',
            items: [
              {
                title: 'Customer, car and driver registers',
                body: pt('Private and business customers with their cars, drivers and history.'),
              },
              {title: 'Phone support', body: pt('Call us when you need help. Support is part of the subscription.')},
              {
                title: 'Backup and upgrades',
                body: pt('Your data is always backed up and new features arrive without installation.'),
              },
              {title: 'Only a browser', body: pt('Log in from the workshop floor, the office or at home.')},
            ],
          },
          {anchorId: 'registers'},
        ),
        accentTrial,
      ],
    ),

    page(
      'webshop',
      'Webshop',
      'Your webshop runs on the same data as your workshop. Customers search by registration number, see what fits and what it costs, then book the fitting and pay online.',
      [
        pageHero({
          eyebrow: 'Webshop and e-commerce',
          heading: 'From registration number to fitted tyres',
          body: pt(
            'Your webshop runs on the same data as your workshop. Customers search by registration number, see what fits and what it costs, then book the fitting and pay online.',
          ),
          media: 'imageTop',
          image: image(img.carDust, 'Estate car on a gravel road at sunset'),
        }),
        productScreen({
          heading: 'Try the plate search',
          body: pt(
            'This is what your customers see. The result combines your own stock, supplier stock and partner garages, with your prices and delivery times.',
          ),
          note: 'Demo data. Try ABC 123, XYZ 789 or KLM 456.',
          screen: 'plateSearchDemo',
          layout: 'split',
        }),
        featureGrid(
          {
            heading: 'The whole purchase is connected',
            body: pt(
              'Every step uses the same data, so a paid order becomes a booked work order without anyone typing it in again.',
            ),
            variant: 'steps',
            items: [
              'Registration number search',
              'Tyre and wheel matching',
              'Own stock',
              'Supplier stock',
              'Pricing and campaigns',
              'Fitting booking',
              'Payment',
              'Work order in the workshop',
            ].map((title) => ({title})),
          },
          {background: 'surface'},
        ),
        textMedia({
          heading: 'Your shop, your brand',
          body: pt(
            'The webshop carries your name, colours and prices. Run it as a standalone site or add plate search and booking to the website you already have.',
          ),
          image: image(img.counter, 'Customer paying at a tyre shop counter'),
          imagePosition: 'left',
          list: [
            'Your own domain and design',
            'Campaigns per brand, season or customer group',
            'Card, invoice and Swish payments',
            'Booking linked to your lifts and staff',
          ],
          listStyle: 'plain',
        }),
        ctaBanner({
          heading: 'See the webshop with your own stock',
          buttons: [button('Book a demo', '/start')],
          style: 'accent',
        }),
      ],
    ),

    page(
      'api',
      'API and integrations',
      'Products, prices, stock, bookings, tyre storage and customers are available over a REST API with webhooks.',
      [
        pageHero({
          eyebrow: 'API and integrations',
          heading: 'Connect Eontyre to everything else you run',
          body: pt(
            'Products, prices, stock, bookings, tyre storage and customers are available over a REST API with webhooks. Build your own apps, connect your ERP or let partners sell from your stock.',
          ),
          // "Read the documentation" from the design is left out until there is a documentation URL.
          buttons: [button('Request an API key', '/start')],
          media: 'code',
          code: {
            method: 'GET',
            path: '/v1/tyres?plate=ABC123',
            code: `{
  "vehicle": {
    "model": "Volvo V60 B4",
    "size": "215/55 R17 98W"
  },
  "results": [
    {
      "brand": "Michelin",
      "model": "Primacy 4+",
      "source": "own_stock",
      "qty": 12,
      "price": 1245
    }
  ]
}`,
          },
        }),
        linkList({
          heading: 'What the API covers',
          body: pt('The same data the business system and webshop use. Webhooks tell your systems when something changes.'),
          items: [
            {label: 'Products and prices', meta: '/v1/tyres'},
            {label: 'Stock, own and supplier', meta: '/v1/stock'},
            {label: 'Orders and payments', meta: '/v1/orders'},
            {label: 'Bookings', meta: '/v1/bookings'},
            {label: 'Tyre storage', meta: '/v1/storage'},
            {label: 'Customers and vehicles', meta: '/v1/customers'},
            {label: 'Webhooks', meta: 'order.paid, booking.created'},
          ],
        }),
        featureGrid(
          {
            heading: 'Ready-made integrations',
            headerLink: navItem('See all integrations', '/integrations'),
            variant: 'topRule',
            items: [
              {title: 'Tyre suppliers', body: pt('Stock, prices and ordering from suppliers all over Europe.')},
              {title: 'Accounting and ERP', body: pt('Invoices and payments sent to your books automatically.')},
              {title: 'Payments', body: pt('Card, invoice and mobile payments in the shop and online.')},
              {title: 'Vehicle data', body: pt('Registration number lookup with dimensions and approved fitments.')},
            ],
          },
          {background: 'surface'},
        ),
        textMedia({
          heading: 'Sell through partners',
          body: pt(
            'Other Eontyre garages can order from your stock, and your stock can appear in partner webshops. The API handles availability, prices and orders between you.',
          ),
          image: image(img.truck, 'Truck tyres at night'),
          imagePosition: 'left',
        }),
        ctaBanner({
          heading: 'Start building with a sandbox account',
          buttons: [button('Request an API key', '/start')],
          style: 'accent',
        }),
      ],
    ),

    page(
      'integrations',
      'Integrations and add-ons',
      'Accounting, payments, check-in, inspections and storage. Add what your business needs, and we set it up with you.',
      [
        pageHero({
          eyebrow: 'Integrations and add-ons',
          heading: 'Connect Eontyre to the tools you work with',
          body: pt(
            'Accounting, payments, check-in, inspections and storage. Add what your business needs, and we set it up with you.',
          ),
        }),
        integrationDirectory({paddingTop: 'none'}),
        ctaBanner({
          heading: "Need something that isn't listed?",
          body: 'We build tailor-made integrations, websites and online stores on top of Eontyre. You can also build your own with the API.',
          buttons: [button('Contact us', '/about#contact'), button('Explore the API', '/api', 'outline')],
          style: 'surface',
        }),
      ],
    ),

    page('who-its-for', "Who it's for", 'From the single workshop to the largest chain.', [
      pageHero({eyebrow: "Who it's for", heading: 'From the single workshop to the largest chain'}),
      featureRows(
        [
          {
            title: 'Tyre workshops',
            body: 'Sales, tyre hotel, booking and stock in one system. We set it up with you and you can start the same week.',
            image: image(img.mechanicTyre, 'Mechanic carrying a tyre in a workshop', {x: 0.5, y: 0.35}),
            link: '/business-system',
            linkLabel: 'Business system',
          },
          {
            title: 'Chains and dealer groups',
            body: 'Shared stock, central price lists and reports across every location. Move stored sets between sites and see the whole group in one view.',
            image: image(img.wheelChange, 'Mechanic changing a wheel with an impact wrench'),
            link: '/start',
            linkLabel: 'Talk to us about your group',
          },
          {
            title: 'Retailers and e-commerce',
            body: 'A tyre webshop with registration number search, live stock, fitting bookings and online payment, all on the same data as the shop floor.',
            image: image(img.counter, 'Customer paying at a tyre shop counter'),
            link: '/webshop',
            linkLabel: 'Webshop',
          },
          {
            title: 'Suppliers and partners',
            body: 'Put your stock, prices and delivery times in front of every Eontyre workshop and receive orders directly.',
            image: image(img.warehouse, 'Tyre warehouse racks'),
            link: '/api',
            linkLabel: 'Integrations',
          },
          {
            title: 'Developers',
            body: 'A documented REST API with webhooks and a sandbox to build apps, sites and integrations against.',
            image: image(img.liftWheel, 'Technician at a wheel alignment station', {x: 0.5, y: 0.6}),
            link: '/api',
            linkLabel: 'API documentation',
          },
        ],
        {style: 'editorial', imagePosition: 'alternate', paddingTop: 'none'},
      ),
      accentTrial,
    ]),

    page('news', 'News', "What's new at Eontyre.", [
      pageHero({eyebrow: 'News', heading: "What's new at Eontyre"}),
      newsList({paddingTop: 'none'}),
      form(
        {
          formType: 'newsletter',
          heading: 'Get news by e-mail',
          body: pt('Product updates and news for the tyre business, a few times per season.'),
          submitLabel: 'Subscribe',
          successHeading: "Thanks. You're on the list.",
          layout: 'inline',
        },
        {background: 'surface'},
      ),
    ]),

    page('about', 'About Eontyre', 'Building software for the tyre business since 2005.', [
      pageHero({eyebrow: 'About Eontyre', heading: 'Building software for the tyre business since 2005'}),
      imageBlock(image(img.tyreHotel, 'Technician changing a wheel in a tyre workshop'), '21:8', {paddingTop: 'none'}),
      richTextBlock({
        heading: 'A business system for tyre workshops in Sweden and Norway',
        body: pt(
          'Eontyre is a business system for the tyre industry, sold as a subscription and used in the browser. Workshops, car dealers and tyre wholesalers use it to run sales, tyre storage, booking and stock.',
          'Alongside the system we build tailor-made services such as websites, online stores, databases and integrations. Our customers include the major tyre chains and leading motor brands.',
          'The company is based in Malmö, Sweden.',
        ),
      }),
      featureGrid(
        {
          heading: 'Contact',
          variant: 'topRule',
          items: [
            {title: 'Sales', body: pt([{text: '072-229 62 99', href: 'tel:0722296299'}])},
            {
              title: 'Technical support',
              body: pt([{text: '020-12 10 34', href: 'tel:020121034'}], [{text: 'support@eontyre.com', href: 'mailto:support@eontyre.com'}]),
            },
            {title: 'Norway', body: pt([{text: '+47 67 22 88 99', href: 'tel:+4767228899'}])},
            {title: 'Office', body: pt('Hyllie Boulevard 34\n215 32 Malmö, Sweden')},
          ],
        },
        {background: 'surface', anchorId: 'contact'},
      ),
      form(
        {
          formType: 'contact',
          heading: 'Send us a message',
          body: pt('We usually reply within one working day.'),
          submitLabel: 'Send',
          successHeading: 'Thank you. Your message has been sent.',
          layout: 'split',
        },
        {background: 'surface', paddingTop: 'none'},
      ),
    ]),

    page('support', 'Support', 'Phone support is included in every subscription. Call us, send an e-mail or look it up in the help centre.', [
      pageHero({
        eyebrow: 'Support',
        heading: 'Help when you need it',
        body: pt('Phone support is included in every subscription. Call us, send an e-mail or look it up in the help centre.'),
        contactLines: [
          {label: '020-12 10 34', href: 'tel:020121034'},
          {label: 'support@eontyre.com', href: 'mailto:support@eontyre.com'},
        ],
        media: 'image',
        image: image(img.mechanicTyre, 'Mechanic carrying a tyre in a workshop', {x: 0.5, y: 0.3}),
      }),
      linkList({
        heading: 'Help centre',
        body: pt('Step-by-step guides for setting up and using Eontyre, in Swedish, Norwegian and English.'),
        button: button('Open the help centre', HELP_CENTRE),
        items: [
          'How to set up storage position adapters',
          'Getting started with the booking calendar',
          'Checking in a set to the tyre hotel',
          'Connecting a supplier',
          'Closing a lift',
        ].map((label) => ({label, link: HELP_CENTRE})),
      }),
      featureGrid(
        {
          heading: 'New customer?',
          body: pt('We always book a meeting with new customers, go through the workflow and help you get started.'),
          variant: 'numbered',
          items: [
            {title: 'Start-up meeting', body: pt('We look at how you work today.')},
            {title: 'Set-up', body: pt('Stock, storage positions, suppliers and the calendar are configured.')},
            {title: 'Go live', body: pt('Your team starts working in Eontyre, with phone support from day one.')},
          ],
        },
        {background: 'surface'},
      ),
    ]),

    page('start', 'Try Eontyre free for 30 days', 'Create an account and we will book a meeting to go through your workflow and help you get started.', [
      form({
        formType: 'trial',
        heading: 'Try Eontyre free for 30 days',
        headingLevel: 'h1',
        body: pt('Create an account and we will book a meeting to go through your workflow and help you get started.'),
        submitLabel: 'Sign up',
        finePrint: pt(['By signing up you accept the ', {text: 'terms and conditions', href: TERMS}, '.']),
        successHeading: 'Thank you for signing up',
        successBody: 'We will contact you within one working day to book your start-up meeting.',
        layout: 'withImage',
        image: image(img.hero, 'Car on a gravel road through a forest at sunset'),
      }),
      featureGrid({
        variant: 'topRule',
        items: [
          {title: 'Sweden', body: pt('+46 (0)20 - 12 10 34')},
          {title: 'Norway', body: pt('+47 67 22 88 99')},
        ],
      }),
    ]),
  ]
}

/** The 14 integrations from the Integrations reference, in directory order. */
export const integrationData: {
  id: string
  name: string
  shortName: string
  category: string
  shortDescription: string
  status: 'available' | 'comingSoon'
  linkOverride?: string
}[] = [
  {id: 'fortnox', name: 'Fortnox', shortName: 'Fx', category: 'accounting', status: 'available', shortDescription: 'Customers, invoices and receipts sync to Fortnox automatically. Saves time and reduces errors.'},
  {id: 'unit4', name: 'Unit4', shortName: 'U4', category: 'accounting', status: 'available', shortDescription: 'Receipts, invoices, stock and sales data are transferred to Unit4 in real time.'},
  {id: 'integrated-point-of-sale', name: 'Integrated point of sale', shortName: 'POS', category: 'payments', status: 'available', shortDescription: 'Take payment inside Eontyre. Approved by the Swedish Tax Agency, and the wheel change closes when the customer pays.'},
  {id: 'check-in', name: 'Check-in', shortName: 'Ci', category: 'workshop', status: 'available', shortDescription: 'Customers check in on a tablet at reception. Name, mobile number and e-mail are collected correctly every time.'},
  {id: 'vecheck', name: 'Vecheck', shortName: 'Vc', category: 'workshop', status: 'available', shortDescription: 'Inspect the car at drop-off and send photos, reports and repair offers straight to the customer’s phone.'},
  {id: 'tread-scanning', name: 'Tread scanning', shortName: 'Sc', category: 'workshop', status: 'available', shortDescription: 'Automatic scans give exact tread data and ready-made sales recommendations.'},
  {id: 'sales-tool', name: 'Sales tool', shortName: 'St', category: 'workshop', status: 'available', shortDescription: 'Every employee can find recommended products and prices on a tablet or computer.'},
  {id: 'storage-adapters', name: 'Storage adapters', shortName: 'Sa', category: 'storage', status: 'available', shortDescription: 'Enter the dimensions of shelves, cages, containers or racks and Eontyre calculates the most space-efficient storage.'},
  {id: 'storage-systems', name: 'Storage systems', shortName: 'Ss', category: 'storage', status: 'available', shortDescription: 'Works with SSI Schäfer racks, containers, pallets or stacks of tyres on the floor.'},
  {id: 'european-tyre-suppliers', name: 'European tyre suppliers', shortName: 'TS', category: 'suppliers', status: 'available', shortDescription: 'Live stock, prices and ordering from tyre suppliers all over Europe.'},
  {id: 'eontyre-partner-garages', name: 'Eontyre partner garages', shortName: 'PG', category: 'suppliers', status: 'available', shortDescription: 'Use other Eontyre garages as suppliers to complement your own stock.'},
  {id: 'webshop', name: 'Webshop', shortName: 'Ws', category: 'salesChannels', status: 'available', shortDescription: 'A tyre webshop with registration number search, live stock and fitting bookings.', linkOverride: '/webshop'},
  {id: 'premium-consumer-shop', name: 'Premium consumer shop', shortName: 'PS', category: 'salesChannels', status: 'comingSoon', shortDescription: 'A consumer tyre shop with everything extra.'},
  {id: 'eontyre-api', name: 'Eontyre API', shortName: 'API', category: 'developers', status: 'available', shortDescription: 'Automate flows and connect your own systems, apps and partners.', linkOverride: '/api'},
]

/** Detail page blocks for the integrated point of sale (POS reference). */
export function posBlocks(img: Images) {
  return [
    pageHero({
      eyebrow: 'Payments',
      heading: 'Take payment straight away, without double work',
      body: pt(
        'The point of sale is built into Eontyre and connected to everything you already do there. Fast transactions and no unnecessary clicks for staff or customers.',
      ),
      buttons: [button('Add it to your account', '/about#contact')],
      media: 'image',
      image: image(img.counter, 'Customer paying by card at a tyre shop counter'),
    }),
    featureGrid({
      heading: 'Built for the tyre season, when every minute counts',
      variant: 'topRule',
      items: [
        {title: 'Approved by the Swedish Tax Agency', body: pt("Eontyre's own point of sale meets Skatteverket's requirements for cash registers.")},
        {
          title: 'Payment closes the job',
          body: pt('The wheel change is completed automatically as soon as the payment goes through, which saves clicks at reception.'),
        },
        {
          title: 'Storage receipt by e-mail',
          body: pt("With tread depth gauges connected, the storage receipt goes straight to the customer's e-mail."),
        },
      ],
    }),
    featureGrid(
      {
        heading: 'Works well with',
        variant: 'cards',
        items: [
          {title: 'Fortnox', body: pt('Receipts and invoices from the point of sale sync to your accounting.'), link: '/integrations'},
          {title: 'Unit4', body: pt('Sales and stock data transferred in real time.'), link: '/integrations'},
          {title: 'Check-in', body: pt('Correct customer details from the start, ready at the till.'), link: '/integrations'},
        ],
      },
      {background: 'surface'},
    ),
    ctaBanner({
      heading: 'Get the point of sale before the season starts',
      buttons: [button('Contact sales', '/about#contact')],
      style: 'accent',
    }),
  ]
}

/** Placeholder news posts from the News reference. Seeded as drafts (BRIEF-2). */
export const postData: {
  id: string
  date: string
  category: 'productNews' | 'integrations' | 'company'
  title: string
  excerpt: string
  featured?: boolean
  image?: keyof Images
  imageAlt?: string
}[] = [
  {
    id: 'pos-winter-season',
    date: '2026-09-12',
    category: 'productNews',
    title: 'Integrated point of sale ready for the winter season',
    excerpt: 'The point of sale is approved by the Swedish Tax Agency and closes the wheel change as soon as the customer has paid.',
    featured: true,
    image: 'counter',
    imageAlt: 'Customer paying by card at a tyre shop counter',
  },
  {id: 'unit4-sync', date: '2026-09-02', category: 'integrations', title: 'Eontyre now syncs with Unit4', excerpt: 'Receipts, invoices, stock and sales data are transferred to Unit4 in real time, so the books stay up to date in the background.'},
  {id: 'storage-adapters', date: '2026-08-18', category: 'productNews', title: 'Storage adapters fit more tyres in the same space', excerpt: 'Enter the dimensions of shelves, cages, containers or racks and Eontyre suggests the most space-efficient position for every set.'},
  {id: 'vecheck-inspections', date: '2026-06-30', category: 'integrations', title: 'Vecheck inspections inside Eontyre', excerpt: 'Inspect the car at drop-off and send photos, reports and repair offers straight to the customer’s phone.'},
  {id: 'tablet-check-in', date: '2026-06-04', category: 'productNews', title: 'Customer check-in on a tablet', excerpt: 'Customers register themselves at reception, and name, mobile number and e-mail are collected correctly every time.'},
  {id: 'new-website', date: '2026-05-12', category: 'company', title: 'A new website for Eontyre', excerpt: 'One place for the business system, the webshop, the API and all integrations.'},
  {id: 'fortnox-updated', date: '2026-04-21', category: 'integrations', title: 'Fortnox integration updated', excerpt: 'Customers, invoices and receipts are now updated in Fortnox as soon as they change in Eontyre.'},
]
