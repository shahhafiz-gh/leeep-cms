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

export function gridCols(count: number, max: 2 | 3 | 4 = 4): string {
  if (count <= 1) return COLS[1]
  for (let n = Math.min(max, count); n >= 2; n--) {
    if (count % n === 0) return COLS[n]
  }
  return COLS[Math.min(max, count)]
}
