import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import { SectionHead } from '../common/Bits'
import { gridCols } from '@/shared/utils/grid'
import { shortDate } from '@/shared/utils/format'

/**
 * Three latest announcements as text-first cards — no images, so the row stays
 * calm next to the photo-heavy sections above it. Announcements are backend-owned
 * (they come from the school's Announcement records), so nothing here is inline
 * editable; the admin edits them where they live.
 */
export default function NewsSection({ data }: { data: SchoolData }) {
  const items = (data.updates?.announcements ?? []).slice(0, 3)
  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 md:px-8 lg:px-12 lg:pb-18 lg:pt-22">
      <SectionHead
        title={data.newsIntro?.title || "What's happening"}
        editPath="newsIntro.title"
        href="/updates"
        linkLabel="All news"
      />

      <div className={`grid gap-5 ${gridCols(items.length, 3)}`}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/updates/${item.id}`}
            className="flex min-h-[190px] flex-col gap-3.5 rounded-[20px] border border-td-border bg-td-card p-7 transition-colors hover:border-td-accent"
          >
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-td-accent">
              {shortDate(item.published_date)}
              {item.category ? ` · ${item.category}` : ''}
            </span>
            <span className="text-[20px] leading-[1.28] font-medium tracking-[-0.02em] text-td-ink">
              {item.title}
            </span>
            <span className="text-[14.5px] leading-[1.6] text-td-muted">
              {item.short_description || item.content?.replace(/<[^>]+>/g, '').slice(0, 140) || ''}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
