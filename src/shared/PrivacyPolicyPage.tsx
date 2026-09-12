import { Icon } from '@iconify/react'
import type { PrivacyPolicySection, SchoolData } from '@/types/school.types'
import MarkdownContent from '@/shared/MarkdownContent'
import { baselinePrivacySections } from '@/shared/privacy-baseline'
import { contactEntryValue } from '@/lib/contact-entry'

/**
 * `/privacy` — one page, themed per template.
 *
 * Every template links this from its footer, so it has to render for every
 * school on every design. It follows `FacilitiesPage`'s pattern: one layout,
 * one theme map, five token sets (C borrows A's, G and H borrow B's), because a
 * legal page differs between templates only in its colours and type.
 *
 * A school that has written its own policy gets exactly that. One that has not
 * gets the baseline notice instead, marked as the standard notice rather than
 * passed off as the school's own words — see `privacy-baseline.ts`.
 */

type Variant = 'willow' | 'heritage' | 'quill' | 'ledger' | 'almanac'

const themes: Record<
  Variant,
  {
    page: string
    hero: string
    eyebrow: string
    title: string
    body: string
    heading: string
    rule: string
    panel: string
    accent: string
    link: string
    meta: string
  }
> = {
  willow: {
    page: 'bg-ta-background text-ta-on-background pt-20', hero: 'bg-ta-surface', eyebrow: 'text-ta-primary', title: 'text-ta-on-surface font-(family-name:--font-ta-h1)', body: 'text-ta-on-surface-variant', heading: 'text-ta-on-surface font-(family-name:--font-ta-h1)', rule: 'border-ta-outline-variant/40', panel: 'bg-ta-surface rounded-lg', accent: 'text-ta-primary', link: 'text-ta-primary hover:underline', meta: 'text-ta-on-surface-variant',
  },
  heritage: {
    // Heritage's header sits OVER the top of the page until it goes sticky, so
    // its inner-page heroes all clear it themselves (see template-b PageHero).
    page: 'bg-tb-background text-tb-foreground', hero: 'bg-tb-secondary text-white pt-32 md:pt-44', eyebrow: 'text-tb-accent', title: 'text-white font-[family-name:var(--font-playfair)]', body: 'text-tb-body', heading: 'text-tb-secondary font-[family-name:var(--font-playfair)]', rule: 'border-tb-border', panel: 'bg-tb-light-white', accent: 'text-tb-accent', link: 'text-tb-accent hover:underline', meta: 'text-white/75',
  },
  quill: {
    page: 'bg-td-paper text-td-ink', hero: 'bg-td-panel', eyebrow: 'text-td-accent', title: 'text-td-ink font-(family-name:--font-td-display)', body: 'text-td-body', heading: 'text-td-ink font-(family-name:--font-td-display)', rule: 'border-td-border', panel: 'bg-td-panel', accent: 'text-td-accent', link: 'text-td-accent hover:underline', meta: 'text-td-body',
  },
  ledger: {
    page: 'bg-te-paper text-te-ink', hero: 'bg-te-panel-alt', eyebrow: 'text-te-accent', title: 'text-te-ink font-(family-name:--font-te-serif)', body: 'text-te-body', heading: 'text-te-ink font-(family-name:--font-te-serif)', rule: 'border-te-rule', panel: 'bg-te-panel-alt', accent: 'text-te-accent', link: 'text-te-accent hover:underline', meta: 'text-te-body',
  },
  almanac: {
    page: 'bg-tf-paper text-tf-ink', hero: 'bg-tf-panel', eyebrow: 'text-tf-accent', title: 'text-tf-ink font-(family-name:--font-tf-serif)', body: 'text-tf-body', heading: 'text-tf-ink font-(family-name:--font-tf-serif)', rule: 'border-tf-border', panel: 'bg-tf-panel', accent: 'text-tf-accent', link: 'text-tf-accent hover:underline', meta: 'text-tf-body',
  },
}

/** Same anchor rule the Facilities page uses, so a heading is linkable by name. */
function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Keep an anchor unique when two clauses happen to share a heading. */
function anchorsFor(sections: PrivacyPolicySection[]) {
  const seen = new Map<string, number>()
  return sections.map((section, index) => {
    const base = slugify(section.heading) || `section-${index + 1}`
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count ? `${base}-${count + 1}` : base
  })
}

