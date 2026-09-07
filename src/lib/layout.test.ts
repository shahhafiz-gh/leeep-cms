import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import type { SchoolData } from '@/types/school.types'
import { describeBlocks, resolveBlockOrder, type BlockRegistry } from './layout.ts'

/**
 * Tests for the layout resolver.
 *
 * This is worth testing where the rest of the renderer is not: it decides what
 * appears on a school's live home page, it has to keep working for sites that
 * predate it, and every one of its rules exists because of a way a real site
 * could break. A regression here is silent — the page still renders, it just
 * renders the wrong thing.
 *
 * Run with:  node --experimental-strip-types --test src/lib/layout.test.ts
 */

// The registry only matters for which ids EXIST, so the components are stubs.
const stub = (() => null) as unknown as BlockRegistry[string]
const REGISTRY: BlockRegistry = {
  hero: stub,
  stats: stub,
  programs: stub,
  gallery: stub,
  news: stub,
}
const DEFAULTS = ['hero', 'stats', 'programs', 'gallery', 'news'] as const

function school(partial: Partial<SchoolData> = {}): SchoolData {
  return partial as SchoolData
}

test('no saved layout renders the template default, untouched', () => {
  assert.deepEqual(resolveBlockOrder(school(), 'home', DEFAULTS, REGISTRY), [
    'hero',
    'stats',
    'programs',
    'gallery',
    'news',
  ])
})

test('a saved order is honoured', () => {
  const data = school({ layout: { home: ['news', 'hero', 'programs', 'stats', 'gallery'] } })
  assert.deepEqual(resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY), [
    'news',
    'hero',
    'programs',
    'stats',
    'gallery',
  ])
})

test('ids this template cannot draw are dropped, not crashed on', () => {
  // What a school carries after switching from Almanac, which has these blocks.
  const data = school({ layout: { home: ['hero', 'socialSpace', 'magazine', 'programs'] } })
  const out = resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY)
  assert.equal(out.includes('socialSpace'), false)
  assert.equal(out.includes('magazine'), false)
  assert.deepEqual(out.slice(0, 2), ['hero', 'programs'])
})

test('a block added to the template later is appended, never lost', () => {
  // Saved before `news` existed.
  const data = school({ layout: { home: ['gallery', 'hero', 'stats', 'programs'] } })
  const out = resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY)
  assert.deepEqual(out, ['gallery', 'hero', 'stats', 'programs', 'news'])
})

test('hidden blocks are removed from the rendered order', () => {
  const data = school({ hiddenSections: ['stats', 'gallery'] })
  assert.deepEqual(resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY), ['hero', 'programs', 'news'])
})

test('hiding survives reordering, and vice versa', () => {
  const data = school({
    layout: { home: ['news', 'gallery', 'hero'] },
    hiddenSections: ['gallery'],
  })
  assert.deepEqual(resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY), [
    'news',
    'hero',
    'stats',
    'programs',
  ])
})

test('a malformed layout falls back rather than blanking the page', () => {
  for (const broken of [[], ['', '  '], 'not-an-array', null, undefined, [1, 2, 3]]) {
    const data = school({ layout: { home: broken as unknown as string[] } })
    const out = resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY)
    assert.deepEqual(out, [...DEFAULTS], `broken layout ${JSON.stringify(broken)} should fall back`)
  }
})

test('an all-hidden page renders nothing rather than erroring', () => {
  const data = school({ hiddenSections: [...DEFAULTS] })
  assert.deepEqual(resolveBlockOrder(data, 'home', DEFAULTS, REGISTRY), [])
})

test('describeBlocks keeps hidden blocks so the builder can show the switch', () => {
  const data = school({
    layout: { home: ['news', 'hero'] },
    hiddenSections: ['hero'],
  })
  assert.deepEqual(describeBlocks(data, 'home', DEFAULTS, REGISTRY), [
    { id: 'news', visible: true },
    { id: 'hero', visible: false },
    { id: 'stats', visible: true },
    { id: 'programs', visible: true },
    { id: 'gallery', visible: true },
  ])
})
