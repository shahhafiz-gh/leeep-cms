import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

const GRADIENTS = [
  'from-amber-500 to-orange-500',
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-purple-500 to-pink-500',
  'from-rose-500 to-red-500',
  'from-cyan-500 to-blue-500',
]

const ICONS = [
  'lucide:trophy',
  'lucide:medal',
  'lucide:award',
  'lucide:users',
  'lucide:graduation-cap',
  'lucide:heart-handshake',
]

export default function Achievements({ data }: { data: SchoolData }) {
  const items = data.about.achievements ?? []
  if (items.length === 0) return null

  return (
    <div className="pt-16 md:pt-24 pb-24 bg-tb-primary-400 relative overflow-hidden">
      {/* Decorative blur blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-12">
          <h3 data-edit="about.achievementsTitle" className="text-3xl font-bold text-white">
            {data.about.achievementsTitle ?? 'Our Achievements'}
          </h3>
          <p data-edit="about.achievementsDescription" className="text-white text-lg mt-4 max-w-2xl mx-auto">
            {data.about.achievementsDescription ??
              `A proud legacy of accomplishments that reflect the dedication of our students, faculty, and the ${data.name} community.`}
          </p>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {items.map((item, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length]
            const icon = item.icon ?? ICONS[index % ICONS.length]
            return (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-2xl p-8 h-full hover:-translate-y-2 transition-all duration-500 group hover:shadow-2xl relative overflow-hidden flex flex-col"
              >
                {/* Glow on hover */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`} />

                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 relative z-10 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-100 transition-opacity duration-500`} />
                  <Icon
                    icon={icon}
                    className="w-8 h-8 text-black group-hover:text-white relative z-10 drop-shadow-sm"

                  />
                </div>

                <h5 data-edit={`about.achievements.${index}.title`} className="text-xl font-semibold text-black mb-4 transition-all duration-300 relative z-10">
                  {item.title}
                </h5>
                <p data-edit={`about.achievements.${index}.description`} className="text-black/80 leading-relaxed text-base relative z-10 flex-grow">
                  {item.description}
                </p>

                {item.year && (
                  <span data-edit={`about.achievements.${index}.year`} className="mt-4 inline-block text-sm font-semibold text-tb-body relative z-10">
                    {item.year}
                  </span>
                )}

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${gradient} group-hover:w-full transition-all duration-700 ease-out opacity-0 group-hover:opacity-100`} />
              </div>
            )
          })}
        </StaggerChildren>
      </div>
    </div>
  )
}
