'use client'

import { useEffect, useState } from 'react'
import type { GalleryImage } from '@/types/school.types'

const ADMIN_SOURCE = 'leeep-admin'
const EDIT_SOURCE = 'leeep-inline-edit'

/** Hard cap on gallery images. The Vue panel disables "Add" once it holds this
 *  many; the grid also slices defensively so the preview never exceeds it. */
export const MAX_GALLERY_IMAGES = 10

/**
 * Own the home gallery's image list so the Vue admin's Gallery panel can add
 * (one OR many at once), remove ("×"), and REORDER images with the change
 * reflected live in the preview — no reload, no index drift.
 *
 * A single message carries the FULL resulting array, so it covers all three
 * operations uniformly:
 *
 *   { source: 'leeep-admin', type: 'apply-gallery',
 *     path: 'gallery.images', value: GalleryImage[] }
 *
 * Per-image `src` uploads still flow through InlineEditLayer's `apply-image`
 * (data-edit-img) handler; the Vue panel keeps its array authoritative and folds
 * the new src into its next `apply-gallery` payload. On the live site no admin
 * messages arrive, so state simply stays at the server-rendered `initial`.
 *
 * On load, this hook also PULLS: it asks the admin for the saved images as soon
 * as its listener is attached. On a refresh the admin broadcasts the saved array
 * once (in `overlayDraftOnPreview`), but this section mounts a beat later — behind
 * hydration / entrance animations — and misses that one-shot message, so uploaded
 * / replaced photos would vanish back to the demo scaffold (leaving grid gaps).
 * Requesting it here closes that race deterministically. On the live site no admin
 * answers, so state simply stays at the server-rendered `initial`.
 *
 * Shared by both templates' home galleries so they behave identically.
 */
export function useGalleryImages(initial: GalleryImage[]): GalleryImage[] {
  const [images, setImages] = useState<GalleryImage[]>(() => initial.slice(0, MAX_GALLERY_IMAGES))

  // Re-sync if the server re-renders this section with fresh props (e.g. nav).
  useEffect(() => {
    setImages(initial.slice(0, MAX_GALLERY_IMAGES))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)])

  // Reflect add / multi-add / delete / reorder pushed from the Vue admin panel.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || msg.source !== ADMIN_SOURCE) return
      if (msg.type === 'apply-gallery' && msg.path === 'gallery.images' && Array.isArray(msg.value)) {
        setImages((msg.value as GalleryImage[]).slice(0, MAX_GALLERY_IMAGES))
      }
    }
    window.addEventListener('message', onMessage)
    // Pull the current saved images now that we're listening (the admin validates
    // origin, so a wildcard target is fine for this no-op request).
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ source: EDIT_SOURCE, type: 'request-gallery', path: 'gallery.images' }, '*')
    }
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return images
}
