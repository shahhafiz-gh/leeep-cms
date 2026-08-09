/**
 * Column classes chosen from the ITEM COUNT, not fixed per section.
 *
 * Quill's sections are flat grids with no card shadows, so a half-empty last row
 * reads as a mistake rather than as whitespace — and a CMS school can enter three
 * values where the design assumed four, or four where it assumed three. Picking
 * the largest column count (up to `max`) that divides the list keeps every row
 * full; when no such count exists (5 items, 7 items) it falls back to `max` and
 * accepts one short row, which is the best any layout can do.
 *
 * The returned strings are literals so Tailwind's scanner sees every class.
 */

const COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * Same ladder, but already two-up on the narrowest screens. For CONTENT-LIGHT
 * tiles — a figure and a two-word label — one per row wastes most of a phone
 * screen and pushes the rest of the page below four scrolls of whitespace.
 * Only use it where the tile genuinely fits half a phone width.
 */
const COLS_PAIRED: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}

export function gridCols(count: number, max: 2 | 3 | 4 = 4, base: 1 | 2 = 1): string {
  const table = base === 2 ? COLS_PAIRED : COLS
  if (count <= 1) return table[1]
  for (let n = Math.min(max, count); n >= 2; n--) {
    if (count % n === 0) return table[n]
  }
  return table[Math.min(max, count)]
}
