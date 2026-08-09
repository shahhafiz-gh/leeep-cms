'use client'

import type { SchoolData } from '@/types/school.types'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'
import Photo from '../common/Photo'
import { SectionHead } from '../common/Bits'
import { gridCols } from '@/shared/utils/grid'

/**
 * Campus mosaic. The design's life-on-campus block is an asymmetric grid: one
 * tall lead image, then a run of smaller ones. Rather than hard-code that shape
 * (which breaks when a school uploads 3 photos, or 10), the emphasis is derived
 * from position — the first tile spans two rows, the fourth spans two columns —
 * and every other tile falls into the flow.
 */
export default function GallerySection({ data }: { data: SchoolData }) {
  const images = useGalleryImages(data.gallery?.images ?? [])
  if (images.length === 0) return null

  // The asymmetric spans only work once there are enough tiles to fill around
  // them; below four the grid falls back to an even row so no hole is left.
  const mosaic = images.length >= 4

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
      <SectionHead title={data.gallery?.title || 'Life on campus'} editPath="gallery.title" />

      <div
        className={`grid auto-rows-[180px] gap-5 lg:auto-rows-[260px] ${
          mosaic ? 'grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]' : gridCols(images.length, 3)
        }`}
      >
        {images.map((image, i) => (
          <Photo
            key={`${image.src}-${i}`}
            src={image.src}
            alt={image.alt || `Campus photo ${i + 1}`}
            caption={image.alt || 'campus photo'}
            editPath={`gallery.images.${i}.src`}
            className={`h-full w-full ${mosaic && i === 0 ? 'row-span-2' : ''} ${mosaic && i === 3 ? 'col-span-2' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}
