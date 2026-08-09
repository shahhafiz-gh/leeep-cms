import Link from 'next/link'

/**
 * Ledger's repeated primitives. The design is built almost entirely from three
 * moves — a small-caps serif eyebrow, a hairline rule, and a square button —
 * so they live here and nowhere else.
 */

/** The page container. One measure for the whole template. */
export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-[1120px] px-5 sm:px-6 ${className}`}>{children}</div>
}

/** Small-caps serif label that opens a section. */
export function Eyebrow({
  children,
  onInk = false,
  className = '',
  ...rest
}: {
  children: React.ReactNode
  onInk?: boolean
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`m-0 font-(family-name:--font-te-serif) text-[13px] font-semibold uppercase tracking-[0.16em] sm:text-[15px] ${
        onInk ? 'text-te-on-ink-faint' : 'text-te-accent'
      } ${className}`}
      {...rest}
    >
      {children}
    </h2>
  )
}

/** Page title + standfirst, the opener every inner page shares. */
export function PageIntro({
  title,
  lede,
  titlePath,
  ledePath,
  children,
}: {
  title: React.ReactNode
  lede?: React.ReactNode
  titlePath?: string
  ledePath?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex max-w-[720px] flex-col gap-4">
      <h1 data-edit={titlePath} className="m-0 text-[30px] leading-tight text-te-ink sm:text-[36px] lg:text-[40px]">
        {title}
      </h1>
      {lede && (
        <p data-edit={ledePath} className="m-0 text-[16px] leading-[1.7] text-te-body sm:text-[17px]">
          {lede}
        </p>
      )}
      {children}
    </div>
  )
}

/** Square primary / ghost action. */
export function Action({
  href,
  children,
  variant = 'solid',
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: 'solid' | 'ghost'
  className?: string
}) {
  const styles =
    variant === 'solid'
      ? 'bg-te-accent text-te-paper hover:bg-te-accent-ink'
      : 'border border-te-ink text-te-ink hover:bg-te-panel-alt'
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-6 py-3 text-[14px] font-semibold tracking-[0.04em] transition-colors ${styles} ${className}`}
    >
      {children}
    </Link>
  )
}

/** Inline "more" link with the design's trailing arrow. */
export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[13.5px] font-semibold text-te-accent hover:underline">
      {children} →
    </Link>
  )
}

/**
 * One row of a ruled definition list — the design's way of presenting any
 * label/value pair. Stacks on narrow screens so a long value never collides
 * with its label.
 */
export function RuledRow({
  label,
  value,
  labelPath,
  valuePath,
}: {
  label: React.ReactNode
  value: React.ReactNode
  labelPath?: string
  valuePath?: string
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-te-rule py-3 text-[14.5px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span data-edit={labelPath} className="text-te-muted">{label}</span>
      <span data-edit={valuePath} className="text-te-ink sm:text-right">{value}</span>
    </div>
  )
}
