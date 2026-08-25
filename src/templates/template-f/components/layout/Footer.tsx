'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { styleObject } from '@/lib/component-styles'
import { contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'

/**
 * Almanac footer — a hairline rule, a brand block, and link columns.
 *
 * The columns come from the site NAVIGATION (split in half), not the editable
 * `footer.columns` blob: the same rule Template A's footer follows, so a stale
 * or test label saved in that blob can never surface here.
 */
export default function Footer({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact ?? { address: '', phone: [], email: [] }

  // The brand block and "Get in touch" are fully inline-editable on the same
  // `contact.*` paths the Contact page edits, so a change here shows there too.
  // In the EDITOR an empty list still renders ONE blank row so the field can be
  // filled in (the edit layer shows its placeholder hint); on the LIVE site an
  // empty value simply doesn't render.
  const phones = (contact.phone ?? []).length ? contact.phone : editing ? [''] : []
  const emails = (contact.email ?? []).length ? contact.email : editing ? [''] : []

  const links = (data.navigation ?? [])
    .filter((n) => n.href !== '/login' && n.label.toLowerCase() !== 'login')
    .map((n) => ({ label: n.label, href: n.href }))
  const half = Math.ceil(links.length / 2)
  const columns = [
    { title: 'Explore', links: links.slice(0, half) },
    { title: 'Connect', links: links.slice(half) },
  ].filter((c) => c.links.length > 0)

  return (
    <footer className="mx-auto max-w-[1400px] px-5 pb-12 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-10 border-t border-tf-rail pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {data.logo ? (
              <Image
                src={data.logo}
                alt={`${data.name} logo`}
                width={48}
                height={48}
                data-edit-img="logo"
                className="h-6 w-6 rounded-md object-contain"
              />
            ) : (
              <span data-edit-img="logo" className="block h-6 w-6 rounded-md bg-tf-accent" />
            )}
            <span
              data-bind="name"
              data-style="name"
              style={styleObject(data, 'name')}
              className="text-[18px] font-bold tracking-[-0.02em] text-tf-ink"
            >
              {data.name}
            </span>
          </div>
          <div className="text-[14.5px] leading-[1.7] text-tf-muted">
            {(contact.address || editing) && (
              <div data-edit="contact.address">{contact.address}</div>
            )}
            {phones.map((p, i) => (
              <a
                key={`phone-${i}`}
                href={contactPhoneHref(p)}
                data-edit={`contact.phone.${i}.value`}
                className="block transition-colors hover:text-tf-accent"
              >
                {contactPhoneDisplay(p)}
              </a>
            ))}
          </div>

          {/* In the EDITOR every canonical platform renders (hidden, revealed by
              the edit layer) so each can be configured; on the LIVE site an
              un-configured platform simply never appears. */}
          <div className="flex items-center gap-2">
            {(data.socialLinks ?? []).map((social, si) => {
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
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-tf-border p-2 text-tf-muted transition-colors hover:border-tf-accent hover:text-tf-accent"
                >
                  <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-[17px] w-[17px]" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Navigation columns */}
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tf-faint">
              {col.title}
            </div>
            {col.links.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-[15px] text-tf-body transition-colors hover:text-tf-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        {/* Reach us */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tf-faint">
            Get in touch
          </div>
          {emails.map((e, i) => (
            <a
              key={`email-${i}`}
              href={contactEntryValue(e) ? `mailto:${contactEntryValue(e)}` : undefined}
              data-edit={`contact.email.${i}.value`}
              className="text-[15px] break-words text-tf-body transition-colors hover:text-tf-accent"
            >
              {contactEntryValue(e)}
            </a>
          ))}
          {(contact.workingHours || editing) && (
            <span data-edit="contact.workingHours" className="text-[15px] text-tf-body">
              {contact.workingHours}
            </span>
          )}
          <Link href="/admissions" className="mt-2 text-[15px] font-semibold text-tf-accent">
            Apply now →
          </Link>
        </div>

        {/* Bottom rule */}
        <div className="flex flex-col gap-3 border-t border-tf-border pt-6 text-[13px] text-tf-faint sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-4">
          <span data-edit="footer.copyright">{data.footer?.copyright}</span>
          {/* Hardcoded brand attribution, not school content. */}
          <span className="flex items-center gap-1.5">
            Powered by
            <a href="https://leeep.in" className="transition-opacity hover:opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/kcs/leeep.svg" alt="Leeep" className="inline h-7 w-auto" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
