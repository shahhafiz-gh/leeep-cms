import type { SchoolData } from '@/types/school.types'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'

/** Template B — Footer (Kashmir-Cambridge style) */
export default function Footer({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  return (
    <>
      <footer className="border-t border-gray-200 bg-white pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link href="/" className="block mb-6">
                <Image
                  src={data.logo || '/assets/demo/placeholder.png'}
                  alt={data.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                  data-edit-img="logo"
                />
              </Link>
              {(data.footer.description || data.tagline) && (
                <p data-edit="footer.description" className="text-tb-body text-sm leading-relaxed mb-6 max-w-xs">
                  {data.footer.description || data.tagline}
                </p>
              )}
              {/* In the EDITOR all canonical platforms render (the inline-edit
                  layer reveals empties so each can be set up). On the LIVE site we
                  simply DON'T render a platform with no real URL — so an
                  un-configured icon never appears. */}
              {data.socialLinks.length > 0 && (
                <div className="flex items-center gap-3">
                  {data.socialLinks.map((social, si) => {
                    const hasUrl = !!social.url && social.url !== '#'
                    if (!editing && !hasUrl) return null
                    return (
                      <a
                        key={social.platform}
                        href={social.url || undefined}
                        data-edit-social={`socialLinks.${si}.url`}
                        data-social-platform={social.platform}
                        data-social-url={social.url || ''}
                        data-social-empty={hasUrl ? undefined : 'true'}
                        style={hasUrl ? undefined : { display: 'none' }}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-tb-body hover:text-tb-primary hover:border-tb-primary transition-colors duration-300"
                      >
                        <Icon icon={social.icon ?? `mdi:${social.platform}`} className="w-4 h-4" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Nav columns */}
            {data.footer.columns.map((col, ci) => (
              <div key={col.title} className="lg:col-span-2">
                <h6 data-edit={`footer.columns.${ci}.title`} className="font-semibold text-tb-heading mb-5 text-sm uppercase tracking-wider">
                  {col.title}
                </h6>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link, li) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-edit-link={`footer.columns.${ci}.links.${li}.href`}
                        className="text-sm text-tb-body hover:text-tb-primary transition-colors duration-300"
                      >
                        <span data-edit={`footer.columns.${ci}.links.${li}.label`}>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CTA column */}
            <div className="lg:col-span-3 sm:col-span-2">
              <h6 className="font-semibold text-tb-heading mb-5 text-sm uppercase tracking-wider">
                Quick Links
              </h6>
              <div className="flex flex-col gap-3 max-w-[200px]">
                <Link
                  href="/admissions"
                  className="py-2.5 px-6 text-center text-sm font-medium bg-tb-primary-400 text-white rounded-full hover:bg-tb-primary-500 transition-colors duration-300"
                >
                  Apply Now
                </Link>
                <Link
                  href="/contact"
                  className="py-2.5 px-6 text-center text-sm font-medium bg-tb-secondary text-white rounded-full hover:bg-tb-secondary/90 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright strip */}
      <div className="w-full bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p data-edit="footer.copyright" className="text-xs text-tb-body">{data.footer.copyright}</p>
          <p className="text-xs text-tb-body flex items-center gap-1.5">
            Powered by
            <a href="https://leeep.in" className="hover:opacity-80 transition-opacity">
              <img src="/assets/kcs/leeep.svg" alt="Leeep" className="h-4 w-auto inline" />
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
