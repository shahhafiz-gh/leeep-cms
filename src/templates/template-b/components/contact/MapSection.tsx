'use client'

import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { useLiveValue } from '@/shared/hooks/useLiveValue'
import { toMapEmbedUrl } from '@/shared/map-embed'

export default function MapSection({ data }: { data: SchoolData }) {
  const { contact } = data
  // Live value + normalization: admins paste regular Google Maps links (which
  // refuse to load in an iframe) — convert to an embeddable URL at render time.
  const mapSrc = toMapEmbedUrl(useLiveValue('contact.mapEmbedUrl', contact.mapEmbedUrl ?? ''))

  return (
    <section className="pb-20 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-tb-heading mb-2.5">Find Us Here</h2>
          <p className="text-tb-body max-w-[480px] mx-auto text-[15px]">
            Visit us at our main campus in Shopian, Kashmir. We&apos;d love to welcome you in person.
          </p>
        </div>

        {/* Map + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-8">
            <div className="rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(65,80,182,0.10)] h-[420px]">
              {mapSrc && (
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${data.name} location`}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_30px_rgba(65,80,182,0.08)] h-[420px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tb-primary-400 to-tb-primary-500 flex items-center justify-center mb-5">
                  <Icon icon="lucide:school" className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-xl text-tb-heading mb-3">{data.name}</h4>
                <p data-edit="contact.address" className="text-tb-body text-sm leading-relaxed mb-5">{contact.address}</p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon icon="lucide:clock" className="text-tb-secondary text-[15px] w-[18px] shrink-0" />
                    <span data-edit="contact.workingHours" className="text-[13px] text-slate-600">{contact.workingHours ?? 'Mon – Sat: 9 AM – 5 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Icon icon="lucide:phone" className="text-tb-secondary text-[15px] w-[18px] shrink-0" />
                    <span data-edit="contact.phone.0" className="text-[13px] text-slate-600">{contact.phone[0]}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Icon icon="lucide:mail" className="text-tb-secondary text-[15px] w-[18px] shrink-0" />
                    <span data-edit="contact.email.0" className="text-[13px] text-slate-600 truncate">{contact.email[0]}</span>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(contact.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-tb-primary-400 text-white font-semibold text-sm rounded-full hover:bg-tb-primary-500 transition-colors w-fit"
              >
                Get Directions
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
