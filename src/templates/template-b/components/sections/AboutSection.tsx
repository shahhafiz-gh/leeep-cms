import type { SchoolData } from '@/types/school.types'
import Image from 'next/image'
import ScrollReveal from '@/shared/animations/scroll-reveal'
import StaggerChildren from '@/shared/animations/stagger-children'

/** Template B — About Section with stats bar (KCS style) */
export default function AboutSection({ data }: { data: SchoolData }) {
  const { about, stats } = data

  return (
    <>
      {/* About */}
      <section id="about" className="py-16 md:pt-32 bg-tb-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Image column */}
            <ScrollReveal direction="left" className="relative h-[400px] md:h-[550px]">
              {/* Top-left image */}
              <div className="absolute top-0 left-0 w-full sm:w-[90%] h-[400px] z-0">
                <Image
                  src={about.image || '/assets/demo/placeholder.png'}
                  alt={about.title}
                  fill
                  className="object-cover "
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Bottom-right secondary image */}
              <div className="  absolute  border-t-20 hidden md:block border-l-20 border-tb-background bottom-30 right-0 w-[60%] h-[230px] z-10">
                <Image
                  src={data.gallery?.images?.[1]?.src || about.image || '/assets/demo/placeholder.png'}
                  alt="Campus"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Spinning badge overlay */}
              <div className="absolute top-[45%] md:top-[40%] left-[55%] md:left-[50%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#A38A36] text-white flex items-center justify-center shadow-xl z-20 border-2 md:border-3 border-tb-background">
                <svg className="w-full h-full animate-[spin_10s_linear_infinite] absolute" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -33, 0 a 33,33 0 1,1 66,0 a 33,33 0 1,1 -66,0" fill="transparent" />
                  <text>
                    <textPath href="#circlePath" startOffset="0%" className="text-[10px] md:text-[10.5px] font-medium tracking-[0.15em] uppercase" fill="white">
                      {data.name} * {about.subtitle} *
                    </textPath>
                  </text>
                </svg>
                <div className="absolute flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </div>
            </ScrollReveal>

            {/* Content column */}
            <ScrollReveal direction="right" className="lg:pl-8 flex flex-col justify-center">
              <h2 className="text-4xl md:text-[2.75rem] font-serif text-gray-900 leading-[1.1] mb-8 uppercase tracking-wide">
                {about.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-10 text-[15px]">
                {about.description}
              </p>

              {/* Vintage EST text decoration */}
              {about.subtitle && (
                <div
                  className="mt-4 text-7xl md:text-4.5rem] font-bold tracking-wide select-none pointer-events-none uppercase"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px #d1d5db',
                  }}
                >
                  {about.subtitle}
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats.length > 0 && (
        <div className="bg-white pb-20 md:pb-22">
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center px-4">
                  <span className="text-5xl md:text-[3.5rem] font-serif text-gray-900 tracking-tight mb-4 leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 font-semibold uppercase tracking-[0.2em] leading-relaxed max-w-[140px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      )}
    </>
  )
}
