import { Icon } from '@iconify/react'

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
}

/**
 * Quill's photo slot.
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
  fill = false,
}: PhotoProps) {
  const hatch =
    'bg-[repeating-linear-gradient(100deg,var(--color-td-panel)_0_15px,var(--color-td-border)_15px_30px)]'

  const chip = (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-td-paper px-2.5 py-1.5 font-mono text-[11.5px] leading-none text-td-muted">
      <Icon icon="lucide:image-plus" className="h-3 w-3 shrink-0" />
      {caption}
    </span>
  )

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            data-edit-img={editPath}
            className="absolute inset-0 h-full w-full object-cover"
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
      <img
        src={src}
        alt={alt}
        data-edit-img={editPath}
        className={`object-cover ${rounded} ${className}`}
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
