import type { SchoolData } from '@/types/school.types'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import ScrollReveal from '@/shared/animations/scroll-reveal'

/** Template B — Admissions CTA Section (Kashmir-Cambridge style) */
export default function AdmissionsSection({ data }: { data: SchoolData }) {
  // Real Frappe blobs may omit the whole `admissions` slice — guard it.
  const admissions = data.admissions ?? {}
  const highlights = admissions.highlights ?? []

  return (
    <section id="admissions" className="py-16 md:py-24 bg-tb-secondary">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <ScrollReveal direction="left">
            <p data-edit="admissions.subtitle" className="text-tb-primary-400 text-sm font-bold uppercase tracking-widest mb-3">
              {admissions.subtitle || 'Admissions Open'}
            </p>
            <h2 data-edit="admissions.title" className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
              {admissions.title || 'Begin Your Journey With Us'}
            </h2>
            <p data-edit="admissions.description" className="text-white/80 leading-relaxed mb-8 max-w-xl">
              {admissions.description ||
                'Admissions are now open. Join a community committed to academic excellence and character.'}
            </p>

            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {highlights.map((highlight, hi) => (
                  <span
                    key={highlight.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"
                  >
                    <Icon icon={highlight.icon ?? 'lucide:check'} className="w-4 h-4 shrink-0" />
                    <span data-edit={`admissions.highlights.${hi}.label`}>{highlight.label}</span>
                  </span>
                ))}
              </div>
            )}

            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-tb-primary-400 text-tb-background font-semibold rounded-full hover:bg-tb-primary-500 transition-all duration-300 shadow-lg"
            >
              Apply Now
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          {/* Callout card / image */}
          <ScrollReveal direction="right" className="flex justify-center lg:justify-end">
            {admissions.callout ? (
              <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full">
                <div className="w-14 h-14 rounded-2xl bg-tb-primary-400/15 flex items-center justify-center mb-5">
                  <Icon icon={admissions.callout.icon ?? 'lucide:sparkles'} className="w-7 h-7 text-tb-primary-400" />
                </div>
                <h3 data-edit="admissions.callout.label" className="text-xl font-bold text-tb-heading mb-2">{admissions.callout.label}</h3>
                {admissions.callout.sublabel && (
                  <p data-edit="admissions.callout.sublabel" className="text-tb-body text-sm leading-relaxed">{admissions.callout.sublabel}</p>
                )}
              </div>
            ) : admissions.homeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={admissions.homeImage}
                alt="Admissions"
                data-edit-img="admissions.homeImage"
                className="rounded-3xl shadow-2xl w-full max-w-sm object-cover aspect-[4/5]"
              />
            ) : null}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
