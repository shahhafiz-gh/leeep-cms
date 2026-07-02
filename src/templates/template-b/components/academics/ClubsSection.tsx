import type { SchoolData } from '@/types/school.types'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

const ICONS = ['lucide:cpu', 'lucide:mic', 'lucide:palette', 'lucide:volleyball', 'lucide:music', 'lucide:book-marked']

/** Template B — Clubs & Activities (image cards) */
export default function ClubsSection({ data }: { data: SchoolData }) {
  const clubs = data.academics.clubs ?? []
  if (clubs.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">
            Beyond the Classroom
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-4">Clubs &amp; Activities</h2>
          <p className="text-tb-body text-lg max-w-2xl mx-auto leading-relaxed">
            A vibrant co-curricular life that helps every student discover and develop their passions.
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.map((club, index) => (
            <div
              key={club.name}
              className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer"
            >
              {club.image ? (
                <img
                  src={club.image}
                  alt={club.name}
                  data-edit-img={`academics.clubs.${index}.image`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-tb-primary-100" data-edit-img={`academics.clubs.${index}.image`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="w-11 h-11 rounded-full bg-tb-primary-400 flex items-center justify-center mb-3">
                  <Icon icon={ICONS[index % ICONS.length]} className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">{club.name}</h3>
                <p className="text-white/75 text-sm leading-snug">{club.description}</p>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
