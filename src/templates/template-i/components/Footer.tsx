import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import {
  contactEntryValue,
  contactPhoneDisplay,
  contactPhoneHref,
} from '@/lib/contact-entry'

/**
 * Deep-navy footer: the school's blurb and social links, its quick-link columns
 * (`footer.columns`, any number), then how to reach it. The bottom strip carries
 * the copyright and the privacy notice, as on every template.
 */
export default function Footer({ data }: { data: SchoolData; editing?: boolean }) {
  const contact = data.contact
  const columns = (data.footer?.columns ?? []).filter((column) => column.links?.length)
  const socials = (data.socialLinks ?? []).filter((s) => s.url && s.url !== '#')

  return (
    <footer className="mt-auto bg-ts-navy-900 text-white/75">
      <div className="h-1 bg-gradient-to-r from-ts-accent via-ts-primary to-ts-teal" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Link href="/" className="flex items-center gap-3">
            {data.logo && (
              <Image src={data.logo} alt="" width={56} height={56} className="h-14 w-14 rounded-full bg-white object-contain p-1" />
            )}
            <span className="font-[family-name:var(--font-ts-serif)] text-xl font-bold text-white">{data.name}</span>
          </Link>
          {data.footer?.description && (
            <p data-edit="footer.description" className="mt-5 text-[15px] leading-7">
              {data.footer.description}
            </p>
          )}
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-ts-accent hover:text-ts-navy"
                >
                  <Icon icon={social.icon || `ri:${social.platform}-fill`} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>

        {columns.map((column, ci) => (
          <div key={`col-${ci}`} className={columns.length > 1 ? 'lg:col-span-2' : 'lg:col-span-4'}>
            <h3 data-edit={`footer.columns.${ci}.title`} className="text-base font-bold text-white">
              {column.title}
            </h3>
            <span className="mt-2 block h-0.5 w-10 bg-ts-accent" />
            <ul
              className={`mt-5 grid gap-x-6 gap-y-2.5 text-[15px] ${
                columns.length === 1 && column.links.length > 6 ? 'sm:grid-cols-2' : ''
              }`}
            >
              {column.links.map((link, li) => (
                <li key={`l-${li}`}>
                  <Link href={link.href} className="flex items-start gap-2 transition-colors hover:text-ts-accent">
                    <Icon icon="lucide:chevron-right" className="mt-1 h-3.5 w-3.5 shrink-0 text-ts-accent" />
                    <span data-edit={`footer.columns.${ci}.links.${li}.label`}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-4">
          <h3 className="text-base font-bold text-white">Get in touch</h3>
          <span className="mt-2 block h-0.5 w-10 bg-ts-accent" />
          <ul className="mt-5 space-y-3.5 text-[15px]">
            {contact?.address && (
              <li className="flex gap-3">
                <Icon icon="lucide:map-pin" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
                <span data-edit="contact.address" className="whitespace-pre-line">{contact.address}</span>
              </li>
            )}
            {(contact?.phone ?? []).map((phone, i) => (
              <li key={`p-${i}`} className="flex gap-3">
                <Icon icon="lucide:phone" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
                <a href={contactPhoneHref(phone)} className="hover:text-ts-accent">
                  {contactPhoneDisplay(phone)}
                </a>
              </li>
            ))}
            {(contact?.email ?? []).map((email, i) => (
              <li key={`e-${i}`} className="flex gap-3">
                <Icon icon="lucide:mail" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
                <a href={`mailto:${contactEntryValue(email)}`} className="break-all hover:text-ts-accent">
                  {contactEntryValue(email)}
                </a>
              </li>
            ))}
            {contact?.workingHours && (
              <li className="flex gap-3">
                <Icon icon="lucide:clock" className="mt-1 h-4 w-4 shrink-0 text-ts-accent" />
                <span data-edit="contact.workingHours">{contact.workingHours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-[13px] text-white/55 lg:px-8">
          <span data-edit="footer.copyright">{data.footer?.copyright}</span>
          <span className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <span>
              Powered by{' '}
              <a href="https://leeep.in" className="font-semibold text-white/75 hover:text-white">
                Leeep
              </a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  )
}
