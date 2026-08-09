import type { SchoolData } from '@/types/school.types'
import { Eyebrow } from '../common/Bits'

/** News page opener. */
export default function UpdatesHero({ data }: { data: SchoolData }) {
  const hero = data.updatesHero

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-10 pt-12 md:px-8 lg:px-12 lg:pt-18">
      <div className="max-w-[860px]">
        <Eyebrow className="mb-5" data-edit="updatesHero.subtitle">
          {hero?.subtitle || 'News'}
        </Eyebrow>
        <h1
          data-edit="updatesHero.title"
          className="m-0 mb-6 text-[38px] leading-[1.02] tracking-[-0.04em] text-td-ink sm:text-[52px] lg:text-[72px] lg:leading-none"
        >
          {hero?.title || "What's happening"}
        </h1>
        <p
          data-edit="updatesHero.description"
          className="m-0 text-[17px] leading-[1.6] text-td-body lg:text-[19px]"
        >
          {hero?.description || 'Announcements, results, and the occasional thing worth writing down.'}
        </p>
      </div>
    </section>
  )
}
