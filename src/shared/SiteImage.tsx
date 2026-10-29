'use client'

import { createContext, useContext, type ReactNode } from 'react'
import Image, { type ImageLoader, type ImageProps } from 'next/image'

/**
 * `next/image`, with the school's choice of WHO optimizes it.
 *
 * Every template imports this instead of `next/image` directly. With Vercel
 * optimization on (the default, and what every site had before the switch) it
 * IS `next/image`: resized and re-encoded by Vercel's `/_next/image` endpoint.
 * A school can turn that off (School Website → `config.vercel_image_optimization`,
 * e.g. to stay inside the Vercel image quota); its images are then resized and
 * converted to WebP by wsrv.nl, a free, open-source image CDN, so turning Vercel
 * off never means shipping full-size originals to a phone.
 *
 * The choice is per SCHOOL, so it cannot live in next.config's global loader —
 * `renderTemplate` reads it from the site config and provides it here.
 */
const VercelOptimization = createContext(true)

export function ImageOptimizationProvider({ vercel, children }: { vercel: boolean; children: ReactNode }) {
  return <VercelOptimization.Provider value={vercel}>{children}</VercelOptimization.Provider>
}

const EXTERNAL_CDN = 'https://wsrv.nl/'

/** Resize + WebP through the external CDN. `we` = never upscale past the original. */
const externalLoader: ImageLoader = ({ src, width, quality }) =>
  `${EXTERNAL_CDN}?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}&output=webp&we`

/**
 * Whether the external CDN can fetch this image at all. It needs a public
 * absolute URL: a site-relative asset (`/assets/...`) or a dev backend on
 * localhost / a private address is unreachable from it, and an SVG has nothing
 * to resize. Those are served as-is rather than sent to Vercel — off means off.
 */
function proxiable(src: ImageProps['src']): src is string {
  if (typeof src !== 'string' || !/^https?:\/\//i.test(src)) return false
  try {
    const { hostname, pathname } = new URL(src)
    if (/\.svg$/i.test(pathname)) return false
    return !/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/.test(hostname)
  } catch {
    return false
  }
}

export default function SiteImage({ alt, ...props }: ImageProps) {
  const vercel = useContext(VercelOptimization)
  if (vercel || props.unoptimized || props.loader) return <Image alt={alt} {...props} />
  if (!proxiable(props.src)) return <Image alt={alt} {...props} unoptimized />
  return <Image alt={alt} {...props} loader={externalLoader} />
}
