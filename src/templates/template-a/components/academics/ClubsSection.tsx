import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

const ICONS =['lucide:flask-conical', 'lucide:book-marked', 'lucide:volleyball', 'lucide:palette', 'lucide:music', 'lucide:cpu']

export default function ClubsSection({ data }: { data: SchoolData }) {
  const clubs = data.academics.clubs ?? []
  if (clubs.length === 0) return null

  return (
    <section className="py-16 md:py-24 mb-10 bg-ta-surface-container-lowest">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14 flex flex-col items-center">
          <ScrollReveal>
            <div className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md mb-4 inline-block font-medium">
              Beyond the Classroom
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 data-edit="academics.clubsTitle" className="font-(family-name:--font-ta-h2) text-3xl md:text-[40px] text-ta-on-surface mb-4 leading-tight tracking-tight">
              {data.academics.clubsTitle ?? 'Clubs & Activities'}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p data-edit="academics.clubsDescription" className="font-(family-name:--font-ta-body-md) text-lg text-ta-on-surface-variant max-w-[520px]">
              {data.academics.clubsDescription ?? 'Co-curricular programs that nurture talent, teamwork, and character beyond academics.'}
            </p>
          </ScrollReveal>
        </div>

        <StaggerChildren stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.map((club, index) => (
            <div
              key={club.name}
              className="group bg-ta-surface rounded-3xl border border-ta-outline-variant overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-40 w-full overflow-hidden bg-ta-surface-container">
                {club.image ? (
                  <Image src={club.image} alt={club.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" data-edit-img={`academics.clubs.${index}.image`} />
                ) : (
                  <ImagePlaceholder label="Add image" icon={ICONS[index % ICONS.length]} editPath={`academics.clubs.${index}.image`} />
                )}
                <div className="absolute bottom-3 left-3 w-11 h-11 rounded-full bg-ta-surface/90 backdrop-blur flex items-center justify-center shadow-sm">
                  <Icon icon={ICONS[index % ICONS.length]} className="text-xl text-ta-primary" />
                </div>
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 data-edit={`academics.clubs.${index}.name`} className="font-(family-name:--font-ta-h3) text-ta-h4 text-ta-on-surface mb-2 leading-tight">
                  {club.name}
                </h3>
                <p data-edit={`academics.clubs.${index}.description`} className="font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant grow">
                  {club.description}
                </p>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
