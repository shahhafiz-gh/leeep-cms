import ScrollReveal from '@/shared/animations/scroll-reveal'

interface PageHeroProps {
  /** Small uppercase eyebrow line above the title */
  eyebrow?: string
  /** Main page title */
  title: string
  /** Optional supporting description */
  description?: string
  /** Inline-edit content paths — set per page to make each line editable. */
  eyebrowEditPath?: string
  titleEditPath?: string
  descriptionEditPath?: string
}

/**
 * Template B — shared inner-page hero.
 * Cream background, blue eyebrow, large serif title, centered description.
 * Used on every page except the home page.
 */
export default function PageHero({
  eyebrow = 'Dedicated to Excellence',
  title,
  description,
  eyebrowEditPath,
  titleEditPath,
  descriptionEditPath,
}: PageHeroProps) {
  return (
    <section className="bg-tb-primary-50/50 pt-32 md:pt-44 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {eyebrow && (
            <span data-edit={eyebrowEditPath} className="inline-block text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
              {eyebrow}
            </span>
          )}
          <h1 data-edit={titleEditPath} className="text-3xl md:text-5xl lg:text-6xl font-bold text-tb-secondary mb-6 uppercase tracking-tight">
            {title}
          </h1>
          {description && (
            <p data-edit={descriptionEditPath} className="text-lg md:text-xl text-tb-body leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
