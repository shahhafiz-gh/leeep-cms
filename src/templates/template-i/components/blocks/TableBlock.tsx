'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import type { CustomPageBlock } from '@/types/school.types'

/** A ` | `-separated line as cells. */
function cells(line: string | undefined): string[] {
  return String(line ?? '')
    .split('|')
    .map((cell) => cell.trim())
}

/** Long enough that a family needs a search box to find one row. */
const SEARCHABLE_FROM = 15

/**
 * A table the school types a line at a time (`columns`, then `rows[].cells`,
 * each ` | `-separated). Short tables render as they are; long ones — an alumni
 * register, a directory — get a filter box above them.
 */
export default function TableBlock({ block }: { block: CustomPageBlock }) {
  const header = cells(block.columns).filter(Boolean)
  const rows = useMemo(
    () => (block.rows ?? []).map((row) => cells(row?.cells)).filter((row) => row.some(Boolean)),
    [block.rows],
  )
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(q))) : rows
  }, [rows, query])

  if (!rows.length) return null
  const width = Math.max(header.length, ...rows.map((row) => row.length))

  return (
    <div>
      {rows.length >= SEARCHABLE_FROM && (
        <label className="mb-4 flex max-w-sm items-center gap-2 rounded-md border border-ts-line bg-white px-3 py-2 shadow-sm focus-within:border-ts-primary">
          <Icon icon="lucide:search" className="h-4 w-4 text-ts-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this list"
            className="w-full bg-transparent text-[15px] text-ts-heading outline-none"
          />
          <span className="shrink-0 text-xs text-ts-muted">
            {shown.length}/{rows.length}
          </span>
        </label>
      )}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-ts-line">
        <table className="w-full border-collapse text-left text-[14px]">
          {header.length > 0 && (
            <thead>
              <tr className="bg-ts-primary text-white">
                {Array.from({ length: width }, (_, i) => (
                  <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 font-bold">
                    {header[i] ?? ''}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {shown.map((row, r) => (
              <tr key={r} className="border-t border-ts-line odd:bg-white even:bg-ts-paper">
                {Array.from({ length: width }, (_, c) => (
                  <td
                    key={c}
                    className={`px-4 py-2.5 align-top text-ts-body ${c === 0 ? 'font-semibold text-ts-heading' : ''}`}
                  >
                    {row[c] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={width} className="px-4 py-6 text-center text-ts-muted">
                  Nothing matches “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
