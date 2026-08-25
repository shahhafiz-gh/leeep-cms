import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { gridCols } from '@/shared/utils/grid'
import { shortDate } from '@/shared/utils/format'

/**
 * The announcements feed: the newest item runs as a wide featured panel, the
 * rest as a card grid — the design's two-tier treatment, which needs no editing
 * affordances because announcements are backend records, not blob content.
 */
export default function AnnouncementsList({ data }: { data: SchoolData }) {
  const announcements = data.updates?.announcements ?? []
  if (announcements.length === 0) return null

  const [featured, ...rest] = announcements

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-10 md:px-8 lg:px-12">
        <Link
          href={`/updates/${featured.id}`}
          className="grid grid-cols-1 items-stretch overflow-hidden rounded-[24px] bg-tf-panel lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="flex flex-col justify-center gap-4 px-7 py-10 md:px-12 lg:px-14 lg:py-13">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-tf-accent">
              {[shortDate(featured.published_date), 'Featured'].filter(Boolean).join(' · ')}
            </span>
            <h2 className="m-0 text-[28px] leading-[1.1] text-tf-ink sm:text-[34px] lg:text-[40px]">
              {featured.title}
            </h2>
            <p className="m-0 line-clamp-3 text-[16px] leading-[1.62] text-tf-body lg:text-[16.5px]">
              {featured.short_description || featured.content?.replace(/<[^>]+>/g, '').slice(0, 260) || ''}
            </p>
            <span className="text-[14px] font-semibold text-tf-accent">Click here to read more →</span>
          </div>
          <Photo
            fill
            src={featured.thumbnail}
            alt={featured.title}
            caption="photo — featured announcement"
            rounded="rounded-none"
            className="h-[220px] w-full lg:h-auto lg:min-h-[300px]"
          />
        </Link>
      </section>

      {rest.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18">
          <div className={`grid gap-5 ${gridCols(rest.length, 3)}`}>
            {rest.map((item) => (
              <Link
                key={item.id}
                href={`/updates/${item.id}`}
                className="flex flex-col overflow-hidden rounded-[20px] border border-tf-border bg-tf-card transition-colors hover:border-tf-accent"
              >
                <Photo
                  src={item.thumbnail}
                  alt={item.title}
                  caption="photo"
                  rounded="rounded-none"
                  className="h-[170px] w-full"
                />
                <div className="flex flex-col gap-3 p-6">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-tf-accent">
                    {[shortDate(item.published_date), item.category].filter(Boolean).join(' · ')}
                  </span>
                  <span className="text-[20px] leading-[1.28] font-medium tracking-[-0.022em] text-tf-ink">
                    {item.title}
                  </span>
                  <span className="line-clamp-2 text-[14.5px] leading-[1.6] text-tf-muted">
                    {item.short_description || item.content?.replace(/<[^>]+>/g, '').slice(0, 160) || ''}
                  </span>
                  <span className="text-[13.5px] font-semibold text-tf-accent">Click here to read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
