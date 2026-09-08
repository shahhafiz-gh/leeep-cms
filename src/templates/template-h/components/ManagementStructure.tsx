import type { SchoolData } from '@/types/school.types'

/**
 * The school's organisation chart.
 *
 * It is one authored image rather than a rendered tree: the old site's chart
 * carries its own layout and typography, and redrawing it from data would be a
 * different chart. The school replaces the image when the structure changes.
 */
export default function ManagementStructure({ data }: { data: SchoolData }) {
  const image = data.about?.structureImage
  if (!image) return null

  return (
    <section className="bg-th-paper py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 data-edit="about.structureTitle" className="text-2xl font-bold text-th-heading md:text-3xl">
          {data.about?.structureTitle || 'Management Structure'}
        </h2>
        <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
        <div className="mt-10 overflow-x-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${data.name} management structure`}
            data-edit-img="about.structureImage"
            className="mx-auto h-auto max-w-full"
          />
        </div>
      </div>
    </section>
  )
}
