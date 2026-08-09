import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { Container, PageIntro } from '../common/Bits'

/**
 * About opener: the school's account of itself in running prose, then a pair of
 * photographs. The mission statement is set in the serif italic — the design's
 * device for quoting a school's own charge back to it.
 */
export default function AboutIntro({ data }: { data: SchoolData }) {
  const about = data.about
  if (!about) return null

  return (
    <Container className="flex flex-col gap-10 pt-10 sm:pt-12 lg:gap-12 lg:pt-14">
      <PageIntro title={about.title} titlePath="about.title" lede={about.description} ledePath="about.description">
        {about.missionStatement && (
          <p
            data-edit="about.missionStatement"
            className="m-0 font-(family-name:--font-te-serif) text-[17px] leading-[1.7] text-te-body italic sm:text-[18px]"
          >
            &ldquo;{about.missionStatement}&rdquo;
          </p>
        )}
      </PageIntro>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        <Photo
          src={about.heroImage}
          alt={about.title}
          caption="photo: the main building"
          editPath="about.heroImage"
          className="h-[220px] w-full sm:h-[300px]"
        />
        <Photo
          src={about.image}
          alt={about.title}
          caption="photo: archival image, an early class"
          editPath="about.image"
          className="h-[220px] w-full sm:h-[300px]"
        />
      </div>
    </Container>
  )
}
