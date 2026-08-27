'use client'

import { usePathname } from 'next/navigation'
import { useClientSearchParams } from './hooks/useClientSearchParams'

/**
 * Build the href for the application form page.
 *
 * The form lives on its own route (`/admissions/apply`), so the admissions page
 * can stay an information page. Two things have to survive the hop:
 *
 *  - the **`/demo` prefix** — the neutral template demo renders the same views
 *    under `/demo/...?template=X`, and an absolute `/admissions/apply` would
 *    escape the demo into a real school's route;
 *  - that demo's **query string**, which names the template being previewed.
 *
 * The school itself is NOT in the query any more — it comes from the host — so
 * the public site has nothing to carry across. That matters here: the query is
 * read with `useClientSearchParams` rather than Next's `useSearchParams`,
 * because the latter cannot run inside a statically rendered page without a
 * Suspense boundary, and these pages are now static. Before mount the href is
 * simply the clean path, which is the correct answer on every real school site.
 */
export function useApplyHref(params?: { program?: string; admission?: string }): string {
  const pathname = usePathname() ?? ''
  const searchParams = useClientSearchParams()

  const inDemo = pathname === '/demo' || pathname.startsWith('/demo/')
  const path = inDemo ? '/demo/admissions/apply' : '/admissions/apply'

  const query = new URLSearchParams(searchParams?.toString() ?? '')
  if (params?.program) query.set('program', params.program)
  else query.delete('program')
  if (params?.admission) query.set('admission', params.admission)
  else query.delete('admission')

  const search = query.toString()
  return search ? `${path}?${search}` : path
}

/** The admissions information page, from the form page's "back" link. */
export function useAdmissionsHref(): string {
  const pathname = usePathname() ?? ''
  const searchParams = useClientSearchParams()

  const inDemo = pathname === '/demo' || pathname.startsWith('/demo/')
  const path = inDemo ? '/demo/admissions' : '/admissions'

  const query = new URLSearchParams(searchParams?.toString() ?? '')
  query.delete('program')
  query.delete('admission')
  const search = query.toString()
  return search ? `${path}?${search}` : path
}
