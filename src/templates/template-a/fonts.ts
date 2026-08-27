/**
 * Fonts for Template A — Willow.
 *
 * Declared HERE rather than in the root layout, because a `next/font` family is
 * downloaded and <link rel=preload>-ed for whatever route loads its module. The
 * root layout declared all twelve families the six templates use between them,
 * so every school preloaded eighteen font files to render with two or three of
 * them — render-blocking bytes competing with the hero image on a phone.
 *
 * `render-template.tsx` imports each template dynamically, so only the school's
 * own template — and therefore only these faces — is ever evaluated.
 *
 * The variables land on the template's ROOT DIV (see TemplateA.tsx), not on
 * <body>, so the CSS custom properties that read them are scoped in
 * `globals.css` to `.template-a` rather than to `body`. Both halves have to
 * resolve on the same element or the declaration is invalid at computed-value
 * time and the face silently falls back.
 */

import { Nunito, DM_Sans } from 'next/font/google'

/**
 * `preload: false` on every face, deliberately.
 *
 * A `<link rel=preload>` is a promise that the file WILL be needed. Next bundles
 * all six templates' `@font-face` rules into one stylesheet for the route — it
 * cannot know at build time which template a given school picked — so leaving
 * preload on meant every visitor eagerly downloaded seventeen font files to use
 * two or three of them, as render-blocking bytes competing with the hero image.
 *
 * Without the preload hints the browser does what it does for any stylesheet:
 * it downloads only the faces the rendered CSS actually references. Combined
 * with `display: 'swap'`, text paints immediately in the fallback and swaps
 * when the real face lands.
 */

export const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: false,
})

export const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
})

/** Applied to the template's root element. */
export const templateAFonts = `${nunito.variable} ${dmSans.variable}`
