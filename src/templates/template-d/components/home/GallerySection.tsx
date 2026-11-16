'use client'

import type { SchoolData } from '@/types/school.types'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'
import Photo from '../common/Photo'
import { SectionHead } from '../common/Bits'
import GalleryCarousel from '@/shared/GalleryCarousel'
import { galleryTitle } from '@/shared/gallery-title'

/** School gallery: the uploaded photos in a swipeable, auto-advancing carousel. */
export default function GallerySection({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  const images = useGalleryImages(data.gallery?.images ?? [])
  if (images.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
      <SectionHead title={galleryTitle(data)} editPath="gallery.title" />

      <GalleryCarousel
        images={images}
        autoplay={!editing}
        buttonClassName="border border-td-ink/15 bg-white text-td-ink hover:border-td-accent hover:text-td-accent"
        slideClassName="h-[240px] lg:h-[300px]"
        renderSlide={(image, i) => (
          <Photo
            fill
            src={image.src}
            alt={image.alt || `Campus photo ${i + 1}`}
            caption={image.alt || 'campus photo'}
            editPath={`gallery.images.${i}.src`}
            className="h-full w-full"
          />
        )}
      />
    </section>
  )
}
