import type { Metadata } from 'next'
import { BioRhyme, Nunito, DM_Sans, Hind, Geist, Inter, Rufina, Roboto_Slab, Space_Grotesk, Newsreader, Lora, Work_Sans } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

const hind = Hind({
  variable: '--font-hind',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const rufina = Rufina({
  variable: '--font-rufina',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

// Template D ("Quill") — a grotesk display face paired with a light serif used
// only for italic accents and pull-quotes.
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const bioRhyme = BioRhyme({
  variable: '--font-biorhyme',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const robotoSlab = Roboto_Slab({
  variable: '--font-roboto-slab',
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
})

// Template E ("Ledger") — a text serif for headings and figures, with a plain
// grotesque for everything else.
const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LEEEP CMS',
  description: 'Multi-tenant school website platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${dmSans.variable} ${hind.variable} ${inter.variable} ${rufina.variable} ${spaceGrotesk.variable} ${newsreader.variable} ${bioRhyme.variable} ${robotoSlab.variable} ${lora.variable} ${workSans.variable} ${geist.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
