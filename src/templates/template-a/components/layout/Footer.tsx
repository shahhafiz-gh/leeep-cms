'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { SchoolData } from '@/types/school.types'
import ImagePlaceholder from '@/templates/template-a/components/common/ImagePlaceholder'

export default function Footer({ data }: { data: SchoolData }) {
  const isHomeRoute = usePathname() === '/'

  // Real Frappe blobs may omit whole slices — guard them.
  const contact = data.contact ?? { address: '', phone: [], email: [] }
  const realColumns = data.footer?.columns ?? []
  const hasRealColumns = realColumns.length > 0
  const footerColumns = hasRealColumns
    ? realColumns
    : [{ title: 'Quick Links', links: data.navigation.map((n) => ({ label: n.label, href: n.href })) }]

  return (
    <footer
      className={`relative bg-[#0f1f13] ${isHomeRoute ? 'mt-20' : 'mt-12'} text-ta-inverse-on-surface overflow-visible font-(family-name:--font-ta-nunito)`}
    >
      {/* Wave Divider */}
      <svg
        className="absolute top-0 left-0 w-full h-[220px] -translate-y-[calc(100%-1px)]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40L48,46.7C96,53,192,67,288,66.7C384,67,480,53,576,46.7C672,40,768,40,864,46.7C960,53,1056,67,1152,66.7C1248,67,1344,53,1392,46.7L1440,40L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill="#0f1f13"
          fillOpacity="1"
        />
      </svg>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between gap-12 lg:gap-8">
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {data.logo ? (
                <Image
                  src={data.logo}
                  width={80}
                  height={80}
                  alt={`${data.name} Logo`}
                  className="w-16 h-16 max-h-16  rounded-full"
                  data-edit-img="logo"
                />
              ) : (
                <ImagePlaceholder label="Logo" icon="lucide:image-plus" className="w-16 h-16 rounded-full shrink-0 gap-0.5" editPath="logo" />
              )}
              <h2 className="text-2xl font-bold leading-tight text-ta-inverse-on-surface">
                {data.name.split(' ').slice(0, 2).join(' ')}
                <br />
                {data.name.split(' ').slice(2).join(' ')}
              </h2>
            </div>
            <p data-edit="footer.description" className="text-ta-outline-variant text-sm leading-relaxed">
              {data.footer?.description || data.tagline}
            </p>
            <div className="flex items-center gap-4">
              {/* All canonical platforms render; the inline-edit layer reveals
                  empties for editing. In LIVE (no edit layer) only platforms
                  with a URL are visible — empties are hidden via inline style. */}
              {data.socialLinks.map((social, si) => (
                <a
                  key={social.platform}
                  href={social.url || undefined}
                  data-edit-social={`socialLinks.${si}.url`}
                  data-social-platform={social.platform}
                  data-social-url={social.url || ''}
                  data-social-empty={social.url ? undefined : 'true'}
                  style={social.url ? undefined : { display: 'none' }}
                  className="p-2 bg-ta-inverse-on-surface/5 rounded-full hover:bg-ta-inverse-primary/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon={social.icon || `ri:${social.platform}-fill`} className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Footer link columns — data-driven (data.footer.columns),
              falling back to navigation-derived Quick Links when none exist. */}
          {footerColumns.map((column, ci) => (
            <div key={column.title} className="space-y-6 flex justify-center flex-col items-center">
              <h3
                data-edit={hasRealColumns ? `footer.columns.${ci}.title` : undefined}
                className="text-lg font-bold tracking-wider uppercase text-ta-inverse-on-surface/90"
              >
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, li) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      data-edit-link={hasRealColumns ? `footer.columns.${ci}.links.${li}.href` : undefined}
                      className="text-ta-outline-variant hover:text-ta-inverse-primary text-sm transition-colors duration-200"
                    >
                      <span data-edit={hasRealColumns ? `footer.columns.${ci}.links.${li}.label` : undefined}>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 3: Contact */}
          <div className="space-y-6 flex justify-center flex-col items-end">
            <h3 className="text-lg font-bold tracking-wider uppercase text-ta-inverse-on-surface/90">
              Get In Touch
            </h3>
            <ul className="space-y-4">
              {contact.address && (
                <li className="flex items-start gap-3">
                  <Icon icon="lucide:map-pin" className="mt-1 text-ta-inverse-primary w-5 h-5" />
                  <span className="text-ta-outline-variant text-sm">
                    {contact.address}
                  </span>
                </li>
              )}
              {(contact.phone ?? []).map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Icon icon="lucide:smartphone" className="text-ta-inverse-primary w-5 h-5" />
                  <a href={`tel:${p}`} className="text-ta-outline-variant text-sm hover:text-ta-inverse-primary transition-colors">
                    {p}
                  </a>
                </li>
              ))}
              {(contact.email ?? []).map((e) => (
                <li key={e} className="flex items-center gap-3">
                  <Icon icon="lucide:mail" className="text-ta-inverse-primary w-5 h-5" />
                  <a href={`mailto:${e}`} className="text-ta-outline-variant text-sm underline underline-offset-4 hover:text-ta-inverse-primary transition-colors">
                    {e}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-ta-on-primary bg-ta-primary-container rounded-full hover:bg-ta-primary transition-all duration-300 shadow-lg active:scale-95"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 pt-4 pb-4 border-t items-center justify-center border-ta-inverse-on-surface/10 flex flex-col lg:flex-row gap-2">
          <span data-edit="footer.copyright" className="text-ta-outline-variant text-sm">{data.footer?.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
