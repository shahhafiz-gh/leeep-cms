import type { SchoolData } from '@/types/school.types'
import { gridCols } from '@/shared/utils/grid'

/**
 * "By the numbers" — outlined stat cards (not the filled sand ones the home page
 * uses), so the two stat rows never read as the same section repeated.
 */
export default function ResultsSection({ data }: { data: SchoolData }) {
  const results = data.academics?.results
  if (!results || (results.stats ?? []).length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18">
      <h2
        data-edit="academics.results.title"
        className="m-0 mb-8 text-[32px] text-td-ink sm:text-[38px] lg:text-[42px]"
      >
        {results.title}
      </h2>

      <div className={`grid gap-5 ${gridCols(results.stats.length, 4, 2)}`}>
        {results.stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-[18px] border border-td-border p-7">
            <div
              data-edit={`academics.results.stats.${i}.value`}
              className="text-[34px] leading-none font-medium tracking-[-0.04em] text-td-ink tabular-nums lg:text-[42px]"
            >
              {stat.value}
            </div>
            <div
              data-edit={`academics.results.stats.${i}.label`}
              className="text-[14px] leading-[1.5] text-td-muted"
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
