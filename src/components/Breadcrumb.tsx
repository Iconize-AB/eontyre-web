import Link from 'next/link'

/** "Integrations / Integrated point of sale" bar under the header. */
export function Breadcrumb({parent, current}: {parent: {label: string; href: string}; current: string}) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line">
      <ol className="container-wide flex flex-wrap gap-2 py-4 text-[14px] text-fg-subtle">
        <li>
          <Link href={parent.href} className="underline underline-offset-3 transition-colors duration-150 hover:text-fg">
            {parent.label}
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
