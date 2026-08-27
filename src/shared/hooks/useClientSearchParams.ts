'use client'

import { useEffect, useState } from 'react'

/**
 * The page's query string, read on the CLIENT only.
 *
 * Next's own `useSearchParams` cannot be called inside a statically rendered
 * page without a `<Suspense>` boundary: the query is not known when the page is
 * prerendered, so the component bails out to client-side rendering and — with
 * no boundary above it — takes the whole route down with a 500. That was the
 * price of caching the public pages, and it surfaced on exactly the two routes
 * that read a query string.
 *
 * Wrapping every consumer in Suspense would have worked, but it would have
 * punched a hole in the static HTML of the admissions pages, which are the ones
 * most worth having in the index. Reading the query after mount instead keeps
 * the prerendered markup complete and identical on the server and the first
 * client render, so there is no hydration mismatch — the values simply arrive a
 * tick later, which for a link href or a form prefill nobody can perceive.
 *
 * Returns `null` until mounted, so callers can tell "not read yet" from "read,
 * and empty".
 */
export function useClientSearchParams(): URLSearchParams | null {
  const [params, setParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search))
  }, [])

  return params
}

/** One parameter, or '' before mount / when absent. */
export function useClientSearchParam(key: string): string {
  const params = useClientSearchParams()
  return params?.get(key) ?? ''
}
