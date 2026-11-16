/**
 * Fonts for Template I — Scholars.
 *
 * Lora for headings (a bookish serif for a school whose motto is about
 * reading) over Nunito Sans for everything else. See template-b/fonts.ts for why
 * faces are declared per template and why `preload` is off.
 */

import { Lora, Nunito_Sans } from 'next/font/google'

const serif = Lora({
  variable: '--font-ts-serif',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
})

const sans = Nunito_Sans({
  variable: '--font-ts-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: false,
})

/** Applied to the template's root element. */
export const templateIFonts = `${serif.variable} ${sans.variable}`
