import type { SchoolData } from '@/types/school.types'
import Photo from '../common/Photo'
import { Action, Container } from '../common/Bits'

/**
 * Ledger's opener: a stated claim and a photograph, side by side. No overlay,
 * no full-bleed image — the design keeps type and picture as separate columns,
 * which is also what lets the whole thing stack cleanly on a phone.
 */
export default function HeroSection({ data }: { data: SchoolData }) {
  const slide = data.hero?.slides?.[0]
  if (!slide) return null

  return (
    <Container>
      <div className="grid grid-cols-1 items-center gap-10 py-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
        <div className="flex flex-col gap-6">
          <h1
            data-edit="hero.slides.0.title"
            className="m-0 text-[32px] leading-[1.16] text-te-ink sm:text-[38px] lg:text-[46px]"
          >
            {slide.title}
          </h1>
          <p
            data-edit="hero.slides.0.description"
            className="m-0 max-w-[52ch] text-[16px] leading-[1.65] text-te-body sm:text-[17px]"
          >
            {slide.description || data.tagline}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Action href={slide.cta?.href || '/admissions'}>
              <span data-edit="hero.slides.0.cta.label">{slide.cta?.label || 'Inquire & Visit'}</span>
            </Action>
            <Action href="/academics" variant="ghost">Academics</Action>
          </div>
        </div>

        <Photo
          priority
          fill
          src={slide.image}
          alt={slide.title}
          caption="photo: students on the main quad, early fall"
          editPath="hero.slides.0.image"
          className="order-first h-[240px] w-full sm:h-[320px] lg:order-none lg:h-[420px]"
        />
      </div>
    </Container>
  )
}
