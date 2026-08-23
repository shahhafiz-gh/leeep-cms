'use client'

import type { SchoolData, TeamMember } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'
import Photo from '../components/common/Photo'
import { Eyebrow, Pill } from '../components/common/Bits'

/** Almanac — Team. A people-first editorial profile and staff directory. */
export default function TeamView({ data }: { data: SchoolData }) {
  const team = data.team
  const members = useLiveList<TeamMember>('team.members', team?.members ?? [])

  if (!team) return null

  // A school's leader is commonly already present in the directory before a
  // separate head's-desk portrait is uploaded. Reuse that official profile
  // photo as a sensible fallback, while always preferring the dedicated image.
  const headPortraitMember =
    members.find((person) => /chair(man|person)/i.test(person.role)) ??
    members.find((person) => /principal|head of school/i.test(person.role))
  const headPortrait = team.message?.image || headPortraitMember?.image

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-14 pt-12 md:px-8 lg:px-12 lg:pb-20 lg:pt-18">
        <div className="grid grid-cols-1 gap-10 border-b border-tf-rail pb-12 lg:grid-cols-[0.42fr_1fr] lg:gap-16 lg:pb-18">
          <div>
            <Eyebrow className="mb-5" data-edit="team.subtitle">{team.subtitle || 'Our people'}</Eyebrow>
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-tf-faint">
              faculty / leadership / staff
            </div>
          </div>
          <div>
            <h1
              data-edit="team.title"
              className="m-0 max-w-[12ch] text-[42px] leading-[0.98] tracking-[-0.05em] text-tf-ink sm:text-[60px] lg:text-[82px]"
            >
              {team.title}
            </h1>
            <p
              data-edit="team.description"
              className="m-0 mt-8 max-w-[67ch] whitespace-pre-line text-[17px] leading-[1.75] text-tf-body lg:text-[19px]"
            >
              {team.description}
            </p>
          </div>
        </div>
      </section>

      {team.message && (team.message.content || team.message.name || team.message.image) && (
        <section className="bg-tf-ink text-tf-on-ink">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]">
            <Photo
              src={headPortrait}
              alt={headPortraitMember?.name || team.message.name || 'School leader'}
              caption="portrait — head of school"
              editPath="team.message.image"
              rounded="rounded-none"
              className="min-h-[360px] lg:min-h-[580px]"
              fill
            />
            <div className="flex flex-col justify-center px-5 py-12 md:px-10 lg:px-12 lg:py-12">
              <Eyebrow onInk className="mb-5">From the head&apos;s desk</Eyebrow>
              <span className="tf-serif mb-3 text-[48px] leading-[0.5] text-tf-accent-soft" aria-hidden>“</span>
              <blockquote
                data-edit="team.message.content"
                className="m-0 max-w-[42ch] whitespace-pre-line text-[21px] leading-[1.45] tracking-[-0.015em] text-tf-on-ink sm:text-[23px] lg:text-[20px]"
              >
                {team.message.content}
              </blockquote>
              <div className="mt-6 border-t border-tf-ink-line pt-4">
                <div data-edit="team.message.name" className="text-[16px] font-semibold text-tf-on-ink">
                  {team.message.name}
                </div>
                <div data-edit="team.message.role" className="mt-1 text-[13px] uppercase tracking-[0.13em] text-tf-on-ink-muted">
                  {team.message.role}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 lg:px-12 lg:py-24">
        <div className="mb-12 flex flex-col gap-5 border-b border-tf-rail pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow className="mb-4">The directory</Eyebrow>
            <h2 className="m-0 text-[36px] leading-none text-tf-ink sm:text-[48px] lg:text-[58px]">
              Meet our <span className="tf-serif italic text-tf-accent">team.</span>
            </h2>
          </div>
          <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-tf-faint">
            {String(members.length).padStart(2, '0')} people
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((person, index) => (
            <article key={`${person.name}-${index}`} className={index % 4 === 1 || index % 4 === 3 ? 'lg:pt-12' : ''}>
              <Photo
                src={person.image}
                alt={person.name}
                caption="portrait — team member"
                editPath={`team.members.${index}.image`}
                className="aspect-4/5 w-full"
                rounded="rounded-[18px]"
              />
              <div className="mt-5 border-t border-tf-border pt-4">
                {person.department && (
                  <Pill className="mb-3">
                    <span data-edit={`team.members.${index}.department`}>{person.department}</span>
                  </Pill>
                )}
                <h3 data-edit={`team.members.${index}.name`} className="m-0 text-[22px] leading-tight text-tf-ink">
                  {person.name}
                </h3>
                <p data-edit={`team.members.${index}.role`} className="m-0 mt-1.5 text-[14px] font-semibold text-tf-accent">
                  {person.role}
                </p>
                {person.qualification && (
                  <p data-edit={`team.members.${index}.qualification`} className="m-0 mt-3 font-mono text-[11.5px] uppercase tracking-[0.08em] text-tf-faint">
                    {person.qualification}
                  </p>
                )}
                {person.bio && (
                  <p data-edit={`team.members.${index}.bio`} className="m-0 mt-4 text-[14.5px] leading-[1.65] text-tf-muted">
                    {person.bio}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        <AddItemButton path="team.members" label="Add team member" />
      </section>
    </>
  )
}
