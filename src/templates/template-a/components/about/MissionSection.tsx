'use client'

import { motion, type Variants } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
  }),
}

export default function MissionSection({ data }: { data: SchoolData }) {
  const vision = data.about.vision
  const mission = data.about.missionStatement
  if (!vision && !mission) return null

  const cards = [
    {
      key: 'vision',
      label: 'Our Vision',
      icon: 'lucide:telescope',
      text: vision,
      path: 'about.vision',
      tags: data.about.visionBadges ?? [],
      badgePath: 'about.visionBadges',
      decoratorPos: 'top-0 right-0 rounded-bl-full -mr-8 -mt-8',
    },
    {
      key: 'mission',
      label: 'Our Mission',
      icon: 'lucide:compass',
      text: mission,
      path: 'about.missionStatement',
      tags: data.about.missionBadges ?? [],
      badgePath: 'about.missionBadges',
      decoratorPos: 'bottom-0 right-0 rounded-tl-full -mr-10 -mb-10',
    },
  ].filter((c) => c.text)

  return (
    <section className="relative bg-ta-surface w-full overflow-hidden pb-16 md:pb-24">
      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-16 right-[10%] opacity-20 pointer-events-none hidden lg:block text-ta-tertiary-container"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon icon="lucide:rainbow" className="text-[120px]" />
      </motion.div>
      <motion.div
        className="absolute top-1/4 left-[5%] opacity-30 pointer-events-none text-ta-secondary"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon icon="lucide:star" className="text-[32px]" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-16 md:pt-24 mt-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-4 px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold inline-block">
            What Drives Us
          </div>
          <h2 className="font-(family-name:--font-ta-h2) text-4xl md:text-[--text-ta-h2] text-ta-on-surface mb-4 max-w-2xl mx-auto leading-tight">
            Our Vision & Mission
          </h2>
          <p className="font-(family-name:--font-ta-body-md) text-[--text-ta-body-md] text-ta-on-surface-variant max-w-[520px] mx-auto">
            At {data.name}, our purpose is deeply rooted in fostering an environment where spiritual growth meets academic excellence.
          </p>
        </motion.div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.key}
              className="bg-ta-surface-container border border-ta-outline-variant rounded-xl p-8 relative overflow-hidden group transition-all duration-300 shadow-sm flex flex-col h-full hover:border-ta-primary hover:shadow-md hover:-translate-y-1"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            >
              {/* Background decorator */}
              <div className={`absolute ${card.decoratorPos} w-32 h-32 bg-ta-primary opacity-5 z-0 transition-transform duration-500 group-hover:scale-125`} />

              <div className="relative z-10 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-ta-primary/10 rounded-full flex items-center justify-center mb-6 border border-ta-primary/20 shadow-sm">
                  <Icon
                    icon={card.icon}
                    className="text-3xl text-ta-primary transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="font-(family-name:--font-ta-h3) text-[--text-ta-h3] text-ta-on-surface mb-2">
                  {card.label}
                </h3>

                <div className="h-[3px] w-12 my-4 rounded-full bg-ta-primary opacity-80" />

                <p data-edit={card.path} className="font-(family-name:--font-ta-body-md) text-[--text-ta-body-md] text-ta-on-surface-variant mb-8 flex-grow leading-relaxed">
                  {card.text}
                </p>

                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {card.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        data-edit={`${card.badgePath}.${ti}`}
                        className="px-3 py-1 rounded-full font-(family-name:--font-ta-caption) text-[--text-ta-caption] border border-ta-primary/20 bg-ta-primary/5 text-ta-primary transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
