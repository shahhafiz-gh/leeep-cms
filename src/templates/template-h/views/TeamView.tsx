'use client'

import { Icon } from '@iconify/react'
import type { SchoolData, TeamMember } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'

/**
 * Faculty, grouped under department headings.
 *
 * The shared Team view prints each person's department as a caption under their
 * name, which for a school that lists forty staff across four departments reads
 * as one long undifferentiated grid. The old DGS site instead led with the
 * department — Accounts, Management, Board Members, Admin — and that is the
 * structure staff and parents actually navigate by.
 *
 * Departments appear in the order they are first written, so reordering members
 * in the builder reorders the sections; members with no department fall into a
 * final untitled group rather than being dropped. A team where nobody has a
 * department renders as one plain grid, exactly like the shared view.
 */
export default function TeamView({ data }: { data: SchoolData }) {
  const team = data.team
  const members = useLiveList<TeamMember>('team.members', team?.members ?? [])
  if (!team) return null

  // Preserve authored order, both of the groups and within them, and carry each
  // member's ORIGINAL index so inline-edit paths keep pointing at the right row.
  const groups: { name: string; members: { member: TeamMember; index: number }[] }[] = []
  members.forEach((member, index) => {
    const name = (member.department || '').trim()
    let group = groups.find((g) => g.name === name)
    if (!group) {
      group = { name, members: [] }
      groups.push(group)
    }
    group.members.push({ member, index })
  })
  // An unnamed group is a remainder, so it belongs last.
  groups.sort((a, b) => Number(!a.name) - Number(!b.name))

  return (
    <div className="bg-white">
      <section className="bg-th-paper py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          {team.subtitle && (
            <p data-edit="team.subtitle" className="text-xs font-semibold uppercase tracking-[0.2em] text-th-primary">
              {team.subtitle}
            </p>
          )}
          <h1 data-edit="team.title" className="mt-3 text-3xl font-bold text-th-heading md:text-4xl">
            {team.title}
          </h1>
          <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
          {team.description && (
            <p data-edit="team.description" className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-th-body">
              {team.description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 md:py-20">
        {groups.map((group) => (
          <section key={group.name || '__ungrouped'} className="mb-14 last:mb-0">
            {group.name && (
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-lg font-semibold uppercase tracking-wide text-th-heading">
                  {group.name}
                </h2>
                <span className="h-px flex-1 bg-th-line" />
                <span className="text-xs font-semibold uppercase tracking-wider text-th-muted">
                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                </span>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {group.members.map(({ member, index }) => (
                <article
                  key={`${member.name}-${index}`}
                  className="group border border-th-line bg-white transition-all hover:-translate-y-1 hover:border-th-primary hover:shadow-[0_16px_40px_rgba(185,71,59,0.12)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-th-primary-50">
                    {member.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.image}
                        alt={member.name}
                        data-edit-img={`team.members.${index}.image`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        data-edit-img={`team.members.${index}.image`}
                        className="grid h-full w-full place-items-center text-th-primary"
                      >
                        <Icon icon="lucide:user-round" className="h-12 w-12" />
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      data-edit={`team.members.${index}.name`}
                      className="text-[15px] font-semibold leading-snug text-th-heading"
                    >
                      {member.name}
                    </h3>
                    <p
                      data-edit={`team.members.${index}.role`}
                      className="mt-1 text-xs font-semibold uppercase tracking-wider text-th-primary"
                    >
                      {member.role}
                    </p>
                    {member.qualification && (
                      <p
                        data-edit={`team.members.${index}.qualification`}
                        className="mt-2 text-xs text-th-muted"
                      >
                        {member.qualification}
                      </p>
                    )}
                    {member.bio && (
                      <p
                        data-edit={`team.members.${index}.bio`}
                        className="mt-3 text-sm leading-6 text-th-body"
                      >
                        {member.bio}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
