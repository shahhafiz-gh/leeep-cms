import Image from 'next/image'
import { Icon } from '@iconify/react'

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
  /** Image URL. Empty/undefined renders the editorial "photo slot" placeholder. */
  src?: string | null
  alt?: string
  /**
   * Slot caption shown in the placeholder, e.g. "hero photo — students on the
   * quad". It tells the admin exactly which picture belongs here, which is what
   * the source design's monospace chips did.
   */
  caption?: string
  /** Content path of the image, e.g. "hero.slides.0.image" — makes the slot an
   *  upload target for the inline-edit layer (both filled and empty states). */
  editPath?: string
  /** Sizing/shape classes for the frame (fills its parent by default). */
  className?: string
  /** Rounding, kept separate so callers can square off a photo inside a card. */
  rounded?: string
  /** How a supplied image fits its frame. About-page editorial images can use
   *  `contain` so unusually tall or wide uploads remain fully visible. */
  fit?: 'cover' | 'contain'
  /**
   * Fill the space the layout gives this slot, rather than sizing to the image.
   *
   * An `<img>` used directly as a grid/flex item contributes its INTRINSIC
   * height when the track is auto-sized, so a tall photo silently stretches the
   * whole row — the neighbouring text column then floats in a band of dead
   * space. With `fill` the frame becomes a positioned box contributing no
   * height of its own and the picture is absolutely placed inside it, so the row
   * is sized by its text (or by the frame's own `min-h-*`) as intended.
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
 * Almanac's photo slot.
 *
 * Every image in this template is optional: when the school hasn't uploaded one
 * the slot stays part of the composition — a hatched sand panel with a monospace
 * caption naming the shot — instead of collapsing the layout or showing a broken
 * image. That hatch is the design's own placeholder treatment, so an unfinished
 * site still reads as designed rather than as an error state.
 */
export default function Photo({
  src,
  alt = '',
  caption = 'photo',
  editPath,
  className = '',
  rounded = 'rounded-[20px]',
  fit = 'cover',
  fill = false,
  priority = false,
}: PhotoProps) {
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'
  const hatch =
    'bg-[repeating-linear-gradient(100deg,var(--color-tf-panel)_0_15px,var(--color-tf-border)_15px_30px)]'

  const chip = (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-tf-paper px-2.5 py-1.5 font-mono text-[11.5px] leading-none text-tf-muted">
      <Icon icon="lucide:image-plus" className="h-3 w-3 shrink-0" />
      {caption}
    </span>
  )

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            data-edit-img={editPath}
            fill
            sizes={sizes}
            priority={priority}
            className={fitClass}
          />
        ) : (
          <div data-edit-img={editPath} className={`absolute inset-0 flex items-end p-5 ${hatch}`}>
            {chip}
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
        className={`${fitClass} ${rounded} ${className}`}
      />
    )
  }

  return (
    <div
      data-edit-img={editPath}
      className={`flex items-end p-5 ${hatch} ${rounded} ${className}`}
    >
      {chip}
    </div>
  )
}
