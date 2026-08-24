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

  if (loading) {
    return (
      <span className={className} role="status" aria-live="polite">
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]" />
        Checking admissions…
      </span>
    )
  }

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
