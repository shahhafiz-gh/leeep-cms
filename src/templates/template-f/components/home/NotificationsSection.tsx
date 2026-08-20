'use client'

import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { Eyebrow } from '../common/Bits'

/**
 * Almanac's "Latest notifications" band — the block that stands where Quill and
 * the other templates put a stats row.
 *
 * A school noticeboard is the thing families actually come back for, so on this
 * template it takes the position of highest attention on the page and the stats
 * move off the home page entirely (they still fill the About header).
 *
 * The notices are NOT authored here. They are the published Website
 * Announcements the server folds onto `updates.announcements` — pinned first,
 * then newest — so a notice is written once and appears both here and on
 * /updates. `data.notifications` only frames them.
 *
 * Three layouts, because a school posting twice a term and one posting twice a
 * day want different things: `ticker` for a busy board, `list` for a quiet one,
 * `cards` when the notices carry a description worth reading at a glance.
 */
export default function NotificationsSection({ data }: { data: SchoolData }) {
  const cfg = data.notifications
  // Server-owned, but useLiveList still lets the builder push a reordered array
  // into the preview without a reload.
  const all = useLiveList('updates.announcements', data.updates?.announcements ?? [])

  // `limit` arrives from a builder select as a STRING ("4"). Number('') is 0 and
  // Number(undefined) is NaN — both falsy — so this falls back rather than
  // silently emptying the band.
  const limit = Number(cfg?.limit) || 5
  const items = all.slice(0, limit)
  const layout = cfg?.layout || 'ticker'
  const heading = cfg?.title || 'Latest notifications'

  /** Short date. Guarded because `published_date` is a backend string that may
   *  be absent or unparseable; an "Invalid Date" must never reach the page. */
  const dateOf = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return Number.isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  // Nothing published yet. Say so if the school wrote a fallback line; otherwise
  // drop the band rather than leaving a heading over emptiness.
  if (items.length === 0) {
    if (!cfg?.emptyText) return null
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 lg:px-12">
        <p
          data-edit="notifications.emptyText"
          className="m-0 rounded-[18px] bg-tf-panel px-7 py-6 text-[15px] text-tf-muted"
        >
          {cfg.emptyText}
        </p>
      </section>
    )
  }

  /* ── Ticker ────────────────────────────────────────────────────────────────
     The track is duplicated and translated exactly -50%, so the loop is seamless.
     The duplicate is aria-hidden and untabbable: a screen reader and the tab
     order should each meet every notice once, not twice. */
  if (layout === 'ticker') {
    const row = (clone = false) => (
      <div key={clone ? 'clone' : 'original'} className="flex shrink-0" aria-hidden={clone || undefined}>
        {items.map((n, i) => (
          <Link
            key={`${n.id}-${i}`}
            href={`/updates#${n.id}`}
            tabIndex={clone ? -1 : undefined}
            className="flex items-baseline gap-3 border-r border-tf-border px-6 py-4 text-[14.5px] whitespace-nowrap text-tf-ink transition-colors hover:bg-tf-panel"
          >
            <span className="shrink-0 text-[12.5px] tracking-[0.04em] text-tf-faint tabular-nums">
              {dateOf(n.published_date)}
            </span>
            {n.is_pinned && (
              <span className="shrink-0 text-[12px] font-semibold tracking-[0.12em] uppercase text-tf-accent">
                Pinned
              </span>
            )}
            <span>{n.title}</span>
          </Link>
        ))}
      </div>
    )

    return (
      <section className="border-y border-tf-border bg-tf-card" aria-label={heading}>
        <div className="group flex items-stretch">
          <div className="flex shrink-0 items-center bg-tf-accent px-5 text-[12px] font-bold tracking-[0.15em] whitespace-nowrap uppercase text-white">
            Latest
          </div>
          <div className="relative flex min-w-0 flex-1 items-center overflow-hidden">
            <div className="tf-ticker flex w-max group-hover:[animation-play-state:paused]">
              {row()}
              {row(true)}
            </div>
          </div>
          <Link
            href="/updates"
            className="hidden shrink-0 items-center border-l border-tf-border px-5 text-[13px] font-semibold whitespace-nowrap text-tf-ink transition-colors hover:text-tf-accent sm:flex"
          >
            {cfg?.cta?.label || 'All updates'} →
          </Link>
        </div>
      </section>
    )
  }

  /* ── List / cards ─────────────────────────────────────────────────────── */
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 lg:px-12 lg:py-14">
      <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          {cfg?.subtitle && <Eyebrow data-edit="notifications.subtitle">{cfg.subtitle}</Eyebrow>}
          <h2
            data-edit="notifications.title"
            className="max-w-[16ch] text-[34px] leading-[1.05] text-tf-ink sm:text-[42px] lg:text-[52px]"
          >
            {heading}
          </h2>
        </div>
        <Link
          href="/updates"
          className="shrink-0 text-[15px] font-semibold text-tf-ink transition-colors hover:text-tf-accent"
        >
          {cfg?.cta?.label || 'All updates'} →
        </Link>
      </div>

      {layout === 'cards' ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n, i) => (
            <Link
              key={`${n.id}-${i}`}
              href={`/updates#${n.id}`}
              className="flex flex-col gap-3 rounded-[18px] bg-tf-panel p-7 transition-opacity hover:opacity-90"
            >
              <span className="text-[12.5px] tracking-[0.04em] text-tf-faint tabular-nums">
                {dateOf(n.published_date)}
              </span>
              <span className="text-[19px] leading-[1.3] font-medium tracking-[-0.02em] text-tf-ink">
                {n.title}
              </span>
              {n.short_description && (
                <span className="text-[14.5px] leading-[1.55] text-tf-muted">
                  {n.short_description}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-t border-tf-border">
          {items.map((n, i) => (
            <Link
              key={`${n.id}-${i}`}
              href={`/updates#${n.id}`}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-1 border-b border-tf-border px-1 py-5 transition-colors hover:bg-tf-panel sm:grid-cols-[7rem_1fr]"
            >
              <span className="text-[13px] tracking-[0.04em] text-tf-faint tabular-nums">
                {dateOf(n.published_date)}
              </span>
              <span className="text-[17px] leading-[1.4] text-tf-ink lg:text-[19px]">
                {n.is_pinned && (
                  <span className="mr-2 text-[12px] font-semibold tracking-[0.12em] uppercase text-tf-accent">
                    Pinned
                  </span>
                )}
                {n.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
