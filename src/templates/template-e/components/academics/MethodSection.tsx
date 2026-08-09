import type { SchoolData } from '@/types/school.types'
import { Container } from '../common/Bits'

/**
 * "How we teach" and the results register, both in the design's
 * [heading | body] two-column form so they read as further entries in the
 * academics list rather than as new sections.
 */
export default function MethodSection({ data }: { data: SchoolData }) {
  const method = data.academics?.methodology
  const results = data.academics?.results
  if (!method && !results) return null

  return (
    <Container className="flex flex-col gap-11 pt-12 pb-14 lg:gap-12 lg:pt-14 lg:pb-16">
      {method && (
        <div className="grid grid-cols-1 items-start gap-6 border-t border-te-rule pt-8 lg:grid-cols-[220px_1fr] lg:gap-11">
          <h2 data-edit="academics.methodology.title" className="m-0 text-[21px] text-te-ink sm:text-[24px]">
            {method.title}
          </h2>
          <div className="flex max-w-[640px] flex-col gap-4">
            <p
              data-edit="academics.methodology.description"
              className="m-0 text-[15px] leading-[1.65] text-te-body"
            >
              {method.description}
            </p>
            {(method.steps ?? []).length > 0 && (
              <dl className="m-0 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {method.steps.map((step, i) => (
                  <div key={i} className="border-t border-te-rule py-3">
                    <dt
                      data-edit={`academics.methodology.steps.${i}.title`}
                      className="font-(family-name:--font-te-serif) text-[16px] text-te-ink"
                    >
                      {step.title}
                    </dt>
                    <dd
                      data-edit={`academics.methodology.steps.${i}.description`}
                      className="m-0 mt-1 text-[14px] leading-[1.6] text-te-body"
                    >
                      {step.description}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}

      {results && (results.stats ?? []).length > 0 && (
        <div className="grid grid-cols-1 items-start gap-6 border-t border-te-rule pt-8 lg:grid-cols-[220px_1fr] lg:gap-11">
          <h2 data-edit="academics.results.title" className="m-0 text-[21px] text-te-ink sm:text-[24px]">
            {results.title}
          </h2>
          <div className="flex max-w-[640px] flex-col gap-4">
            {results.description && (
              <p
                data-edit="academics.results.description"
                className="m-0 text-[15px] leading-[1.65] text-te-body"
              >
                {results.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
              {results.stats.map((stat, i) => (
                <div key={i}>
                  <div
                    data-edit={`academics.results.stats.${i}.value`}
                    className="font-(family-name:--font-te-serif) text-[24px] text-te-ink tabular-nums sm:text-[28px]"
                  >
                    {stat.value}
                  </div>
                  <div
                    data-edit={`academics.results.stats.${i}.label`}
                    className="text-[13px] leading-snug text-te-muted"
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
