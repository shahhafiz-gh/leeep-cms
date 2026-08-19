'use client'

import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Build the href for the application form page.
 *
 * The form lives on its own route (`/admissions/apply`), so the admissions page
 * can stay an information page. Two things have to survive the hop:
 *
 *  - the **query string** — on dev and in the builder preview the school comes
 *    from `?school=` / `?subdomain=` / `?preview=`, so dropping it would land the
 *    applicant on the wrong site (or none);
 *  - the **`/demo` prefix** — the neutral template demo renders the same views
 *    under `/demo/...?template=X`, and an absolute `/admissions/apply` would
 *    escape the demo into a real school's route.
 */
export function useApplyHref(params?: { program?: string; admission?: string }): string {
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()

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
  const searchParams = useSearchParams()

  const inDemo = pathname === '/demo' || pathname.startsWith('/demo/')
  const path = inDemo ? '/demo/admissions' : '/admissions'

  const query = new URLSearchParams(searchParams?.toString() ?? '')
  query.delete('program')
  query.delete('admission')
  const search = query.toString()
  return search ? `${path}?${search}` : path
}
