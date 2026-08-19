'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useAdmissionsHref } from './apply-link'

/**
 * The way back from the application form to the admissions page.
 *
 * The form lives on its own route, so a family that arrives wanting to re-read
 * the age windows or fees needs an obvious way back that keeps the school /
 * preview query string intact.
 */
export default function BackToAdmissions({
  className,
  label = 'Back to admission details',
}: {
  className?: string
  label?: string
}) {
  const href = useAdmissionsHref()
  return (
    <Link href={href} className={className}>
      <Icon icon="lucide:arrow-left" />
      {label}
    </Link>
  )
}
