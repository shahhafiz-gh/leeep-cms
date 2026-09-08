'use client'

import { Icon } from '@iconify/react'
import type { AcademicResource, SchoolData } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import PageSection from '@/shared/PageSection'

/** The anchor a resource answers to, matching the menu's `/academics#resource-<title>`. */
export function resourceAnchor(title: string) {
  return `resource-${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

/**
 * Syllabus, booklists and stationery lists — the downloads that belong to
 * academics rather than to a downloads page of their own.
 *
 * Each resource is its own anchored block because the menu links straight to
 * one ("Syllabus", "List of Notebooks"), and families arrive looking for their
 * child's class inside it.
 */
export default function AcademicResources({ data }: { data: SchoolData }) {
  const resources = useLiveList<AcademicResource>('academics.resources', data.academics?.resources ?? [])
  if (!resources.length) return null

  return (
    <section className="bg-th-paper py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 data-edit="academics.resourcesTitle" className="text-2xl font-bold text-th-heading md:text-3xl">
            {data.academics?.resourcesTitle || 'Downloads'}
          </h2>
          <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />
          {data.academics?.resourcesDescription && (
            <p
              data-edit="academics.resourcesDescription"
              className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-th-body"
            >
              {data.academics.resourcesDescription}
            </p>
          )}
        </div>

        <div className="mt-10 space-y-10">
          {resources.map((resource, index) => (
            <PageSection key={`${resource.title}-${index}`} id={resourceAnchor(resource.title)}>
              <div className="border border-th-line bg-white p-6 md:p-8">
                <h3
                  data-edit={`academics.resources.${index}.title`}
                  className="text-lg font-semibold text-th-heading"
                >
                  {resource.title}
                </h3>
                {resource.description && (
                  <p
                    data-edit={`academics.resources.${index}.description`}
                    className="mt-2 text-sm leading-7 text-th-body"
                  >
                    {resource.description}
                  </p>
                )}

                {(resource.files ?? []).length > 0 && (
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(resource.files ?? []).map((file, fileIndex) => (
                      <li key={`${file.url}-${fileIndex}`}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 border border-th-line px-3.5 py-2.5 text-[13px] font-medium text-th-heading transition-colors hover:border-th-primary hover:text-th-primary"
                        >
                          <Icon icon="lucide:file-down" className="h-4 w-4 shrink-0 text-th-primary" />
                          <span
                            data-edit={`academics.resources.${index}.files.${fileIndex}.label`}
                            className="min-w-0 truncate"
                          >
                            {file.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </PageSection>
          ))}
        </div>
      </div>
    </section>
  )
}
