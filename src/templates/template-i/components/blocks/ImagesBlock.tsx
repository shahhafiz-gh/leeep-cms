'use client'

import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import type { CustomPageImage } from '@/types/school.types'

interface ImagesBlockProps {
  images: CustomPageImage[]
  /** 'grid' (default), 'wide' — one photo per row — or 'pages' for document scans. */
  layout?: string
  /** Builder edit path of the images list, e.g. `pages.3.blocks.1.images`. */
  basePath?: string
}

const GRID: Record<string, string> = {
  wide: 'grid gap-5',
  pages: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4',
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
}

/**
 * Photos with a full-screen viewer. Scans (`pages`) keep their own proportions
 * so a certificate or prospectus page is never cropped; photos fill a tidy 4:3.
 */
export default function ImagesBlock({ images, layout = 'grid', basePath }: ImagesBlockProps) {
  const shown = images.filter((image) => image?.src)
  const [open, setOpen] = useState<number | null>(null)

  const step = useCallback(
    (by: number) => setOpen((index) => (index === null ? null : (index + by + shown.length) % shown.length)),
    [shown.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, step])

  if (!shown.length) return null
  const kind = GRID[layout] ? layout : 'grid'
  const single = shown.length === 1 && kind === 'grid'
  // Two photos share the row rather than leaving a third column empty.
  const grid = kind === 'grid' && shown.length === 2 ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : GRID[kind]

  return (
    <>
      <div className={single ? 'grid' : grid}>
        {shown.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="m-0">
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group block w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-ts-line focus:outline-none focus-visible:ring-2 focus-visible:ring-ts-primary"
              aria-label={`View ${image.alt || image.caption || `photo ${index + 1}`}`}
            >
              <img
                src={image.src}
                alt={image.alt || image.caption || ''}
                loading="lazy"
                decoding="async"
                data-edit-img={basePath ? `${basePath}.${index}.src` : undefined}
                className={
                  kind === 'pages' || single || kind === 'wide'
                    ? 'h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]'
                    : 'aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                }
              />
            </button>
            {image.caption && (
              <figcaption
                data-edit={basePath ? `${basePath}.${index}.caption` : undefined}
                className="mt-2 text-center text-sm text-ts-muted"
              >
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {open !== null && shown[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ts-navy-900/95 p-4"
          onClick={() => setOpen(null)}
        >
          <img
            src={shown[open].src}
            alt={shown[open].alt || ''}
            className="max-h-[88vh] max-w-full rounded-md object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
          {(shown[open].caption || shown.length > 1) && (
            <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80">
              {shown[open].caption}
              {shown.length > 1 && <span className="ml-3 text-white/50">{open + 1} / {shown.length}</span>}
            </p>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Icon icon="lucide:x" className="h-6 w-6" />
          </button>
          {shown.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation()
                  step(-1)
                }}
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <Icon icon="lucide:chevron-left" className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation()
                  step(1)
                }}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <Icon icon="lucide:chevron-right" className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
