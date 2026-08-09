import Link from 'next/link'
import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { Container } from '../common/Bits'
import { longDate } from '@/shared/utils/format'

/**
 * The news register: ruled rows of [date + category | headline + standfirst |
 * photograph], which is how a printed school bulletin sets its contents page.
 *
 * Announcements are backend records, so nothing here is inline editable — the
 * admin maintains them where they live.
 */
export default function NewsList({ data }: { data: SchoolData }) {
  const items = data.updates?.announcements ?? []
  if (items.length === 0) return null

  return (
    <Container className="pt-9">
      <div className="flex flex-col">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/updates/${item.id}`}
            className="group grid grid-cols-1 items-start gap-4 border-t border-te-rule py-7 last:border-b lg:grid-cols-[150px_1fr_260px] lg:gap-9"
          >
            <div>
              <div className="text-[13px] text-te-muted">{longDate(item.published_date)}</div>
              {item.category && (
                <div className="mt-1 text-[12px] uppercase tracking-[0.1em] text-te-accent">
                  {item.category}
                </div>
              )}
            </div>

            <div>
              <h2 className="m-0 text-[20px] leading-[1.3] text-te-ink group-hover:underline sm:text-[24px]">
                {item.title}
              </h2>
              {(item.short_description || item.content) && (
                <p className="m-0 mt-2.5 text-[14.5px] leading-[1.65] text-te-body">
                  {item.short_description || item.content?.replace(/<[^>]+>/g, '').slice(0, 220)}
                </p>
              )}
            </div>

            <Photo
              src={item.thumbnail}
              alt={item.title}
              caption="photo"
              className="h-[160px] w-full lg:h-[150px]"
            />
          </Link>
        ))}
      </div>
    </Container>
  )
}
