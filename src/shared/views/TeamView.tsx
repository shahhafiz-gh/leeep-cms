'use client'

import type { SchoolData, TeamMember } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import AddItemButton from '@/shared/AddItemButton'

/**
 * Neutral Team page for templates that do not yet have their own composition.
 * The content contract is shared by every template; Almanac replaces this with
 * its dedicated editorial view.
 */
export default function TeamView({ data }: { data: SchoolData }) {
  const team = data.team
  const members = useLiveList<TeamMember>('team.members', team?.members ?? [])

  if (!team) return null

  return (
    <>
      <section className="border-b border-black/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <p data-edit="team.subtitle" className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
            {team.subtitle}
          </p>
          <h1 data-edit="team.title" className="max-w-4xl text-5xl leading-none tracking-tight sm:text-7xl">
            {team.title}
          </h1>
          <p data-edit="team.description" className="mt-8 max-w-3xl whitespace-pre-line text-lg leading-8 opacity-70">
            {team.description}
          </p>
        </div>
      </section>

      {team.message && (team.message.content || team.message.name || team.message.image) && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-8 bg-black p-6 text-white sm:p-10 lg:grid-cols-[260px_1fr] lg:p-12">
            {team.message.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.message.image}
                alt={team.message.name || 'School leader'}
                data-edit-img="team.message.image"
                className="aspect-4/5 h-full w-full object-cover"
              />
            )}
            <div className="flex flex-col justify-center">
              <blockquote data-edit="team.message.content" className="text-2xl leading-snug sm:text-3xl">
                {team.message.content}
              </blockquote>
              <div className="mt-8 border-t border-white/20 pt-5">
                <div data-edit="team.message.name" className="font-semibold">{team.message.name}</div>
                <div data-edit="team.message.role" className="mt-1 text-sm opacity-60">{team.message.role}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-24 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-5">
            <h2 className="text-3xl sm:text-4xl">Meet our team</h2>
            <span className="text-sm opacity-50">{members.length} members</span>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((person, index) => (
              <article key={`${person.name}-${index}`}>
                <div className="aspect-4/5 overflow-hidden bg-black/5">
                  {person.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.image}
                      alt={person.name}
                      data-edit-img={`team.members.${index}.image`}
                      className="h-full w-full object-cover grayscale"
                    />
                  ) : (
                    <div data-edit-img={`team.members.${index}.image`} className="h-full w-full" />
                  )}
                </div>
                <h3 data-edit={`team.members.${index}.name`} className="mt-5 text-xl">{person.name}</h3>
                <p data-edit={`team.members.${index}.role`} className="mt-1 text-sm font-semibold opacity-60">{person.role}</p>
                {person.department && <p data-edit={`team.members.${index}.department`} className="mt-1 text-sm opacity-50">{person.department}</p>}
              </article>
            ))}
          </div>
          <AddItemButton path="team.members" label="Add team member" />
        </div>
      </section>
    </>
  )
}
