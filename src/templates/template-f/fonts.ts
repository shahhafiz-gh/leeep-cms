/**
 * Fonts for Template F — Almanac.
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
 * The variables land on the template's ROOT DIV (see TemplateF.tsx), not on
 * <body>, so the CSS custom properties that read them are scoped in
 * `globals.css` to `.template-f` rather than to `body`. Both halves have to
 * resolve on the same element or the declaration is invalid at computed-value
 * time and the face silently falls back.
 */

import { BioRhyme, Roboto_Slab } from 'next/font/google'

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

export const bioRhyme = BioRhyme({
  variable: '--font-biorhyme',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
})

export const robotoSlab = Roboto_Slab({
  variable: '--font-roboto-slab',
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  preload: false,
})

/** Applied to the template's root element. Almanac ships BioRhyme and can be
 *  switched to Roboto Slab per school, so both are loaded for this template. */
export const templateFFonts = `${bioRhyme.variable} ${robotoSlab.variable}`
