import type { SchoolData } from '@/types/school.types'
import { Eyebrow } from '../common/Bits'

/** Academics opener — a single measured column, no photo, as in the design. */
export default function AcademicsHero({ data }: { data: SchoolData }) {
  const academics = data.academics
  if (!academics) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-10 pt-12 md:px-8 lg:px-12 lg:pb-12 lg:pt-18">
      <div className="max-w-[900px]">
        <Eyebrow className="mb-5">{academics.subtitle || 'Academics'}</Eyebrow>
        <h1
          data-edit="academics.title"
          className="m-0 mb-6 text-[38px] leading-[1.02] tracking-[-0.04em] text-tf-ink sm:text-[52px] lg:text-[72px] lg:leading-none"
        >
          {academics.title}
        </h1>
        <p
          data-edit="academics.description"
          className="m-0 max-w-[60ch] text-[17px] leading-[1.6] text-tf-body lg:text-[19px]"
        >
          {academics.description}
        </p>
      </div>
    </section>
  )
}
