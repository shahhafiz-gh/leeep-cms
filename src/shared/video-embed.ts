/**
 * Turn a school-authored video URL into the pieces a player needs.
 *
 * Schools paste whatever their browser showed them — a watch link, a share
 * link, an embed link — so all three shapes are accepted. Only the extracted
 * ID is ever interpolated into an embed URL: the school's string never becomes
 * markup, so a pasted `<iframe>` or a `javascript:` URL cannot reach the page.
 */
export type VideoProvider = 'youtube' | 'vimeo'

export interface ParsedVideo {
  provider: VideoProvider
  id: string
  /** Privacy-preserving embed URL, for use once the viewer clicks play. */
  embedUrl: string
  /** The provider's own poster image, when it has a predictable one. */
  posterUrl?: string
}

const YOUTUBE_ID = /^[\w-]{11}$/
const VIMEO_ID = /^\d+$/

export function parseVideo(raw?: string): ParsedVideo | null {
  const value = (raw || '').trim()
  if (!value) return null

  let url: URL
  try {
    url = new URL(value)
  } catch {
    // A bare id is the one non-URL form worth supporting, since it is what a
    // school copies out of an existing embed snippet.
    return YOUTUBE_ID.test(value) ? youtube(value) : null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    return YOUTUBE_ID.test(id) ? youtube(id) : null
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const fromQuery = url.searchParams.get('v')
    if (fromQuery && YOUTUBE_ID.test(fromQuery)) return youtube(fromQuery)
    // /embed/<id>, /v/<id>, /shorts/<id>
    const last = url.pathname.split('/').filter(Boolean).pop() || ''
    return YOUTUBE_ID.test(last) ? youtube(last) : null
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const last = url.pathname.split('/').filter(Boolean).pop() || ''
    return VIMEO_ID.test(last) ? vimeo(last) : null
  }
  return null
}

function youtube(id: string): ParsedVideo {
  return {
    provider: 'youtube',
    id,
    // youtube-nocookie keeps the school's visitors out of YouTube's ad profile
    // until they choose to play something.
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    posterUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  }
}

function vimeo(id: string): ParsedVideo {
  return {
    provider: 'vimeo',
    id,
    embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
    // Vimeo posters need an API call, so the school supplies its own thumbnail.
    posterUrl: undefined,
  }
}
