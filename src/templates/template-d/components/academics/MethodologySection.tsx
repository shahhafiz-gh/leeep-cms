import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import { gridCols } from '../../lib/grid'

/**
 * "How we teach" — a sand panel whose steps sit as small paper cards inside it,
 * the design's pattern for a set of short related statements.
 */
export default function MethodologySection({ data }: { data: SchoolData }) {
  const method = data.academics?.methodology
  if (!method || (method.steps ?? []).length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-18">
      <div className="rounded-[28px] bg-td-panel px-7 py-12 md:px-12 lg:px-16 lg:py-15">
        <h2
          data-edit="academics.methodology.title"
          className="m-0 mb-3 text-[32px] text-td-ink sm:text-[38px] lg:text-[42px]"
        >
          {method.title}
        </h2>
        <p
          data-edit="academics.methodology.description"
          className="m-0 mb-9 max-w-[62ch] text-[16px] leading-[1.62] text-td-body lg:text-[17px]"
        >
          {method.description}
        </p>

        <div className={`grid gap-5 ${gridCols(method.steps.length, 4)}`}>
          {method.steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-2.5 rounded-[18px] bg-td-paper p-6">
              <Icon
                icon={step.icon || 'lucide:compass'}
                data-edit-icon={`academics.methodology.steps.${i}.icon`}
                className="h-5 w-5 text-td-accent"
              />
              <div
                data-edit={`academics.methodology.steps.${i}.title`}
                className="text-[18px] font-medium tracking-[-0.02em] text-td-ink"
              >
                {step.title}
              </div>
              <div
                data-edit={`academics.methodology.steps.${i}.description`}
                className="text-[14.5px] leading-[1.55] text-td-muted"
              >
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
