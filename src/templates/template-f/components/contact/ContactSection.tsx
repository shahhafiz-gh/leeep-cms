'use client'

import type { SchoolData } from '@/types/school.types'
import { contactEntryValue } from '@/lib/contact-entry'
import { useLiveValue } from '@/shared/hooks/useLiveValue'
import { toMapEmbedUrl } from '@/shared/map-embed'
import Photo from '../common/Photo'
import { Eyebrow } from '../common/Bits'

/**
 * Contact — a ruled directory on the left, map and address card on the right.
 *
 * The map URL is owned in React state via `useLiveValue`: the inline editor
 * patches element TEXT by path, which cannot reach an `<iframe src>`, so the
 * component has to hold the value itself for the preview to update live.
 */
export default function ContactSection({ data }: { data: SchoolData }) {
  const contact = data.contact
  const rawMap = useLiveValue('contact.mapEmbedUrl', contact?.mapEmbedUrl ?? '')
  if (!contact) return null

  const mapUrl = toMapEmbedUrl(rawMap)
  const rows = [
    ...(contact.phone ?? []).map((p, i) => ({ label: 'Telephone', value: contactEntryValue(p), path: `contact.phone.${i}.value`, href: `tel:${contactEntryValue(p)}` })),
    ...(contact.email ?? []).map((e, i) => ({ label: 'Email', value: contactEntryValue(e), path: `contact.email.${i}.value`, href: `mailto:${contactEntryValue(e)}` })),
    ...(contact.visitingHours ?? []).map((v, i) => ({
      label: v.label,
      value: v.time,
      path: `contact.visitingHours.${i}.time`,
      href: undefined,
    })),
  ]

  return (
    <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 pb-20 pt-12 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pt-18">
      <div>
        <Eyebrow className="mb-5">{contact.subtitle || 'Contact'}</Eyebrow>
        <h1
          data-edit="contact.title"
          className="m-0 mb-7 text-[38px] leading-[1.02] tracking-[-0.04em] text-tf-ink sm:text-[52px] lg:text-[68px] lg:leading-none"
        >
          {contact.title}
        </h1>
        {contact.description && (
          <p
            data-edit="contact.description"
            className="m-0 mb-9 max-w-[50ch] text-[17px] leading-[1.62] text-tf-body lg:text-[18px]"
          >
            {contact.description}
          </p>
        )}

        {rows.length > 0 && (
          <div className="flex flex-col border-t border-tf-border">
            {rows.map((row, i) => (
              <div
                key={`${row.path}-${i}`}
                className="grid grid-cols-1 gap-1 border-b border-tf-border py-5 sm:grid-cols-[190px_1fr] sm:gap-6"
              >
                <div className="text-[14px] font-semibold text-tf-ink">{row.label}</div>
                {row.href ? (
                  <a href={row.href} data-bind={row.path} className="text-[15px] text-tf-accent break-words">
                    {row.value}
                  </a>
                ) : (
                  <span data-edit={row.path} className="text-[15px] text-tf-body">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            title={`${data.name} location`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[300px] w-full rounded-[20px] border-0 lg:h-[340px]"
          />
        ) : (
          <Photo
            src={contact.image}
            alt={`${data.name} campus`}
            caption="campus map or photo — add a map embed URL in Settings"
            editPath="contact.image"
            className="h-[300px] w-full lg:h-[340px]"
          />
        )}

        <div className="flex flex-col gap-4 rounded-[20px] bg-tf-panel p-8">
          <h2 data-bind="name" className="m-0 text-[24px] tracking-[-0.025em] text-tf-ink lg:text-[26px]">
            {data.name}
          </h2>
          <div data-edit="contact.address" className="text-[16px] leading-[1.75] whitespace-pre-line text-tf-body">
            {contact.address}
          </div>
          {contact.workingHours && (
            <div
              data-edit="contact.workingHours"
              className="border-t border-tf-border-strong pt-4 text-[15px] leading-[1.7] text-tf-body"
            >
              {contact.workingHours}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
