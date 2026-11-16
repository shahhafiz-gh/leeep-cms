'use client'

import type { GalleryImage } from '@/types/school.types'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'
import GalleryCarousel from '@/shared/GalleryCarousel'

/**
 * Template B — gallery carousel (client).
 *
 * A thin layout over the shared {@link useGalleryImages} hook, which owns the
 * image list so the Vue admin's Gallery panel can add (one OR many at once),
 * remove ("×") and REORDER images, reflected live in the preview. Reordering is
 * a Vue-form-only action by design — there is intentionally no drag affordance in
 * the preview. Template A's gallery uses the same hook, so both behave identically.
 */
export default function GalleryGrid({
  initialImages,
  autoplay = true,
}: {
  initialImages: GalleryImage[]
  autoplay?: boolean
}) {
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
    <GalleryCarousel
      images={images}
      autoplay={autoplay}
      buttonClassName="border border-slate-200 bg-white text-tb-heading shadow-sm hover:border-tb-primary-400 hover:text-tb-primary-400"
      slideClassName="aspect-[4/3] rounded-2xl"
      renderSlide={(image, i) =>
        image.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img loading="lazy" decoding="async"
            src={image.src}
            alt={image.alt}
            data-edit-img={`gallery.images.${i}.src`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-300">
            No image
          </div>
        )
      }
    />
  )
}
