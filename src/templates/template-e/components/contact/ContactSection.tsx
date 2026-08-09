'use client'

import type { SchoolData } from '@/types/school.types'
import { useLiveValue } from '@/shared/hooks/useLiveValue'
import { useLiveList } from '@/shared/hooks/useLiveList'
import { toMapEmbedUrl } from '@/shared/map-embed'
import Photo from '../common/Photo'
import { Container } from '../common/Bits'

/**
 * Contact — an address block and a ruled department register beside the map.
 *
 * The map URL is owned in React state via `useLiveValue`: the inline editor
 * patches element TEXT by path, which cannot reach an `<iframe src>`, so the
 * component has to hold the value itself for the preview to update live.
 */
export default function ContactSection({ data }: { data: SchoolData }) {
  const contact = data.contact
  const rawMap = useLiveValue('contact.mapEmbedUrl', contact?.mapEmbedUrl ?? '')
  const hours = useLiveList('contact.visitingHours', contact?.visitingHours ?? [])
  if (!contact) return null

  const mapUrl = toMapEmbedUrl(rawMap)

  return (
    <Container className="py-10 sm:py-12 lg:py-14">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-7">
          <h1 data-edit="contact.title" className="m-0 text-[30px] text-te-ink sm:text-[36px] lg:text-[40px]">
            {contact.title}
          </h1>

          <div className="text-[15.5px] leading-[1.8] text-te-body">
            <div data-bind="name" className="text-te-ink">{data.name}</div>
            <div data-edit="contact.address" className="whitespace-pre-line">{contact.address}</div>
            {(contact.phone ?? []).map((p, i) => (
              <div key={p}>
                <a href={`tel:${p}`} data-bind={`contact.phone.${i}`} className="text-te-accent hover:underline">{p}</a>
              </div>
            ))}
            {(contact.email ?? []).map((e, i) => (
              <div key={e}>
                <a href={`mailto:${e}`} data-bind={`contact.email.${i}`} className="break-words text-te-accent hover:underline">{e}</a>
              </div>
            ))}
          </div>

          {hours.length > 0 && (
            <div className="flex flex-col">
              {hours.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-1 border-t border-te-rule py-3 text-[14.5px] last:border-b sm:grid-cols-2 sm:gap-4"
                >
                  <span data-edit={`contact.visitingHours.${i}.label`} className="text-te-ink">{row.label}</span>
                  <span data-edit={`contact.visitingHours.${i}.time`} className="text-te-muted">{row.time}</span>
                </div>
              ))}
            </div>
          )}

          {contact.description && (
            <p data-edit="contact.description" className="m-0 text-[14.5px] leading-[1.7] text-te-body">
              {contact.description}
            </p>
          )}
        </div>

        {mapUrl ? (
          <iframe
            src={mapUrl}
            title={`${data.name} location`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full border border-te-rule sm:h-[420px] lg:h-[520px]"
          />
        ) : (
          <Photo
            src={contact.image}
            alt={`${data.name} campus`}
            caption="map: campus location — add a map embed URL in Settings"
            editPath="contact.image"
            className="h-[320px] w-full sm:h-[420px] lg:h-[520px]"
          />
        )}
      </div>
    </Container>
  )
}
