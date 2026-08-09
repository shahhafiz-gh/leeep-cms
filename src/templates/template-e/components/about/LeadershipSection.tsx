'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { gridCols } from '@/shared/utils/grid'
import Photo from '../common/Photo'
import { Container } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'

/**
 * Leadership portraits. Uses the school's `faculty` list — the first few
 * entries, since a school orders that list with its head and division heads at
 * the top — rather than asking for the same people to be entered twice.
 */
export default function LeadershipSection({ data }: { data: SchoolData }) {
  const faculty = useLiveList('faculty', data.faculty ?? [])
  const leaders = faculty.slice(0, 6)
  if (leaders.length === 0) return null

  return (
    <Container>
      {/* The rule sits INSIDE the container's gutter, not on the container
          itself — on the container it would run the full 1120px including the
          padding and overhang every other rule on the page. */}
      <div className="grid grid-cols-1 items-start gap-6 border-t border-te-rule pt-11 lg:grid-cols-[280px_1fr] lg:gap-14 lg:pt-12">
        <h2 className="m-0 text-[22px] text-te-ink sm:text-[26px]">Leadership</h2>
        <div>
          <div className={`grid gap-8 ${gridCols(leaders.length, 3)}`}>
            {leaders.map((person, i) => (
              <div key={person.id || i} className="flex flex-col gap-3">
                <Photo
                  src={person.image}
                  alt={person.name}
                  caption="portrait"
                  editPath={`faculty.${i}.image`}
                  className="h-[180px] w-full"
                />
                <div>
                  <div
                    data-edit={`faculty.${i}.name`}
                    className="font-(family-name:--font-te-serif) text-[17px] text-te-ink"
                  >
                    {person.name}
                  </div>
                  <div data-edit={`faculty.${i}.designation`} className="text-[13px] text-te-muted">
                    {person.designation}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AddItemButton path="faculty" label="Add staff member" />
        </div>
      </div>
    </Container>
  )
}
