'use client'

import Link from 'next/link'
import { useApplyHref } from './apply-link'
import { useAdmissionOverview } from './useAdmissionOverview'

/**
 * A "Start your application" call to action that only exists when the school is
 * actually admitting.
 *
 * The check is deliberately here rather than in each template: a link that
 * leads to a form nobody can submit is worse than no link, and every template
 * has one of these on its admissions hero or fees panel. When no admission
 * window is open the button is replaced by a short note (or nothing, if the
 * surrounding design has no room for one).
 */
export default function StartApplicationLink({
  className,
  closedClassName,
  label = 'Start your application',
  closedLabel = 'Admissions are currently closed.',
  hideWhenClosed = false,
}: {
  className?: string
  closedClassName?: string
  label?: string
  closedLabel?: string
  /** Render nothing at all when closed, instead of the note. */
  hideWhenClosed?: boolean
}) {
  const { loading, isOpen, active } = useAdmissionOverview()
  const href = useApplyHref({ admission: active?.name })

  // Say nothing until we know — a button that appears and then vanishes reads
  // as a glitch, and a premature "closed" would be a lie half the time.
  if (loading) return null

  if (!isOpen) {
    if (hideWhenClosed) return null
    return <p className={closedClassName}>{closedLabel}</p>
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}
