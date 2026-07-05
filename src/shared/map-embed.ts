/**
 * Normalize whatever the admin pasted into "Map embed URL" into something an
 * <iframe> can actually render.
 *
 * Only true embed URLs (`/maps/embed?pb=…` or `…&output=embed`) are frameable —
 * regular Google Maps links (`/maps/@lat,lng,zoom`, `/maps/place/…`, `?q=…`)
 * send X-Frame-Options and show a blank box. Admins paste those constantly, so
 * we convert the common shapes instead of demanding the exact embed snippet.
 * The STORED value stays whatever was pasted (opaque-blob rule) — this runs at
 * render time only.
 */
export function toMapEmbedUrl(raw: string | null | undefined): string {
  const input = (raw ?? '').trim()
  if (!input) return ''

  // A whole <iframe …> snippet pasted from Google's "Embed a map" dialog.
  const iframeSrc = input.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  const url = iframeSrc ? iframeSrc[1] : input
  if (!/^https?:\/\//i.test(url)) return ''

  // Already embeddable.
  if (/\/maps\/embed/i.test(url) || /output=embed/i.test(url)) return url

  // "@lat,lng[,zoom]z" — plain map views, pins, and place pages all carry it.
  const at = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?)z)?/)
  if (at) {
    const zoom = at[3] ? Math.round(parseFloat(at[3])) : 15
    return `https://maps.google.com/maps?q=${at[1]},${at[2]}&z=${zoom}&output=embed`
  }

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('google')) {
      // "?q=…" search links.
      const q = parsed.searchParams.get('q')
      if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
      // "/maps/place/<name>" without coordinates.
      const place = parsed.pathname.match(/\/maps\/place\/([^/]+)/)
      if (place) return `https://maps.google.com/maps?q=${place[1]}&output=embed`
    }
  } catch {
    /* fall through */
  }

  // Unknown shape (short links, other providers) — pass through unchanged.
  return url
}
