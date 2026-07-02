'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

const viewport = { once: true, margin: '0px 0px -20% 0px' } as const

export default function AdmissionsSection({ data }: { data: SchoolData }) {
  const currentYear = new Date().getFullYear()
  const prevYear = currentYear - 1
  const session = `${prevYear}–${currentYear.toString().slice(-2)}`

  // Real Frappe blobs may omit the whole `admissions` slice — guard it.
  const admissions = data.admissions ?? {}
  const highlights = admissions.highlights ?? []

  return (
    <section
      id="admissions"
      className="relative w-full py-20 bg-ta-primary overflow-hidden mt-(--spacing-ta-xl)] pb-20"
    >
      <div className="max-w-[1280px] mx-auto px-(--spacing-ta-margin)] relative z-20 pt-(--spacing-ta-xxl)] pb-(--spacing-ta-xxl)]">
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-white rounded-full opacity-60" />
        <Icon icon="lucide:star" className="absolute top-1/4 left-1/3 w-12 h-12 opacity-50 text-white" />
        <Icon icon="lucide:star" className="absolute bottom-1/4 right-1/3 w-8 h-8 opacity-40 text-white" />

        <div className="flex flex-col md:flex-row items-center gap-(--spacing-ta-xxl)]">
          {/* Content */}
          <motion.div
            className="w-full md:w-[60%] flex flex-col items-start space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.span
              className="inline-block bg-white text-ta-primary px-4 py-2 rounded-full font-(family-name:--font-ta-label-md) text-ta-body-md shadow-sm font-bold"
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span data-edit="admissions.subtitle">{admissions.subtitle || `${session} Admissions`}</span>
            </motion.span>

            <motion.h2
              className="font-(family-name:--font-ta-h2) text-4xl md:text-[44px] leading-[1.1] font-extrabold text-white tracking-tight"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span data-edit="admissions.title">{admissions.title || "Shape Your Child's Future"}</span>
            </motion.h2>

            <motion.p
              className="font-(family-name:--font-ta-body-lg) text-ta-body-md md:text-ta-body-lg text-white/85"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span data-edit="admissions.description">{admissions.description || `Nurturing young minds with values and academic excellence. Admissions are now open for the ${session} session.`}</span>
            </motion.p>

            {highlights.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-3 pt-2"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {highlights.map((highlight, hi) => (
                  <span
                    key={highlight.label}
                    className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md backdrop-blur-sm border border-white/20"
                  >
                    <Icon icon={highlight.icon ?? 'lucide:check'} className="w-4 h-4 shrink-0" />
                    <span data-edit={`admissions.highlights.${hi}.label`}>{highlight.label}</span>
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 w-full sm:w-auto"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Link href="/admissions" className="w-full sm:w-auto">
                <button className="bg-white text-ta-primary hover:bg-gray-50 transition-colors px-8 py-3 rounded-full font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 border-none w-full sm:w-auto">
                  Apply Now
                  <Icon icon="lucide:arrow-right" className="text-ta-body-lg" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <div className="w-full md:w-[40%] pr-4 md:pr-0 relative mt-12 md:mt-0 flex justify-center">
            <motion.div
              className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] rounded-full bg-white/20 border-4 border-white/30 backdrop-blur-sm p-4 overflow-visible flex items-center justify-center mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden z-10 border-4 border-white/50 shadow-2xl bg-ta-surface">
                {admissions.homeImage ? (
                  <Image src={admissions.homeImage} alt="Admissions" fill className="object-cover" data-edit-img="admissions.homeImage" />
                ) : (
                  <ImagePlaceholder label="Add admissions image" icon="lucide:graduation-cap" editPath="admissions.homeImage" />
                )}
              </div>

              {/* Floating card */}
              {admissions.callout && (
                <div className="absolute -left-6 top-12 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center gap-2 -rotate-3">
                  <Icon icon={admissions.callout.icon ?? 'lucide:star'} className="text-amber-400 fill-amber-400 w-5 h-5" />
                  <span className="font-bold text-ta-label-md text-ta-on-surface whitespace-nowrap" data-edit="admissions.callout.label">{admissions.callout.label}</span>
                </div>
              )}

              {/* Rainbow arc */}
              <div className="absolute -right-4 top-10 w-24 h-12 overflow-hidden z-20 transform rotate-12">
                <div className="w-24 h-24 rounded-full border-[6px] border-red-500/80" />
                <div className="absolute top-[6px] left-[6px] w-[84px] h-[84px] rounded-full border-[6px] border-yellow-400/80" />
                <div className="absolute top-[12px] left-[12px] w-[72px] h-[72px] rounded-full border-[6px] border-blue-400/80" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
