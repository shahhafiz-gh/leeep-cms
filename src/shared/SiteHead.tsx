import type { SchoolData } from '@/types/school.types'

/**
 * The two things every public page emits that aren't visible on it: structured
 * data, and the school's own analytics.
 *
 * STRUCTURED DATA. A school is exactly the kind of entity search engines have a
 * schema for, and filling it in is what turns a plain blue link into a result
 * with the address, phone number and logo attached. It also feeds Google's
 * knowledge panel and Maps — which, for a school, is where a lot of parents
 * actually start. Everything here comes from content the school already
 * entered; nothing is invented, and any field it left blank is omitted rather
 * than guessed.
 *
 * ANALYTICS. GA4, and only when the school has set its own measurement id. A
 * school that never asked to be tracked loads no script, which is both the
 * right default and one less thing on the critical path.
 */

interface SiteHeadProps {
  data: SchoolData
  /** The school's canonical origin, e.g. `https://kcs.edu`. */
  origin: string
}

/** Drop empty/whitespace values so we never emit `"telephone": ""`. */
function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v == null) return false
      if (typeof v === 'string') return v.trim() !== ''
      if (Array.isArray(v)) return v.length > 0
      return true
    }),
  )
}

/** First non-empty entry of a contact list (`contact.phone` is an array). */
function first(list: unknown): string | undefined {
  if (!Array.isArray(list)) return typeof list === 'string' ? list : undefined
  for (const item of list) {
    if (typeof item === 'string' && item.trim()) return item.trim()
    if (item && typeof item === 'object') {
      const value = (item as { value?: string; number?: string; email?: string }).value
        ?? (item as { number?: string }).number
        ?? (item as { email?: string }).email
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return undefined
}

function buildSchema(data: SchoolData, origin: string) {
  const contact = data.contact ?? ({} as SchoolData['contact'])
  const address = (contact as { address?: string }).address

  const organization = clean({
    '@context': 'https://schema.org',
    // `School` is the precise type and inherits from EducationalOrganization,
    // so it satisfies consumers looking for either.
    '@type': 'School',
    name: data.name,
    description: data.seo?.description || data.tagline,
    url: origin,
    logo: data.logo ? new URL(data.logo, origin).toString() : undefined,
    image: data.seo?.ogImage || data.logo,
    telephone: first(contact.phone),
    email: first(contact.email),
    address: address
      ? clean({ '@type': 'PostalAddress', streetAddress: address, addressCountry: 'IN' })
      : undefined,
    sameAs: (data.socialLinks ?? [])
      .map((link) => link?.url)
      .filter((url): url is string => Boolean(url && url !== '#')),
  })

  return organization
}

export default function SiteHead({ data, origin }: SiteHeadProps) {
  const schema = buildSchema(data, origin)
  const analyticsId = (data.config?.analytics_id ?? '').trim()

  return (
    <>
      <script
        type="application/ld+json"
        // The payload is JSON.stringify of our own object, so there is no markup
        // to escape; `<` in a string value is the one risk and is neutralised.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      {analyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                `window.dataLayer=window.dataLayer||[];` +
                `function gtag(){dataLayer.push(arguments)}` +
                `gtag('js',new Date());` +
                `gtag('config',${JSON.stringify(analyticsId)});`,
            }}
          />
        </>
      )}
    </>
  )
}
