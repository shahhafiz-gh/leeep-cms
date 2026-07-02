import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

export default function WhyChooseUs({ data }: { data: SchoolData }) {
  // Prefer about.whyChooseUs; fall back to admissions.whyChoose (guarded — the
  // admissions slice may be absent in real blobs).
  const usingWhyChoose = !!(data.about.whyChooseUs && data.about.whyChooseUs.length)
  const reasons = data.about.whyChooseUs ?? data.admissions?.whyChoose ?? []
  if (reasons.length === 0) return null

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-tb-heading">Why Choose {data.name}?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, i) => (
            <div
              key={item.title}
              className="text-center p-6 rounded-xl border border-tb-border hover:border-tb-primary-400/30 hover:shadow-xl transition-all duration-300 h-full group"
            >
              <div className="w-16 h-16 rounded-full bg-tb-primary-400/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-tb-primary-400 transition-colors duration-300">
                <Icon
                  icon={item.icon ?? 'lucide:star'}
                  className="w-8 h-8 text-tb-primary-400 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h5 data-edit={usingWhyChoose ? `about.whyChooseUs.${i}.title` : undefined} className="text-lg font-semibold text-tb-heading mb-3">{item.title}</h5>
              <p data-edit={usingWhyChoose ? `about.whyChooseUs.${i}.description` : undefined} className="text-tb-body leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
