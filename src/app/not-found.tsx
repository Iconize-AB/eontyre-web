import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container-site flex flex-1 flex-col items-start justify-center gap-6 py-32">
      <h1 className="type-h2">Page not found</h1>
      <p className="text-[18px] text-fg-muted">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="text-fg underline underline-offset-3">
        Go to the home page
      </Link>
    </main>
  )
}
