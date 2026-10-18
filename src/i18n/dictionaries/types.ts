/** Interface texts that live in code, not in Sanity. One dictionary per language. */

export interface Dictionary {
  /** The language's own name, shown in the language switcher. */
  languageName: string
  /** Locale used to format numbers in demo screens. */
  numberLocale: string
  header: {menu: string; closeMenu: string; mainNav: string; language: string; onThisPage: string}
  breadcrumb: {label: string; integrations: string; news: string}
  notFound: {heading: string; text: string; home: string}
  integrations: {
    all: string
    readMore: string
    available: string
    comingSoon: string
    empty: string
    filter: string
    categories: Record<
      'accounting' | 'payments' | 'workshop' | 'storage' | 'suppliers' | 'salesChannels' | 'developers',
      string
    >
  }
  news: {
    all: string
    readArticle: string
    loadMore: string
    empty: string
    moreNews: string
    filter: string
    categories: Record<'productNews' | 'integrations' | 'company', string>
  }
  forms: {
    honeypot: string
    error: string
    labels: {
      contact: Record<'name' | 'email' | 'message', string>
      trial: Record<'company' | 'orgNumber' | 'phone' | 'address' | 'zip' | 'city' | 'country' | 'email' | 'password', string>
      newsletter: Record<'email', string>
    }
    countries: Record<'Sweden' | 'Norway' | 'Denmark' | 'Finland' | 'Other', string>
  }
  /** The registration plate field (hero and webshop demo). */
  plate: {countryCode: string; label: string}
  plateDemo: {
    find: string
    notFound: string
    euLabel: string
    sources: Record<'own' | 'supplier' | 'partner', string>
    stock: Record<'inStock' | 'available' | 'availablePlus', string>
    delivery: Record<'today' | 'tomorrow' | 'twoDays', string>
    /** "{amount} kr" */
    price: string
  }
  calendar: {
    /** Locale for weekday and date names in the week view. */
    dateLocale: string
    ariaLabel: string
    views: Record<'day' | 'week' | 'month', string>
    week: string
    jumpToToday: string
    calendar: string
    filter: string
    displaySettings: string
    closeLift: string
    bookingColours: string
    sources: Record<'admin' | 'online' | 'auto', string>
    autoBookingStatus: string
    statuses: Record<'sent' | 'accepted' | 'declined', string>
    /** "[{count} bookings]" */
    bookings: string
    closedLift: string
    closed: string
    unknown: string
    services: Record<'wheelChange' | 'tyreChange' | 'looseWheel' | 'newTyres' | 'wheelAlignment', string>
  }
  order: {
    title: string
    totalInclVat: string
    lines: Record<'tyres' | 'wheelChange' | 'tyreHotel', string>
    /** "Example order {number} in Eontyre: …, total {total}" */
    ariaLabel: string
  }
}

/** Replaces {name} placeholders. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match))
}
