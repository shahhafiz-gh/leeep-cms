import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * "Our Departments" — the reference site's card row of programs.
 *
 * Written for this template rather than reusing Heritage's equivalent because
 * that one hardcodes Heritage's gold hexes instead of reading its own tokens,
 * so the `.template-h` remap cannot reach it and the cards would stay gold on a
 * brick-red site. Only three of Heritage's forty-two components have that
 * problem, and all three are home-page sections — its inner pages re-theme
 * correctly and are reused as-is.
 */
export default function ProgramsSection({ data }: { data: SchoolData }) {
  const programs = data.programs ?? []
  if (!programs.length || !isSectionVisible(data, 'programs')) return null

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p data-edit="programsIntro.title" className="text-xs font-semibold uppercase tracking-[0.2em] text-th-primary">
            {data.programsIntro?.title || 'Our Departments'}
          </p>
          <h2 data-edit="programsIntro.subtitle" className="mt-3 text-2xl font-bold text-th-heading md:text-3xl">
            {data.programsIntro?.subtitle || 'A programme for every stage of learning'}
          </h2>
          <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <article
              key={program.id || `${program.name}-${i}`}
              className="group flex flex-col border border-th-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-th-primary hover:shadow-[0_16px_40px_rgba(185,71,59,0.12)]"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-th-primary-50 text-th-primary transition-colors group-hover:bg-th-primary group-hover:text-white">
                <Icon icon="lucide:book-open" className="h-6 w-6" />
              </span>
              <h3
                data-edit={`programs.${i}.name`}
                className="mt-5 text-lg font-semibold text-th-heading"
              >
                {program.name}
              </h3>
              {program.grade_range && (
                <p
                  data-edit={`programs.${i}.grade_range`}
                  className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-th-primary"
                >
                  {program.grade_range}
                </p>
              )}
              {program.description && (
                <p
                  data-edit={`programs.${i}.description`}
                  className="mt-3 flex-1 text-sm leading-7 text-th-body"
                >
                  {program.description}
                </p>
              )}
              {(program.features ?? []).length > 0 && (
                <ul className="mt-5 space-y-2">
                  {(program.features ?? []).map((feature, f) => (
                    <li key={`${feature}-${f}`} className="flex items-start gap-2 text-sm text-th-body">
                      <Icon icon="lucide:check" className="mt-1 h-3.5 w-3.5 shrink-0 text-th-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/academics"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-th-primary"
              >
                Read more
                <Icon icon="lucide:arrow-right" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
