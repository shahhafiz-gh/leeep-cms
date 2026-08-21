'use client'

import { useState } from 'react'
import type { SchoolData, MagazineIssue } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { Eyebrow } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'
import MagazineReader from './MagazineReader'

/**
 * The magazine shelf — the school's own publication, given a whole block.
 *
 * The newest issue is shown as a cover, held at the angle a magazine actually
 * sits at, with the back catalogue listed beside it as a dated index. That
 * split is the point: the cover is what makes someone want to open it, the
 * index is what makes an old issue findable.
 *
 * An issue is opened one of two ways, decided per issue by the content itself.
 * With `pages` it is read IN the site through MagazineReader — the case for a
 * school whose magazine is a scan, a set of page images and no hosted PDF. With
 * only a `url` it stays a plain outbound link to wherever the school hosts it.
 */
export default function MagazineSection({ data }: { data: SchoolData }) {
  const magazine = data.magazine
  const issues = useLiveList<MagazineIssue>('magazine.issues', magazine?.issues ?? [])
  // Which issue the reader is showing, by index; null while it is closed.
  const [reading, setReading] = useState<number | null>(null)
  if (issues.length === 0) return null

  const [latest, ...rest] = issues
  const readable = (issue: MagazineIssue) => (issue.pages?.length ?? 0) > 0

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* Cover — the stacked sheet behind it is decorative, so it is inert and
            hidden from assistive tech. */}
        <div className="relative mx-auto w-full max-w-[340px] lg:mx-0">
          <div
            aria-hidden
            className="absolute inset-0 -translate-x-3 translate-y-2 -rotate-3 rounded-[16px] bg-tf-panel"
          />
          {(() => {
            const coverClass =
              'relative block aspect-3/4 w-full overflow-hidden rounded-[16px] shadow-[0_18px_50px_-20px_rgba(36,24,16,0.55)] transition-transform hover:-translate-y-1'
            const cover = (
              <Photo
                fill
                src={latest.cover}
                alt={`${latest.title} cover`}
                caption="magazine cover"
                editPath="magazine.issues.0.cover"
                rounded=""
                className="h-full w-full"
              />
            )
            return readable(latest) ? (
              <button
                type="button"
                onClick={() => setReading(0)}
                aria-label={`Read ${latest.title}`}
                className={coverClass}
              >
                {cover}
              </button>
            ) : (
              <a href={latest.url} target="_blank" rel="noopener noreferrer" className={coverClass}>
                {cover}
              </a>
            )
          })()}
        </div>

        <div>
          <Eyebrow data-edit="magazine.subtitle">{magazine?.subtitle || 'School magazine'}</Eyebrow>
          <h2
            data-edit="magazine.title"
            className="mt-3 mb-4 max-w-[16ch] text-[34px] leading-[1.05] text-tf-ink sm:text-[42px] lg:text-[52px]"
          >
            {magazine?.title || 'The magazine'}
          </h2>
          {magazine?.description && (
            <p
              data-edit="magazine.description"
              className="m-0 mb-8 max-w-[54ch] text-[16px] leading-[1.6] text-tf-muted lg:text-[17px]"
            >
              {magazine.description}
            </p>
          )}

          <div className="border-t border-tf-border">
            {issues.map((issue, i) => {
              const rowClass =
                'grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-tf-border py-4 text-left transition-colors hover:bg-tf-panel'
              const Row = readable(issue) ? 'button' : 'a'
              const rowProps = readable(issue)
                ? ({ type: 'button', onClick: () => setReading(i) } as const)
                : ({ href: issue.url, target: '_blank', rel: 'noopener noreferrer' } as const)
              return (
                <Row key={`${issue.url}-${i}`} className={rowClass} {...rowProps}>
                {/* The issue number, in the serif — the one numeral in the design
                    that is allowed to be decorative. */}
                <span className="tf-serif w-8 text-[19px] text-tf-accent tabular-nums">
                  {issue.issue || String(issues.length - i).padStart(2, '0')}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    data-edit={`magazine.issues.${i}.title`}
                    className="text-[16px] leading-[1.35] font-medium text-tf-ink lg:text-[17px]"
                  >
                    {issue.title}
                  </span>
                  {issue.summary && (
                    <span className="text-[14px] leading-[1.5] text-tf-muted">{issue.summary}</span>
                  )}
                </span>
                <span className="shrink-0 text-[12px] tracking-[0.12em] whitespace-nowrap text-tf-faint uppercase">
                  {readable(issue)
                    ? `Read · ${issue.pages!.length} pages`
                    : i === 0 && rest.length > 0
                      ? 'Latest'
                      : issue.date || 'Read'}
                </span>
                </Row>
              )
            })}
          </div>

          <AddItemButton path="magazine.issues" label="Add issue" />
        </div>
      </div>

      {reading !== null && issues[reading] && (
        <MagazineReader issue={issues[reading]} onClose={() => setReading(null)} />
      )}
    </section>
  )
}
