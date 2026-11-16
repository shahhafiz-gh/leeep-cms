'use client'

/**
 * Shrinking photographs before they are uploaded.
 *
 * The whole application — every document plus the answers — travels as ONE
 * request, and the platform the renderer runs on rejects a request body over
 * 4.5MB before it reaches our route (it answers `FUNCTION_PAYLOAD_TOO_LARGE` in
 * plain text, which is why an oversized submission used to surface as a blank
 * "something went wrong"). A photograph taken on a current phone is 3-8MB on its
 * own, so two of them cannot both be sent as picked.
 *
 * Nothing about a 12-megapixel original is useful on an application form: the
 * school prints it on a card and shows it in a list. Re-encoding it to 1600px
 * JPEG takes those 3-8MB down to a few hundred KB with no visible loss at the
 * sizes it is ever viewed at, and keeps the whole submission comfortably inside
 * the request budget.
 *
 * PDFs are passed through untouched — they are already compressed, and a scan
 * cannot be re-encoded here without losing the text.
 */

/** Longest edge a re-encoded photograph keeps, in pixels. */
const MAX_DIMENSION = 1600

/** Quality ladder — the first pass under `TARGET_BYTES` wins. */
const QUALITY_STEPS = [0.82, 0.7, 0.58]

/** What one photograph should come in under after re-encoding. */
const TARGET_BYTES = 1.2 * 1024 * 1024

/** Image types worth re-encoding. SVG is vector and GIF may be animated. */
const SHRINKABLE = /^image\/(jpeg|jpg|png|webp|heic|heif)$/i

/** True when this browser can do the re-encode at all. */
function canShrink(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof HTMLCanvasElement.prototype.toBlob === 'function'
  )
}

/** Decode a picked file, honouring the EXIF rotation a phone camera writes. */
async function decode(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      /* Safari < 15 has no `imageOrientation` — fall through to <img>. */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('decode failed'))
      image.src = url
    })
  } finally {
    // Revoked after the promise settles: the decoded pixels are already held by
    // the bitmap/image, so the object URL has done its job.
    URL.revokeObjectURL(url)
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

/**
 * Re-encode a picked photograph to something an application form can carry.
 *
 * Returns the ORIGINAL file whenever shrinking is not possible or not a win
 * (a PDF, an unsupported browser, a decode failure, or an image already smaller
 * than the re-encode would be) — so this can never make an upload worse, and a
 * caller does not have to handle a failure case.
 */
export async function shrinkImageForUpload(file: File): Promise<File> {
  if (!SHRINKABLE.test(file.type) || !canShrink()) return file

  try {
    const source = await decode(file)
    const { width, height } = source
    if (!width || !height) return file

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)

    const context = canvas.getContext('2d')
    if (!context) return file
    // A JPEG has no alpha channel: without this, a transparent PNG re-encodes
    // with a black background instead of a white one.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    if ('close' in source && typeof source.close === 'function') source.close()

    let best: Blob | null = null
    for (const quality of QUALITY_STEPS) {
      const blob = await toBlob(canvas, quality)
      if (!blob) break
      best = blob
      if (blob.size <= TARGET_BYTES) break
    }
    if (!best || best.size >= file.size) return file

    const name = file.name.replace(/\.[^./\\]+$/, '') || 'photo'
    return new File([best], `${name}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  }
}

/** "2.4MB" / "480KB" — for telling a family why a file was refused. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${Math.max(1, Math.round(bytes / 1024))}KB`
}
