'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

const scrollToForm = () => {
  document.getElementById('admission-application-form')?.scrollIntoView({ behavior: 'smooth' })
}

const handleDownloadForm = () => {
  window.print()
}

export default function AdmissionsHero({ data }: { data: SchoolData }) {
  const { admissions } = data

  return (
    <section className="relative bg-ta-surface-container-low pt-32 md:pt-40 pb-12 md:pb-20 border-b border-ta-outline-variant overflow-hidden print:hidden">
      {/* Abstract background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-ta-surface-container opacity-50 rounded-bl-[100px] -z-0" />

      <div className="container mx-auto px-4 md:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-fit mb-4 px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold inline-block"
          >
            {admissions.subtitle ?? 'Join Us'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-(family-name:--font-ta-h1) text-4xl md:text-[56px] leading-[1.1] tracking-[-0.02em] font-extrabold text-ta-on-surface max-w-2xl mb-5"
          >
            {admissions.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-(family-name:--font-ta-body-lg) text-ta-body-md md:text-ta-body-lg text-ta-on-surface-variant mb-8 max-w-xl"
          >
            {admissions.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform px-8 py-4"
            >
              Start Application
            </button>
            <button
              onClick={handleDownloadForm}
              className="inline-flex items-center gap-2 border border-ta-outline text-ta-on-surface font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full hover:bg-ta-surface-container transition-colors px-8 py-4"
            >
              Download Form
            </button>
          </motion.div>

          {admissions.highlights && admissions.highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 border-t border-ta-outline-variant pt-6"
            >
              {admissions.highlights.map((highlight) => (
                <div key={highlight.label} className="flex items-center gap-2">
                  <Icon icon={highlight.icon ?? 'lucide:check'} className="text-ta-primary text-xl" />
                  <span className="font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant">{highlight.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Hero image */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-[110%] h-[110%] bg-ta-secondary-container rounded-[40%_60%_70%_30%/40%_50%_60%_50%] z-0"
          />
          <div className="relative h-[300px] w-full max-w-[500px] lg:h-[400px] rounded-xl border border-ta-outline-variant bg-ta-surface-container-highest z-10">
            <div className="w-full h-full rounded-xl overflow-hidden">
              {admissions.image ? (
                <img alt="Admissions" className="w-full h-full object-cover" src={admissions.image} data-edit-img="admissions.image" />
              ) : (
                <ImagePlaceholder label="Add admissions image" icon="lucide:graduation-cap" editPath="admissions.image" />
              )}
            </div>

            {admissions.callout && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 -left-6 md:-left-12 bg-ta-surface-container-lowest border border-ta-outline-variant rounded-lg p-4 shadow-sm max-w-[200px] flex items-center gap-3 z-20"
              >
                <Icon icon={admissions.callout.icon ?? 'lucide:users'} className="text-ta-secondary-container bg-ta-secondary-container/20 p-2 rounded-full text-4xl" />
                <div>
                  <div className="font-(family-name:--font-ta-caption) text-xs font-bold text-ta-on-surface">{admissions.callout.label}</div>
                  {admissions.callout.sublabel && (
                    <div className="font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant">{admissions.callout.sublabel}</div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
