'use client'

import Image from '@/shared/SiteImage'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'

/**
 * Dark four-column footer matching the reference site: an "About" blurb beside
 * the school's own authored link columns, then contact details.
 *
 * The link columns come from `footer.columns` when the school has authored them
 * — that is how the reference site's "Useful Links" / "Quick Links" split is
 * reproduced — and fall back to splitting the main navigation in two, so a
 * school that has never touched the footer still gets a populated one.
 */
export default function Footer({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact
  const emails = contact.email.length ? contact.email : editing ? [''] : []
  const phones = contact.phone.length ? contact.phone : editing ? [''] : []

  const authored = (data.footer?.columns ?? []).filter((column) => (column.links ?? []).length)
  const navLinks = (data.navigation ?? []).filter(
    (item) => item.href !== '/login' && item.label.toLowerCase() !== 'login',
  )
  const columns = authored.length
    ? authored.slice(0, 2)
    : [
        { title: 'Useful Links', links: navLinks.slice(0, Math.ceil(navLinks.length / 2)) },
        { title: 'Quick Links', links: navLinks.slice(Math.ceil(navLinks.length / 2)) },
      ]

  return (
    <footer className="bg-th-footer text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            {data.logo ? (
              <Image
                src={data.logo}
                alt={`${data.name} logo`}
                width={64}
                height={64}
                data-edit-img="logo"
                className="h-14 w-14 object-contain"
              />
            ) : (
              <Icon icon="lucide:graduation-cap" className="h-12 w-12" />
            )}
            <div className="min-w-0">
              <div data-bind="name" className="text-sm font-bold uppercase tracking-wide">
                {data.name}
              </div>
              {data.tagline && (
                <div data-edit="tagline" className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">
                  {data.tagline}
                </div>
              )}
            </div>
          </div>
          <p data-edit="footer.description" className="mt-5 max-w-sm text-sm leading-7 text-white/60">
            {data.footer?.description || data.about?.description}
          </p>
          <div className="mt-5 flex gap-2">
            {(data.socialLinks ?? []).map((social) =>
              social.url && social.url !== '#' ? (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-colors hover:border-th-primary hover:bg-th-primary"
                >
                  <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-4 w-4" />
                </a>
              ) : null,
            )}
          </div>
        </div>

        {columns.map((column, i) => (
          <div key={`${column.title}-${i}`}>
            <h2 className="mb-5 text-base font-semibold text-white">{column.title}</h2>
            <span className="mb-5 -mt-3 block h-0.5 w-9 bg-th-primary" />
            <div className="lg:space-y-3">
              {(column.links ?? []).map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="block py-2.5 text-sm text-white/60 transition-colors hover:text-th-primary-200 lg:py-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h2 className="mb-5 text-base font-semibold text-white">Contact Details</h2>
          <span className="mb-5 -mt-3 block h-0.5 w-9 bg-th-primary" />
          {(contact.address || editing) && (
            <p data-edit="contact.address" className="mb-4 flex gap-2 text-sm leading-6 text-white/60">
              <Icon icon="lucide:map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-th-primary" />
              {contact.address}
            </p>
          )}
          {emails.map((email, index) => (
            <a
              key={`email-${index}`}
              href={contactEntryValue(email) ? `mailto:${contactEntryValue(email)}` : undefined}
              data-edit={`contact.email.${index}.value`}
              className="flex items-center gap-2 break-all py-2.5 text-sm text-white/60 transition-colors hover:text-white lg:mb-2 lg:py-0"
            >
              <Icon icon="lucide:mail" className="h-4 w-4 shrink-0 text-th-primary" />
              {contactEntryValue(email)}
            </a>
          ))}
          {phones.map((phone, index) => (
            <a
              key={`phone-${index}`}
              href={contactPhoneHref(phone)}
              data-edit={`contact.phone.${index}.value`}
              className="flex items-center gap-2 py-2.5 text-sm text-white/60 transition-colors hover:text-white lg:mb-2 lg:py-0"
            >
              <Icon icon="lucide:phone" className="h-4 w-4 shrink-0 text-th-primary" />
              {contactPhoneDisplay(phone)}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span data-edit="footer.copyright">{data.footer?.copyright}</span>
            {/* Every template's footer carries this link: the site takes admission
                enquiries, so the notice has to be reachable from every page. */}
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
          </div>
          <span>
            Powered by{' '}
            <a href="https://leeep.in" className="font-semibold text-white/70 hover:text-white">
              Leeep
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