export default function PrivacyPolicyPage({ data, variant }: { data: SchoolData; variant: Variant }) {
  const t = themes[variant]
  const privacy = data.privacy
  const authored = (privacy?.sections ?? []).filter((s) => s?.heading?.trim() || s?.body?.trim())
  const usingBaseline = authored.length === 0
  const sections = usingBaseline ? baselinePrivacySections(data) : authored
  const anchors = anchorsFor(sections)

  const email = (data.contact?.email ?? []).map(contactEntryValue).find(Boolean)
  const title = privacy?.title || 'Privacy Policy'

  return (
    <div className={t.page}>
      <section className={`${t.hero} border-b ${t.rule}`}>
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          {privacy?.subtitle && (
            <p data-edit="privacy.subtitle" className={`mb-4 text-xs font-bold uppercase tracking-[0.16em] ${t.eyebrow}`}>
              {privacy.subtitle}
            </p>
          )}
          <h1 data-edit="privacy.title" className={`m-0 max-w-[820px] text-4xl font-semibold leading-[1.08] sm:text-5xl ${t.title}`}>
            {title}
          </h1>
          {privacy?.description && (
            <p data-edit="privacy.description" className={`mt-6 max-w-[720px] text-base leading-7 sm:text-lg ${t.meta}`}>
              {privacy.description}
            </p>
          )}
          {privacy?.lastUpdated && (
            <p className={`mt-6 flex items-center gap-2 text-sm ${t.meta}`}>
              <Icon icon="lucide:calendar-check" className="h-4 w-4" />
              <span>
                Last updated <span data-edit="privacy.lastUpdated">{privacy.lastUpdated}</span>
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          {/* Contents — a policy is read by jumping to one clause, not top to bottom. */}
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className={`mb-4 text-xs font-bold uppercase tracking-[0.16em] ${t.eyebrow}`}>On this page</p>
            <ol className={`m-0 list-none space-y-2 border-l p-0 pl-4 ${t.rule}`}>
              {sections.map((section, index) => (
                <li key={anchors[index]}>
                  <a href={`#${anchors[index]}`} className={`text-sm leading-6 ${t.link}`}>
                    {section.heading || `Section ${index + 1}`}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            {usingBaseline && (
              <div className={`mb-10 flex gap-3 border p-5 ${t.rule} ${t.panel}`}>
                <Icon icon="lucide:info" className={`mt-0.5 h-5 w-5 shrink-0 ${t.accent}`} />
                <p className={`m-0 text-sm leading-6 ${t.body}`}>
                  This is our standard privacy notice. It describes how information
                  submitted through this website is handled.
                </p>
              </div>
            )}

            <div className="flex flex-col">
              {sections.map((section, index) => (
                <article
                  key={anchors[index]}
                  id={anchors[index]}
                  className={`scroll-mt-28 border-b py-8 first:pt-0 last:border-b-0 ${t.rule}`}
                >
                  <h2
                    data-edit={usingBaseline ? undefined : `privacy.sections.${index}.heading`}
                    className={`m-0 text-2xl font-semibold leading-tight sm:text-[28px] ${t.heading}`}
                  >
                    {section.heading}
                  </h2>
                  <MarkdownContent
                    source={section.body || ''}
                    className={`mt-4 text-base leading-7 ${t.body}`}
                  />
                </article>
              ))}
            </div>

            {/* Every privacy notice has to say where to send a question. */}
            <div className={`mt-12 border p-6 sm:p-8 ${t.rule} ${t.panel}`}>
              <h2 className={`m-0 text-xl font-semibold ${t.heading}`}>Questions about this policy?</h2>
              <p className={`mt-3 text-base leading-7 ${t.body}`}>
                Write to {data.name || 'us'}
                {email ? (
                  <>
                    {' '}at{' '}
                    <a href={`mailto:${email}`} className={t.link}>
                      {email}
                    </a>
                  </>
                ) : null}
                , or use the details on our{' '}
                <a href="/contact" className={t.link}>
                  contact page
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
