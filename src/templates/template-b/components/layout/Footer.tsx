import type { SchoolData } from '@/types/school.types'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { styleObject } from '@/lib/component-styles'
import {
  contactEntryLabel,
  contactEntryValue,
  contactPhoneDisplay,
  contactPhoneHref,
} from '@/lib/contact-entry'

/** Template B — Footer (Kashmir-Cambridge style)
 *
 * Everything here is the school's: the brand column prints the same name, logo,
 * address, phone and email the editor's "Header", "Footer" and "Contact" cards
 * edit. Those fields were offered in the editor long before this footer drew
 * them, which is why changing a phone number appeared to do nothing.
 *
 * Colours go through the tb-* tokens rather than Tailwind's grays for the same
 * reason: the tokens are what a school's palette repoints, so a hardcoded
 * `bg-white` is a patch of the footer its palette can never reach.
 */
export default function Footer({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact
  const phones = (contact?.phone ?? []).filter((entry) => contactEntryValue(entry))
  const emails = (contact?.email ?? []).filter((entry) => contactEntryValue(entry))

  return (
    <>
      <footer className="border-t border-tb-line bg-tb-background pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6">
                {/* `h-14 w-auto` + object-contain: the old fixed 60x60
                    `rounded-full` frame cropped the corners off any logo that
                    was not already a circle. */}
                <Image
                  src={data.logo || '/assets/demo/placeholder.png'}
                  alt={data.name}
                  width={160}
                  height={160}
                  className="h-14 w-auto max-w-36 object-contain shrink-0"
                  data-edit-img="logo"
                />
                <span
                  data-bind="name"
                  data-style="name"
                  style={styleObject(data, 'name')}
                  className="block max-w-52 text-lg font-bold uppercase leading-tight tracking-normal text-tb-heading overflow-hidden text-ellipsis"
                >
                  {data.name}
                </span>
              </Link>
              {(data.footer.description || data.tagline) && (
                <p data-edit="footer.description" className="text-tb-body text-sm leading-relaxed mb-6 max-w-xs">
                  {data.footer.description || data.tagline}
                </p>
              )}

              {/* The address + first phone that the editor's Footer card edits. */}
              {(contact?.address || phones.length > 0 || editing) && (
                <ul className="mb-6 flex flex-col gap-3 max-w-xs">
                  {(contact?.address || editing) && (
                    <li className="flex items-start gap-2.5">
                      <Icon icon="lucide:map-pin" className="mt-0.5 w-4 h-4 shrink-0 text-tb-primary-400" />
                      <span data-edit="contact.address" className="text-sm leading-relaxed text-tb-body">
                        {contact?.address}
                      </span>
                    </li>
                  )}
                  {phones.map((phone, pi) => (
                    <li key={`phone-${pi}`} className="flex items-start gap-2.5">
                      <Icon icon="lucide:phone" className="mt-0.5 w-4 h-4 shrink-0 text-tb-primary-400" />
                      <span className="text-sm text-tb-body">
                        {(contactEntryLabel(phone) || editing) && (
                          <>
                            <span
                              data-edit={`contact.phone.${pi}.label`}
                              className="font-semibold text-tb-heading"
                            >
                              {contactEntryLabel(phone)}
                            </span>
                            {contactEntryLabel(phone) ? ': ' : ''}
                          </>
                        )}
                        <a
                          href={contactPhoneHref(phone)}
                          data-edit={`contact.phone.${pi}.value`}
                          className="hover:text-tb-primary-400 transition-colors"
                        >
                          {contactPhoneDisplay(phone)}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
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
                        className="w-9 h-9 rounded-full border border-tb-border flex items-center justify-center text-tb-body hover:text-tb-primary hover:border-tb-primary transition-colors duration-300"
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

            {/* "Get in touch" column — the email and opening hours the editor's
                Footer card edits, then the two standing actions. */}
            <div className="lg:col-span-3 sm:col-span-2">
              <h6 className="font-semibold text-tb-heading mb-5 text-sm uppercase tracking-wider">
                Get in touch
              </h6>
              <ul className="flex flex-col gap-3 mb-6">
                {emails.map((email, ei) => (
                  <li key={`email-${ei}`} className="flex items-start gap-2.5">
                    <Icon icon="lucide:mail" className="mt-0.5 w-4 h-4 shrink-0 text-tb-primary-400" />
                    <a
                      href={`mailto:${contactEntryValue(email)}`}
                      data-edit={`contact.email.${ei}.value`}
                      className="text-sm break-all text-tb-body hover:text-tb-primary-400 transition-colors"
                    >
                      {contactEntryValue(email)}
                    </a>
                  </li>
                ))}
                {(contact?.workingHours || editing) && (
                  <li className="flex items-start gap-2.5">
                    <Icon icon="lucide:clock" className="mt-0.5 w-4 h-4 shrink-0 text-tb-primary-400" />
                    <span data-edit="contact.workingHours" className="text-sm leading-relaxed text-tb-body">
                      {contact?.workingHours}
                    </span>
                  </li>
                )}
              </ul>
              <div className="flex flex-col gap-3 max-w-[200px]">
                <Link
                  href="/admissions"
                  className="py-2.5 px-6 text-center text-sm font-medium bg-tb-primary-400 text-tb-background rounded-full hover:bg-tb-primary-500 transition-colors duration-300"
                >
                  Apply Now
                </Link>
                <Link
                  href="/contact"
                  className="py-2.5 px-6 text-center text-sm font-medium bg-tb-secondary text-tb-background rounded-full hover:bg-tb-secondary/90 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright strip */}
      <div className="w-full bg-tb-background border-t border-tb-line py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <p data-edit="footer.copyright" className="text-xs text-tb-body">{data.footer.copyright}</p>
            {/* Every template's footer carries this link: the site takes admission
                enquiries, so the notice has to be reachable from every page. */}
            <Link href="/privacy" className="text-xs text-tb-body transition-colors hover:text-tb-accent">
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-tb-body flex items-center gap-1.5">
            Powered by
            <a href="https://leeep.in" className="hover:opacity-80 transition-opacity">
              <img loading="lazy" decoding="async" src="/assets/kcs/leeep.svg" alt="Leeep" className="h-4 w-auto inline" />
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
