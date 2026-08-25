import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { Eyebrow } from '../common/Bits'

/**
 * The "from the head of school" spread: a portrait beside a serif mission
 * statement and a plainer vision paragraph beneath it. Two voices, one column —
 * the design's device for making an institutional statement read as a person's.
 */
export default function MissionSection({ data }: { data: SchoolData }) {
  const about = data.about
  if (!about?.missionStatement && !about?.vision) return null

  return (
    <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-12 lg:pb-22">
      <Photo
        src={about.image}
        alt={about.title}
        caption="portrait — head of school"
        editPath="about.image"
        fit="contain"
        className="h-[300px] w-full lg:h-[400px]"
      />

      <div className="flex flex-col gap-5">
        <Eyebrow>Our mission</Eyebrow>
        {about.missionStatement && (
          <p
            data-edit="about.missionStatement"
            className="td-serif m-0 text-[21px] leading-[1.45] text-td-ink lg:text-[26px]"
          >
            {about.missionStatement}
          </p>
        )}
        {about.vision && (
          <p data-edit="about.vision" className="m-0 text-[16px] leading-[1.65] text-td-body">
            {about.vision}
          </p>
        )}
        {about.subtitle && (
          <div data-edit="about.subtitle" className="text-[15px] text-td-muted">
            {about.subtitle}
          </div>
        )}
      </div>
    </section>
  )
}
