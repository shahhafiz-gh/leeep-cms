import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import ScrollReveal from '@/shared/animations/scroll-reveal'

const REQUIREMENTS = [
  'Completed Application Form',
  'Copy of Birth Certificate / Age Proof',
  'Previous School Records / Report Card (if applicable)',
  'Transfer Certificate from previous school',
  'Passport-size photographs of the child and parents',
  'Parent / Guardian ID Proof (Aadhaar / Passport)',
  'Immunization and Medical Fitness Certificate',
]

export default function AdmissionRequirements({ data }: { data: SchoolData }) {
  const image = data.admissions.requirementsImage || '/assets/demo/placeholder.png'

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <h3 className="text-2xl md:text-3xl font-bold text-tb-heading mb-8">New Student Admissions</h3>
          <div className="rounded-2xl overflow-hidden mb-12">
            <img src={image} alt="Admissions" className="w-full h-[280px] md:h-[380px] object-cover" data-edit-img="admissions.requirementsImage" />
          </div>
        </ScrollReveal>

        {/* General Requirements */}
        <ScrollReveal>
          <h3 className="text-2xl md:text-3xl font-bold text-tb-heading mb-6">General Requirements</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {REQUIREMENTS.map((req) => (
              <li key={req} className="flex items-start gap-3 text-tb-body">
                <Icon icon="lucide:check-circle" className="w-5 h-5 text-tb-primary-400 mt-0.5 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  )
}
