import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'

type Variant = 'willow' | 'heritage' | 'quill' | 'ledger' | 'almanac'

const themes: Record<Variant, { page: string; hero: string; eyebrow: string; title: string; body: string; rule: string; panel: string; accent: string; chip: string }> = {
  willow: {
    page: 'bg-ta-background text-ta-on-background pt-20', hero: 'bg-ta-surface', eyebrow: 'text-ta-primary', title: 'text-ta-on-surface font-(family-name:--font-ta-h1)', body: 'text-ta-on-surface-variant', rule: 'border-ta-outline-variant/40', panel: 'bg-ta-surface rounded-lg', accent: 'text-ta-primary', chip: 'bg-ta-primary-container/40 text-ta-on-primary-container rounded-full',
  },
  heritage: {
    page: 'bg-tb-background text-tb-foreground', hero: 'bg-tb-secondary text-white', eyebrow: 'text-tb-accent', title: 'text-white font-[family-name:var(--font-playfair)]', body: 'text-white/75', rule: 'border-tb-border', panel: 'bg-tb-light-white', accent: 'text-tb-accent', chip: 'border border-tb-accent/40 text-tb-accent',
  },
  quill: {
    page: 'bg-td-paper text-td-ink', hero: 'bg-td-panel', eyebrow: 'text-td-accent', title: 'text-td-ink font-(family-name:--font-td-display)', body: 'text-td-body', rule: 'border-td-border', panel: 'bg-td-panel', accent: 'text-td-accent', chip: 'bg-td-ink text-td-paper',
  },
  ledger: {
    page: 'bg-te-paper text-te-ink', hero: 'bg-te-paper', eyebrow: 'text-te-accent', title: 'text-te-ink font-(family-name:--font-te-serif)', body: 'text-te-body', rule: 'border-te-rule', panel: 'bg-te-panel-alt', accent: 'text-te-accent', chip: 'border border-te-rule text-te-body',
  },
  almanac: {
    page: 'bg-tf-paper text-tf-ink', hero: 'bg-tf-panel', eyebrow: 'text-tf-accent', title: 'text-tf-ink font-(family-name:--font-tf-serif)', body: 'text-tf-body', rule: 'border-tf-border', panel: 'bg-tf-panel', accent: 'text-tf-accent', chip: 'bg-tf-ink text-tf-paper',
  },
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function FacilitiesPage({ data, variant }: { data: SchoolData; variant: Variant }) {
  const facilities = data.facilities
  const items = facilities?.items?.filter((item) => item.name || item.description) ?? []
  const t = themes[variant]

  return (
    <div className={t.page}>
      <section className={`${t.hero} border-b ${t.rule}`}>
        <div className="mx-auto grid min-h-[420px] max-w-[1200px] items-stretch lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            {facilities?.subtitle && <p data-edit="facilities.subtitle" className={`mb-4 text-xs font-bold uppercase tracking-[0.16em] ${t.eyebrow}`}>{facilities.subtitle}</p>}
            <h1 data-edit="facilities.title" className={`m-0 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl ${t.title}`}>{facilities?.title || 'Our Facilities'}</h1>
            {facilities?.description && <p data-edit="facilities.description" className={`mt-6 max-w-[620px] text-base leading-7 sm:text-lg ${t.body}`}>{facilities.description}</p>}
          </div>
          {facilities?.heroImage ? (
            <div className="relative min-h-[280px] overflow-hidden lg:min-h-full">
              <img loading="lazy" decoding="async" src={facilities.heroImage} alt={`${data.name} facilities`} data-edit-img="facilities.heroImage" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ) : (
            <div className={`flex min-h-[280px] items-center justify-center ${t.panel}`} data-edit-img="facilities.heroImage">
              <Icon icon="lucide:school" className={`h-16 w-16 ${t.accent}`} />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
        {items.length ? (
          <div className="flex flex-col">
            {items.map((item, index) => (
              <article id={slugify(item.name)} key={`${item.name}-${index}`} className={`grid scroll-mt-28 gap-8 border-b py-12 first:pt-0 last:border-b-0 lg:grid-cols-2 lg:items-center lg:gap-16 ${t.rule}`}>
                <div className={`relative aspect-[4/3] overflow-hidden ${t.panel} ${index % 2 ? 'lg:order-2' : ''}`}>
                  {item.image ? (
                    <img loading="lazy" decoding="async" src={item.image} alt={item.name} data-edit-img={`facilities.items.${index}.image`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Icon icon="lucide:building-2" className={`h-14 w-14 ${t.accent}`} /></div>
                  )}
                </div>
                <div className={index % 2 ? 'lg:order-1' : ''}>
                  <p className={`mb-3 text-xs font-bold uppercase tracking-[0.16em] ${t.eyebrow}`}>Facility {String(index + 1).padStart(2, '0')}</p>
                  <h2 data-edit={`facilities.items.${index}.name`} className={`m-0 text-3xl font-semibold leading-tight sm:text-4xl ${t.title}`}>{item.name}</h2>
                  <p data-edit={`facilities.items.${index}.description`} className={`mt-5 text-base leading-7 ${t.body}`}>{item.description}</p>
                  {!!item.highlights?.length && (
                    <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
                      {item.highlights.map((highlight, hi) => <li key={`${highlight}-${hi}`} data-edit={`facilities.items.${index}.highlights.${hi}`} className={`px-3 py-1.5 text-sm ${t.chip}`}>{highlight}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={`border p-10 text-center ${t.rule} ${t.panel}`}>
            <Icon icon="lucide:building-2" className={`mx-auto h-10 w-10 ${t.accent}`} />
            <p className={`mt-4 ${t.body}`}>Facility details will be added soon.</p>
          </div>
        )}
      </section>
    </div>
  )
}
