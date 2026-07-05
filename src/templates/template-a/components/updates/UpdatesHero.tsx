'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

export default function UpdatesHero({ data }: { data: SchoolData }) {
  const hero = data.updatesHero ?? {}
  return (
    <section className="relative bg-ta-surface pt-32 md:pt-40 pb-10 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Pill Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold inline-flex items-center gap-2"
          >
            <Icon icon="lucide:megaphone" className="text-sm" />
            <span data-edit="updatesHero.subtitle">{hero.subtitle ?? 'What’s Happening'}</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-(family-name:--font-ta-h1) text-4xl md:text-[56px] leading-[1.1] tracking-[-0.02em] font-extrabold text-ta-on-background max-w-2xl mx-auto"
              data-edit="updatesHero.title"
            >
              {hero.title ?? 'Stay In The Loop With Everything At School'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-(family-name:--font-ta-body-lg) text-[17px] leading-relaxed text-ta-on-surface-variant max-w-xl mx-auto"
              data-edit="updatesHero.description"
            >
              {hero.description ?? `Discover the latest news, upcoming academic deadlines, and vibrant campus events — your central hub for all ${data.name} updates.`}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <a href="#events">
              <button className="inline-flex items-center gap-2 bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 px-8 py-4">
                Browse Events
                <Icon icon="lucide:arrow-down" />
              </button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Wavy Divider Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="relative block w-full h-[50px] md:h-[80px] text-ta-surface-container-lowest fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,191.6,98.66,238.16,82.87,280.4,70.52,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  )
}
