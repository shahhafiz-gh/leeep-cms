import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

export default function HeroSection({ data }: { data: SchoolData }) {
  const slide = data.hero.slides[0]
  if (!slide) return null

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-tb-secondary md:min-h-[610px]">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={slide.image}
        data-edit-img="hero.slides.0.image"
        data-video-target="hero.slides.0.video"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {slide.video && <source src={slide.video} type="video/mp4" />}
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,28,84,0.92)_0%,rgba(33,52,122,0.72)_42%,rgba(39,20,67,0.18)_78%)]" />
      <div className="absolute -left-40 top-6 h-[480px] w-[480px] rotate-12 rounded-[42%] bg-tb-primary-400/25 blur-[1px]" />
      <div className="absolute -left-24 bottom-[-290px] h-[500px] w-[620px] rounded-[48%] bg-tb-secondary/80" />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 md:min-h-[610px] lg:px-8">
        <div className="max-w-3xl text-white">
          {slide.subtitle && (
            <div className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-white/80">
              <span className="h-0.5 w-10 bg-tb-primary-400" />
              <span data-edit="hero.slides.0.subtitle">{slide.subtitle}</span>
            </div>
          )}
          <h1 data-edit="hero.slides.0.title" className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          {slide.description && (
            <p data-edit="hero.slides.0.description" className="mt-6 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
              {slide.description}
            </p>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/admissions" className="inline-flex items-center gap-2 bg-tb-primary-400 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-tb-primary-500">
              <span data-edit="hero.slides.0.cta.label">{slide.cta?.label || 'Apply Now'}</span>
              <Icon icon="lucide:arrow-right" className="h-4 w-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border border-white/65 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-tb-secondary">
              Discover our school
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
