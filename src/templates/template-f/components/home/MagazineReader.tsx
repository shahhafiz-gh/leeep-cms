'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import type { MagazineIssue } from '@/types/school.types'

/**
 * Full-screen reader for a magazine issue held as one image per page.
 *
 * A school's magazine is very often a scan — dozens of page images and no
 * hosted PDF — so "open the issue" cannot just be an outbound link. This reads
 * the issue in place: one page at a time, with the controls a reader expects
 * (arrows, keyboard, swipe, a scrubber for a long issue) and a download for
 * anyone who would rather have the whole thing.
 *
 * ONLY the current page and its two neighbours are ever in the DOM. At ~350KB a
 * page and issues running past seventy pages, rendering the set would pull tens
 * of megabytes on open; keeping a three-page window means a jump costs one image
 * and paging forward costs nothing, because the next page was already fetched.
 */
export default function MagazineReader({
  issue,
  onClose,
}: {
  issue: MagazineIssue
  onClose: () => void
}) {
  const pages = issue.pages ?? []
  const [index, setIndex] = useState(0)
  // Which page images have finished decoding. Paging with the arrows lands on an
  // already-fetched neighbour, but a jump with the scrubber does not — without
  // this the reader would show an empty dark frame for as long as the fetch takes.
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set())
  const total = pages.length

  const go = useCallback(
    (next: number) => setIndex((i) => Math.min(total - 1, Math.max(0, next === -1 ? i : next))),
    [total],
  )
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total])

  // Keyboard: arrows page, Escape closes. Bound to the document because focus
  // may sit on any of the controls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') next()
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev()
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(total - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, next, prev, go, total])

  // The page behind the overlay must not scroll while the reader is open,
  // otherwise a swipe or wheel scrolls the site instead of the issue.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Touch paging. A horizontal move of at least 50px counts as a swipe; the
  // vertical guard stops a scroll gesture from flipping the page by accident.
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return
    if (dx < 0) next()
    else prev()
  }

  if (total === 0) return null

  const atStart = index === 0
  const atEnd = index === total - 1

  const navButton =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tf-ink-soft text-tf-on-ink ring-1 ring-tf-ink-line transition-colors hover:bg-tf-accent hover:ring-tf-accent disabled:pointer-events-none disabled:opacity-30'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${issue.title} — page ${index + 1} of ${total}`}
      className="fixed inset-0 z-[100] flex flex-col bg-tf-ink"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Bar — title, page count, download, close. */}
      <div className="flex shrink-0 items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] font-medium text-tf-on-ink">{issue.title}</span>
          <span className="text-[12px] tracking-[0.1em] text-tf-on-ink-faint uppercase">
            Page {index + 1} of {total}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {issue.downloadUrl && (
            <a
              href={issue.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-tf-ink-soft px-4 py-2.5 text-[13.5px] font-medium text-tf-on-ink ring-1 ring-tf-ink-line transition-colors hover:bg-tf-accent hover:ring-tf-accent"
            >
              <Icon icon="lucide:download" className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the magazine"
            className={navButton}
          >
            <Icon icon="lucide:x" className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* The page itself. `min-h-0` lets this row shrink so the image is bounded
          by the viewport rather than pushing the controls off the bottom. */}
      <div className="relative flex min-h-0 grow items-center justify-center px-2 md:px-6">
        {!loaded.has(pages[index]) && (
          <Icon
            icon="lucide:loader-2"
            aria-hidden
            className="absolute h-7 w-7 animate-spin text-tf-on-ink-faint"
          />
        )}
        {pages.map((src, i) =>
          // The three-page window. Neighbours are mounted but hidden, so they are
          // already decoded by the time the reader pages onto them.
          Math.abs(i - index) > 1 ? null : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={i === index ? `${issue.title}, page ${i + 1}` : ''}
              aria-hidden={i === index ? undefined : true}
              // The first page is the one the reader opens on, so it is the only
              // one worth fetching eagerly.
              loading={i === 0 ? 'eager' : 'lazy'}
              onLoad={() => setLoaded((seen) => (seen.has(src) ? seen : new Set(seen).add(src)))}
              draggable={false}
              className={`max-h-full max-w-full object-contain shadow-[0_18px_60px_-20px_rgba(0,0,0,0.6)] ${
                i === index ? '' : 'pointer-events-none absolute opacity-0'
              }`}
            />
          ),
        )}
      </div>

      {/* Controls. The scrubber only earns its space on a long issue — below a
          dozen pages the arrows already reach every page in a few taps. */}
      <div className="flex shrink-0 items-center gap-3 px-4 py-4 md:gap-5 md:px-6">
        <button type="button" onClick={prev} disabled={atStart} aria-label="Previous page" className={navButton}>
          <Icon icon="lucide:chevron-left" className="h-5 w-5" aria-hidden />
        </button>

        {total > 12 ? (
          <input
            type="range"
            min={0}
            max={total - 1}
            value={index}
            onChange={(e) => go(Number(e.target.value))}
            aria-label="Jump to page"
            className="h-1.5 grow cursor-pointer appearance-none rounded-full bg-tf-ink-line accent-tf-accent"
          />
        ) : (
          <span className="grow" />
        )}

        <button type="button" onClick={next} disabled={atEnd} aria-label="Next page" className={navButton}>
          <Icon icon="lucide:chevron-right" className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
