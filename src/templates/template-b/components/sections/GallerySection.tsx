import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import GalleryGrid from './GalleryGrid'

/** Template B — Gallery Section (Kashmir-Cambridge style).
 *
 *  The header stays server-rendered so its inline-edited title is never clobbered
 *  by grid re-renders. The grid itself ({@link GalleryGrid}) is a client component
 *  that reflects the Vue admin's add / multi-add / delete / reorder live. The
 *  `data-section="gallery"` marker lets the admin form open this section's
 *  dedicated Gallery panel. */
export default function GallerySection({ data }: { data: SchoolData }) {
  const images = data.gallery?.images ?? []
  if (images.length === 0) return null

  return (
    <section data-section="gallery" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">Gallery</p>
          <h2 data-edit="gallery.title" className="text-3xl md:text-4xl font-bold text-tb-heading mb-4">
            {data.gallery?.title || 'Life at Our Campus'}
          </h2>
        </ScrollReveal>

        <GalleryGrid initialImages={images} />
      </div>
    </section>
  )
}
