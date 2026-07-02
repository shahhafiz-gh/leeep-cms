'use client'

import Image from 'next/image'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'

export default function GallerySection({ data }: { data: SchoolData }) {
  // Own the array (shared with Template B's GalleryGrid) so the Gallery panel's
  // add / remove / reorder reflect live in the preview, not just per-image src.
  const images = useGalleryImages(data.gallery?.images ?? [])
  if (images.length === 0) return null

  return (
    <section className="py-(--spacing-ta-xxl)] bg-ta-surface overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) mb-4 inline-block">
              Campus Gallery
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 data-edit="gallery.title" className="font-(family-name:--font-ta-h2) text-(length:--text-ta-h2) text-ta-on-surface mb-4">
              {data.gallery?.title || 'Life at Our Campus'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-(family-name:--font-ta-body-lg) text-ta-on-surface-variant max-w-2xl mx-auto">
              A glimpse into our vibrant campus, where learning meets inspiration every day.
            </p>
          </ScrollReveal>
        </div>

        {/* Gallery Grid */}
        <ScrollReveal delay={0.3} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-[4/3]'
              }`}
            >
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-edit-img={`gallery.images.${i}.src`}
                />
              ) : (
                <ImagePlaceholder label="Add photo" editPath={`gallery.images.${i}.src`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
