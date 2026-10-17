import {Archivo, IBM_Plex_Mono, Schibsted_Grotesk} from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
})

const schibsted = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${archivo.variable} ${schibsted.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
