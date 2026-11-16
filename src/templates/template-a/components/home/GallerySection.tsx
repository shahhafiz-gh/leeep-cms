'use client'

import Image from '@/shared/SiteImage'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'
import { useGalleryImages } from '@/shared/hooks/useGalleryImages'
import GalleryCarousel from '@/shared/GalleryCarousel'
import { galleryTitle } from '@/shared/gallery-title'

export default function GallerySection({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  // Own the array (shared with Template B's GalleryGrid) so the Gallery panel's
  // add / remove / reorder reflect live in the preview, not just per-image src.
  const images = useGalleryImages(data.gallery?.images ?? [])
  if (images.length === 0) return null

  return (
    <section className="bg-ta-surface overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-(length:--text-ta-label-md) mb-4 inline-block">
              Campus Life
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 data-edit="gallery.title" className="font-(family-name:--font-ta-h2) text-(length:--text-ta-h2) text-ta-on-surface mb-4">
              {galleryTitle(data)}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p data-edit="gallery.subtitle" className="font-(family-name:--font-ta-body-lg) text-ta-on-surface-variant max-w-2xl mx-auto">
              {data.gallery?.subtitle || 'A glimpse into our vibrant campus, where learning meets inspiration every day.'}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <GalleryCarousel
            images={images}
            autoplay={!editing}
            buttonClassName="border border-ta-outline-variant/50 bg-ta-surface text-ta-on-surface shadow-sm hover:border-ta-primary hover:bg-ta-surface-container hover:text-ta-primary"
            slideClassName="aspect-[4/3] rounded-2xl"
            renderSlide={(image, i) => (
              <div className="group relative h-full w-full">
                {image.src ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    data-edit-img={`gallery.images.${i}.src`}
                  />
                ) : (
                  <ImagePlaceholder label="Add photo" editPath={`gallery.images.${i}.src`} />
                )}
              </div>
            )}
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
