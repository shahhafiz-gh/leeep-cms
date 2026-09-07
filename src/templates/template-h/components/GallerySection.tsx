import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * "Our Image Gallery" — the reference site's masonry-ish grid with a caption
 * that rises on hover. The lead tile spans a 2x2 block on desktop, which is what
 * stops a uniform grid of school photos from reading as a contact sheet.
 *
 * A tile linked to an event deep-links into Updates, matching every other
 * template's gallery behaviour.
 */
export default function GallerySection({ data }: { data: SchoolData }) {
  // Nine tiles exactly fill three rows of the four-column grid once the lead
  // tile has taken a 2x2 block (4 + 8 = 12 cells). Seven left a hole.
  const images = (data.gallery?.images ?? []).slice(0, 9)
  if (!images.length || !isSectionVisible(data, 'gallery')) return null

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 data-edit="gallery.title" className="text-2xl font-bold text-th-heading md:text-3xl">
            {data.gallery?.title || 'Our Image Gallery'}
          </h2>
          <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
          {data.gallery?.subtitle && (
            <p data-edit="gallery.subtitle" className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-th-body">
              {data.gallery.subtitle}
            </p>
          )}
        </div>

        <div className="mt-11 grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.map((image, i) => {
            const tile = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt || ''}
                  data-edit-img={`gallery.images.${i}.src`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-th-heading/0 transition-colors duration-300 group-hover:bg-th-heading/45" />
                {image.alt && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-3 px-4 pb-4 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {image.alt}
                  </span>
                )}
              </>
            )
            const className = `group relative overflow-hidden bg-th-paper ${
              i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'
            }`
            return image.eventId ? (
              <Link key={`${image.src}-${i}`} href={`/updates#${image.eventId}`} className={className}>
                {tile}
              </Link>
            ) : (
              <div key={`${image.src}-${i}`} className={className}>
                {tile}
              </div>
            )
          })}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border-2 border-th-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-th-primary transition-colors hover:bg-th-primary hover:text-white"
          >
            View full gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
