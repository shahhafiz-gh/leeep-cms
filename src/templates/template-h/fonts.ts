/**
 * Fonts for Template H — Grand.
 *
 * The school's existing site sets everything in Poppins (nav, headings and
 * body), so the template loads that one family rather than inheriting
 * Heritage's Inter/Rufina pairing. See template-b/fonts.ts for why the faces
 * are declared per-template and why `preload` is off.
 */

import { Poppins } from 'next/font/google'

export const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false,
})

/** Applied to the template's root element. */
export const templateHFonts = poppins.variable
