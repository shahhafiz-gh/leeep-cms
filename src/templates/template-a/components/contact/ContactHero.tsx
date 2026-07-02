'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

export default function ContactHero({ data }: { data: SchoolData }) {
  const { contact } = data
  const quickInfo = [
    { icon: 'lucide:phone', label: contact.phone[0] },
    { icon: 'lucide:mail', label: contact.email[0] },
    { icon: 'lucide:clock', label: contact.workingHours ?? 'Mon-Sat: 9AM - 4PM' },
  ].filter((i) => i.label)

  return (
    <section className="relative bg-ta-surface-bright pt-32 md:pt-40 pb-12 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
        {/* Content */}
        <div className="flex flex-col justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-fit px-4 py-2 bg-ta-secondary-container text-ta-on-secondary-container rounded-full font-(family-name:--font-ta-label-md) text-ta-label-md font-semibold"
          >
            {contact.subtitle ?? 'Get In Touch'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-(family-name:--font-ta-h1) text-4xl md:text-[56px] leading-[1.1] tracking-[-0.02em] font-extrabold text-ta-on-surface max-w-2xl"
          >
            Let&apos;s Start A Conversation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-(family-name:--font-ta-body-lg) text-ta-on-surface-variant max-w-xl"
          >
            Whether you have questions about admissions, academics, or campus life, our dedicated team is ready to assist you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            {quickInfo.map((info) => (
              <div
                key={info.label}
                className="flex items-center gap-3 bg-ta-surface-container-low px-4 py-3 rounded-xl border border-ta-outline-variant/30 hover:border-ta-primary/30 transition-colors"
              >
                <Icon icon={info.icon} className="text-ta-primary text-xl" />
                <span className="font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface">{info.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-[110%] h-[110%] bg-ta-secondary-container rounded-[40%_60%_70%_30%/40%_50%_60%_50%] z-0"
          />
          <div className="relative z-10 w-full max-w-[550px] h-[360px] md:h-[400px] rounded-[40px] border-8 border-ta-surface shadow-2xl">
            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-ta-surface-container">
              {data.contact.image ? (
                <img src={data.contact.image} alt={`${data.name} campus`} className="w-full h-full object-cover" data-edit-img="contact.image" />
              ) : (
                <ImagePlaceholder label="Add campus image" icon="lucide:building-2" editPath="contact.image" />
              )}
            </div>

            {contact.highlights?.[0] && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-4 md:-left-12 bg-ta-surface-container-lowest p-4 md:p-5 rounded-2xl shadow-xl border border-ta-outline-variant flex items-center gap-4 z-20"
              >
                <div className="bg-ta-primary-container text-ta-on-primary-container p-3 rounded-full flex">
                  <Icon icon={contact.highlights[0].icon ?? 'lucide:check-circle'} className="text-2xl" />
                </div>
                <div>
                  <p className="font-(family-name:--font-ta-label-md) font-bold text-ta-on-surface">{contact.highlights[0].label}</p>
                  {contact.highlights[0].sublabel && (
                    <p className="font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant">{contact.highlights[0].sublabel}</p>
                  )}
                </div>
              </motion.div>
            )}

            {contact.highlights?.[1] && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-10 -right-4 md:-right-8 bg-ta-surface-container-lowest p-4 md:p-5 rounded-2xl shadow-xl border border-ta-outline-variant flex items-center gap-4 z-20"
              >
                <div className="bg-ta-secondary-container text-ta-on-secondary-container p-3 rounded-full flex">
                  <Icon icon={contact.highlights[1].icon ?? 'lucide:star'} className="text-2xl" />
                </div>
                <div>
                  <p className="font-(family-name:--font-ta-label-md) font-bold text-ta-on-surface">{contact.highlights[1].label}</p>
                  {contact.highlights[1].sublabel && (
                    <p className="font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant">{contact.highlights[1].sublabel}</p>
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
