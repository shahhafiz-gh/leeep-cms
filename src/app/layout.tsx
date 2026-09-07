import type { Metadata } from 'next'
import './globals.css'

/**
 * The root layout deliberately loads NO fonts.
 *
 * It used to declare all twelve `next/font` families the six templates use
 * between them and attach every variable to <body>. Because `next/font`
 * preloads whatever a route loads, that meant eighteen `<link rel=preload>`
 * font files on every page of every school — to render with the two or three
 * its own template actually uses. On a phone those are render-blocking bytes
 * competing with the hero image.
 *
 * Each template now owns its faces (a `fonts.ts` beside each `Template*`
 * component) and puts the variables on its own root element. Next still bundles
 * every template's `@font-face` rules into one stylesheet — it cannot know which
 * template a school picked until the request — so the faces additionally declare
 * `preload: false`, which is what actually removed the seventeen eager
 * downloads: the browser now fetches only the faces the rendered CSS references.
 *
 * Keeping the shell this thin also means the layout has nothing request-scoped
 * in it, which is part of why the public pages can be statically rendered.
 */

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
      <head>
        {/* The reveal animations start hidden and are shown by an
            IntersectionObserver. With scripting off that observer never runs,
            so the page would be a column of blank space — this makes the
            content visible instead. A <style> is the only thing <noscript>
            may usefully contain in <head>. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
