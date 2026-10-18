import Link from 'next/link'

import {localizedPath} from '@/i18n/paths'
import {getDictionary, getLocale} from '@/i18n/server'

/** "Integrations / Integrated point of sale" bar under the header. */
export async function Breadcrumb({section, current}: {section: 'integrations' | 'news'; current: string}) {
  const [dictionary, locale] = await Promise.all([getDictionary(), getLocale()])

  return (
    <nav aria-label={dictionary.breadcrumb.label} className="border-b border-line">
      <ol className="container-wide flex flex-wrap gap-2 py-4 text-[14px] text-fg-subtle">
        <li>
          <Link
            href={localizedPath(locale, `/${section}`)}
            className="underline underline-offset-3 transition-colors duration-150 hover:text-fg"
          >
            {dictionary.breadcrumb[section]}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-fg">
          {current}
        </li>
      </ol>
    </nav>
  )
}
