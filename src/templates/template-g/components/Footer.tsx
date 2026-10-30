'use client'

import Image from '@/shared/SiteImage'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { contactEntryValue, contactPhoneDisplay, contactPhoneHref } from '@/lib/contact-entry'

export default function Footer({ data, editing = false }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact
  const links = (data.navigation ?? []).filter((item) => item.href !== '/login' && item.label.toLowerCase() !== 'login')
  const emails = contact.email.length ? contact.email : editing ? [''] : []
  const phones = contact.phone.length ? contact.phone : editing ? [''] : []

  return (
    <footer className="bg-[linear-gradient(135deg,#16275f,#552782)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            {data.logo ? <Image src={data.logo} alt={`${data.name} logo`} width={64} height={64} data-edit-img="logo" className="h-14 w-14 object-contain" /> : <Icon icon="lucide:graduation-cap" className="h-12 w-12" />}
            <div>
              <div data-bind="name" className="font-extrabold uppercase tracking-wide">{data.name}</div>
              <div data-edit="tagline" className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">{data.tagline}</div>
            </div>
          </div>
          <p data-edit="footer.description" className="mt-5 max-w-sm text-sm leading-7 text-white/65">{data.footer.description || data.about.description}</p>
          <div className="mt-5 flex gap-2">
            {(data.socialLinks ?? []).map((social) => social.url && social.url !== '#' ? (
              <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 hover:bg-white/10">
                <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-4 w-4" />
              </a>
            ) : null)}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-base font-extrabold text-white">Useful Links</h2>
          <div className="lg:space-y-3">
            {links.slice(0, Math.ceil(links.length / 2)).map((link) => <Link key={`${link.href}-${link.label}`} href={link.href} className="block py-2.5 text-sm text-white/65 hover:text-white lg:py-0">{link.label}</Link>)}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-base font-extrabold text-white">Explore</h2>
          <div className="lg:space-y-3">
            {links.slice(Math.ceil(links.length / 2)).map((link) => <Link key={`${link.href}-${link.label}`} href={link.href} className="block py-2.5 text-sm text-white/65 hover:text-white lg:py-0">{link.label}</Link>)}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-base font-extrabold text-white">Address</h2>
          {(contact.address || editing) && <p data-edit="contact.address" className="mb-4 text-sm leading-6 text-white/65">{contact.address}</p>}
          {phones.map((phone, index) => <a key={`phone-${index}`} href={contactPhoneHref(phone)} data-edit={`contact.phone.${index}.value`} className="flex items-center gap-2 py-2.5 text-sm text-white/65 hover:text-white lg:mb-2 lg:py-0"><Icon icon="lucide:phone" className="h-4 w-4" />{contactPhoneDisplay(phone)}</a>)}
          {emails.map((email, index) => <a key={`email-${index}`} href={contactEntryValue(email) ? `mailto:${contactEntryValue(email)}` : undefined} data-edit={`contact.email.${index}.value`} className="flex items-center gap-2 break-all py-2.5 text-sm text-white/65 hover:text-white lg:py-0"><Icon icon="lucide:mail" className="h-4 w-4 shrink-0" />{contactEntryValue(email)}</a>)}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span data-edit="footer.copyright">{data.footer.copyright}</span>
            {/* Every template's footer carries this link: the site takes admission
                enquiries, so the notice has to be reachable from every page. */}
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
          </div>
          <span>Powered by <a href="https://leeep.in" className="font-bold text-white/70 hover:text-white">Leeep</a></span>
        </div>
      </div>
    </footer>
  )
}
