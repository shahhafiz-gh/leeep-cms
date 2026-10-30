import Image from '@/shared/SiteImage'
/**
 * Filled slots render through `next/image`, which serves AVIF/WebP at the size
 * the viewport actually needs instead of the original upload. Only the `fill`
 * variant is converted: it already lives inside a `relative` frame whose box the
 * picture is absolutely positioned into, so the optimiser is a drop-in with no
 * layout consequences. The intrinsic-size variant keeps a plain `<img>` — it is
 * sized entirely by CSS and has no dimensions to give `next/image`, and guessing
 * them is how you introduce layout shift.
 *
 * `sizes` is deliberately conservative: these slots are full-width on a phone
 * and at most half the page on a desktop, so that is what the browser is told.
 */

/** Full width on a phone, at most half the page on a desktop. */
const sizes = '(max-width: 768px) 100vw, 50vw'

interface PhotoProps {
  src?: string | null
  alt?: string
  /** Bracketed slot note, e.g. "students crossing the quad, early fall". */
  caption?: string
  /** Content path, e.g. "hero.slides.0.image" — makes the slot an upload target. */
  editPath?: string
  className?: string
  /**
   * Fill the space the layout gives this slot instead of sizing to the image.
   * An `<img>` used directly as an auto-sized grid item contributes its intrinsic
   * height and silently stretches the row, so anything that must match a
   * neighbouring column's height needs this.
   */
  fill?: boolean
  /**
   * Load this image eagerly and hint it to the browser as a preload.
   *
   * Reserve it for the ONE image above the fold — normally the hero. That image
   * is almost always the page's Largest Contentful Paint, and lazy-loading the
   * LCP element means the browser only starts fetching it after layout, which
   * is a measurable delay for no saving. Everything below the fold stays lazy.
   */
  priority?: boolean
}

/**
 * Ledger's photo slot: a square, hairline-bordered frame. When empty it shows
 * the design's own placeholder — a 45° hatch with a bracketed monospace note
 * naming the shot — so a half-finished site still reads as the printed
 * prospectus it is imitating rather than as a broken page.
 */
export default function Photo({
  src,
  alt = '',
  caption = 'photo',
  editPath,
  className = '',
  fill = false,
  priority = false,
}: PhotoProps) {
  const hatch =
    'bg-[repeating-linear-gradient(45deg,#e9e3d5_0_12px,#f0ebe0_12px_24px)]'

  const note = (
    <span className="px-4 text-center font-mono text-[11px] leading-snug text-te-faint">
      [{caption}]
    </span>
  )

  if (fill) {
    return (
      <div className={`relative overflow-hidden border border-te-rule ${className}`}>
        {src ? (
          <Image src={src} alt={alt} data-edit-img={editPath} fill sizes={sizes} priority={priority} className="object-cover" />
        ) : (
          <div data-edit-img={editPath} className={`absolute inset-0 grid place-items-center ${hatch}`}>
            {note}
          </div>
        )}
      </div>
    )
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img loading="lazy" decoding="async"
        src={src}
        alt={alt}
        data-edit-img={editPath}
        className={`border border-te-rule object-cover ${className}`}
      />
    )
  }

  return (
    <div
      data-edit-img={editPath}
      className={`grid place-items-center border border-te-rule ${hatch} ${className}`}
    >
      {note}
    </div>
  )
}
