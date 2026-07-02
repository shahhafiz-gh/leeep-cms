'use client'

import { useEffect, useState } from 'react'
import type { GalleryImage } from '@/types/school.types'

const ADMIN_SOURCE = 'leeep-admin'

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
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return images
}
