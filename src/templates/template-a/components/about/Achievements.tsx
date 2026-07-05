'use client'

import { motion, type Variants } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

const ICONS = [
  'lucide:award',
  'lucide:beaker',
  'lucide:star',
  'lucide:leaf',
  'lucide:cpu',
  'lucide:trophy',
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' },
  }),
}

export default function Achievements({ data }: { data: SchoolData }) {
  const items = data.about.achievements ?? []
  if (items.length === 0) return null

  return (
    <section className="py-16  md:pt- md:pb-34 bg-ta-surface-container-lowest">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-4 px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold inline-block">
            Milestones
          </div>
          <h2 data-edit="about.achievementsTitle" className="font-(family-name:--font-ta-h2) text-4xl md:text-[--text-ta-h2] text-ta-on-surface mb-3 leading-tight">
            {data.about.achievementsTitle ?? 'Our Achievements'}
          </h2>
          <p data-edit="about.achievementsDescription" className="font-(family-name:--font-ta-body-md) text-[--text-ta-body-md] text-ta-on-surface-variant max-w-[520px]">
            {data.about.achievementsDescription ??
              `A proud legacy of accomplishments that reflect the dedication of our students, faculty, and the ${data.name} community.`}
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-ta-surface-container-lowest rounded-3xl border border-ta-outline-variant p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-md group"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            >
              <div className="w-16 h-16 bg-ta-surface-container-high rounded-full flex items-center justify-center mb-4 group-hover:bg-ta-primary transition-colors duration-500">
                <Icon
                  icon={item.icon ?? ICONS[index % ICONS.length]}
                  className="text-ta-primary group-hover:text-ta-on-primary text-[28px] transition-colors duration-500"

                />
              </div>

              <h3 data-edit={`about.achievements.${index}.title`} className="font-(family-name:--font-ta-h3) text-[18px] leading-tight text-ta-on-surface mb-2 font-bold">
                {item.title}
              </h3>

              <p data-edit={`about.achievements.${index}.description`} className="font-(family-name:--font-ta-caption) text-[--text-ta-caption] text-ta-on-surface-variant mb-4">
                {item.description}
              </p>

              {item.year && (
                <span data-edit={`about.achievements.${index}.year`} className="mt-auto inline-block font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold text-ta-primary bg-ta-primary/5 rounded-full px-4 py-1">
                  {item.year}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
