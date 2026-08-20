import Link from 'next/link'

/**
 * Small repeated primitives of the Almanac design language, in one place so the
 * eyebrow tracking / pill radius / section-head rhythm can't drift between the
 * seven page views that use them.
 */

/** Uppercase micro-label above a heading. */
export function Eyebrow({
  children,
  onInk = false,
  className = '',
  ...rest
}: {
  children: React.ReactNode
  /** Rendered on a dark panel — switches to the accent tint legible on ink. */
  onInk?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`text-[12px] uppercase tracking-[0.18em] ${onInk ? 'text-tf-accent-soft' : 'text-tf-accent'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Section heading with an optional right-aligned link, as used across the design. */
export function SectionHead({
  title,
  href,
  linkLabel,
  editPath,
  className = '',
}: {
  title: React.ReactNode
  href?: string
  linkLabel?: string
  editPath?: string
  className?: string
}) {
  return (
    <div className={`mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <h2
        data-edit={editPath}
        className="max-w-[16ch] text-[34px] leading-[1.05] text-tf-ink sm:text-[42px] lg:text-[52px]"
      >
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 text-[15px] font-semibold text-tf-ink transition-colors hover:text-tf-accent"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

/** Accent chip — grade ranges, categories, tags. */
export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex self-start rounded-full bg-tf-accent-wash px-[11px] py-[5px] text-[12px] font-semibold tracking-[0.04em] text-tf-accent ${className}`}
    >
      {children}
    </span>
  )
}

/** Outlined chip used for subject/feature lists. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-tf-border px-3 py-1.5 text-[13px] text-tf-body">
      {children}
    </span>
  )
}

/** Primary (accent, filled) and secondary (ink, filled) round buttons. */
export function ActionLink({
  href,
  children,
  variant = 'accent',
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: 'accent' | 'ink' | 'outline-on-ink'
  className?: string
}) {
  const styles = {
    accent: 'bg-tf-accent text-white hover:opacity-90',
    ink: 'bg-tf-ink text-tf-on-ink hover:opacity-90',
    'outline-on-ink': 'border border-tf-ink-border text-tf-on-ink hover:bg-white/5',
  }[variant]

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-[26px] py-[15px] text-[15px] font-semibold transition-opacity ${styles} ${className}`}
    >
      {children}
    </Link>
  )
}
