'use client'

import type { GalleryImage } from '@/types/school.types'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'

/**
 * Template B — gallery grid (client).
 *
 * A thin layout over the shared {@link useGalleryImages} hook, which owns the
 * image list so the Vue admin's Gallery panel can add (one OR many at once),
 * remove ("×") and REORDER images, reflected live in the preview. Reordering is
 * a Vue-form-only action by design — there is intentionally no drag affordance in
 * the preview. Template A's gallery uses the same hook, so both behave identically.
 */
export default function GalleryGrid({ initialImages }: { initialImages: GalleryImage[] }) {
  const images = useGalleryImages(initialImages)

  // Empty during editing (admin deleted every image) → keep the section visible
  // with a hint so they know where the gallery lives. Live with no images never
  // reaches here (GallerySection returns null before rendering the grid).
  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
        No images yet — add some from the Gallery panel.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, i) => (
        <div
          // Index key intentionally: paths are index-based, so after a reorder
          // each slot's data-edit-img stays consistent with its position.
          key={i}
          className={`relative overflow-hidden rounded-2xl group ${
            i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'
          }`}
        >
          {image.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt}
              data-edit-img={`gallery.images.${i}.src`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
              No image
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
