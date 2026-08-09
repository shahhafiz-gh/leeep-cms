import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { Eyebrow } from '../common/Bits'

/** About page opener — eyebrow, display headline, standfirst, archive photo. */
export default function AboutHero({ data }: { data: SchoolData }) {
  const about = data.about
  if (!about) return null

  return (
    <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-10 px-5 pb-12 pt-12 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:pb-14 lg:pt-18">
      <div>
        <Eyebrow className="mb-5">About</Eyebrow>
        <h1
          data-edit="about.title"
          className="m-0 mb-6 text-[38px] leading-[1.02] tracking-[-0.04em] text-td-ink sm:text-[52px] lg:text-[72px] lg:leading-none"
        >
          {about.title}
        </h1>
        <p
          data-edit="about.description"
          className="m-0 max-w-[56ch] text-[17px] leading-[1.6] text-td-body lg:text-[19px]"
        >
          {about.description}
        </p>
      </div>

      <Photo
        src={about.heroImage}
        alt={about.title}
        caption="photo — the school, past or present"
        editPath="about.heroImage"
        className="h-[280px] w-full lg:h-[380px]"
      />
    </section>
  )
}
