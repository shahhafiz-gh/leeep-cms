'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
})

export default function HeroSection({ data }: { data: SchoolData }) {
  const slide = data.hero.slides[0]
  if (!slide) return null

  return (
    <section className="py-10 md:pt-20 bg-ta-surface overflow-hidden">
      <div className="container my-10 mx-auto px-4 md:px-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-ta-gutter items-center relative z-10">
          {/* Left Content */}
          <div className="md:col-span-6 flex flex-col gap-ta-lg pt-ta-lg pb-ta-xl md:py-ta-xl text-center md:text-left items-center md:items-start">
            <motion.div
              className="px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {slide.subtitle || `Welcome to ${data.name}`}
            </motion.div>

            <motion.h1
              className="font-(family-name:--font-ta-h1) text-4xl md:text-[56px] leading-[1.1] tracking-[-0.02em] font-extrabold text-ta-on-surface max-w-2xl"
              {...fadeUp(0.2)}
            >
              {slide.title}
            </motion.h1>

            <motion.p
              className="font-(family-name:--font-ta-body-lg) text-ta-body-md md:text-ta-body-lg text-ta-on-surface-variant"
              {...fadeUp(0.3)}
            >
              {slide.description || data.tagline}
            </motion.p>

            {/* CTA */}
            {slide.cta && (
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-ta-sm mt-ta-xs w-full sm:w-auto"
                {...fadeUp(0.4)}
              >
                <Link href={slide.cta.href} className="w-full sm:w-auto">
                  <button className="w-full inline-flex items-center justify-center gap-2 cursor-pointer bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full shadow-[0_8px_16px_rgba(0,107,32,0.2)] hover:scale-105 active:scale-95 transition-all duration-200 px-8 py-4">
                    {slide.cta.label}
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Trust Badges */}
            {data.stats && data.stats.length > 0 && (
              <motion.div
                className="flex mt-1 flex-wrap justify-center md:justify-start items-center gap-ta-lg pt-ta-lg border-t border-ta-surface-dim/30 w-full"
                {...fadeUp(0.5)}
              >
                {data.stats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="flex items-center gap-(--spacing-ta-xs) text-ta-on-surface-variant">
                    <Icon icon={stat.icon || 'lucide:shield-check'} className="text-ta-primary-container text-xl w-5 h-5 shrink-0" />
                    <span className="font-(family-name:--font-ta-label-md) text-ta-label-md capitalize">
                      {stat.value} {stat.label.toLowerCase()}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right: Hero Image */}
          <motion.div
            className="md:col-span-6 relative w-full h-auto rounded-3xl overflow-hidden mt-8 md:mt-0 px-4 md:px-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            {slide.image ? (
              <Image
                src={slide.image}
                alt="Hero Image"
                width={1000}
                height={1000}
                priority
              />
            ) : (
              <ImagePlaceholder label="Add hero image" className="w-full aspect-square rounded-3xl" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
