'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchAdmissionOverview, type AdmissionOverview, type AdmissionWindow } from './admission-schema'

/**
 * What the public admissions page needs: the open admission windows and the
 * class-wise criteria inside each.
 *
 * A school usually runs ONE admission at a time, so a single window is selected
 * automatically and no picker is shown — the family lands on the page and is
 * already looking at their admission. Only when a school runs several in
 * parallel (a separate senior-school intake, say) does a chooser appear.
 */
export function useAdmissionOverview(academicYear?: string) {
  const [overview, setOverview] = useState<AdmissionOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const result = await fetchAdmissionOverview(academicYear)
      if (cancelled) return
      setOverview(result)
      // Default selection: the only window, or the first of several.
      const first = result?.admissions?.[0]
      if (first) setSelected(first.name)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [academicYear])

  const admissions: AdmissionWindow[] = overview?.admissions ?? []
  const active = useMemo(
    () => admissions.find((entry) => entry.name === selected) ?? admissions[0] ?? null,
    [admissions, selected],
  )

  return {
    loading,
    /** True only once we know: the backend has at least one open window with classes. */
    isOpen: !loading && !!overview?.open && admissions.length > 0,
    admissions,
    active,
    selected: active?.name ?? '',
    setSelected,
    /** A chooser is only worth showing when there is a choice to make. */
    hasChoice: admissions.length > 1,
    currency: overview?.currency ?? 'INR',
  }
}
