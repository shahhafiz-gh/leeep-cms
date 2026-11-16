import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import type { SchoolData } from '@/types/school.types'
import {
  customPages,
  findCustomPage,
  findGroup,
  findRedirect,
  slugify,
  supportsCustomPages,
  validPageSlug,
} from './custom-pages.ts'

/**
 * Tests for custom-page resolution.
 *
 * The server builds a school's menu from the same rules (website_builder.py,
 * `_fold_custom_pages`), so a drift here is a menu link that 404s — or worse, a
 * school page that shadows one of the fixed routes.
 *
 * Run with:  node --experimental-strip-types --test src/lib/custom-pages.test.ts
 */

function school(partial: Partial<SchoolData> = {}): SchoolData {
  return { config: { template_id: 'template-i' }, ...partial } as SchoolData
}

test('only templates that draw custom pages serve them', () => {
  assert.equal(supportsCustomPages(school()), true)
  assert.equal(supportsCustomPages(school({ config: { template_id: 'template-a' } })), false)
})

test('a page can never take a fixed route', () => {
  for (const reserved of ['about', 'contact', 'admissions', 'updates', 'gallery', 'privacy', 'api']) {
    assert.equal(validPageSlug(reserved), '', reserved)
  }
  assert.equal(validPageSlug('school-history'), 'school-history')
  assert.equal(validPageSlug('../etc'), '')
  assert.equal(validPageSlug(''), '')
})

test('the first page with a slug wins, and untitled pages are skipped', () => {
  const data = school({
    pages: [
      { slug: 'history', title: 'History' },
      { slug: 'history', title: 'Duplicate' },
      { slug: 'draft', title: '  ' },
      { slug: 'about', title: 'Shadows a fixed route' },
    ],
  })
  assert.deepEqual(customPages(data).map((p) => p.title), ['History'])
  assert.equal(findCustomPage(data, 'History')?.title, 'History')
})

test('a group slug resolves to its pages in authored order', () => {
  const data = school({
    pages: [
      { slug: 'harwan', title: 'Harwan Campus', menu: 'Boarding Facilities' },
      { slug: 'history', title: 'History', menu: 'About' },
      { slug: 'guest-house', title: 'Guest House', menu: 'boarding facilities' },
    ],
  })
  assert.equal(slugify('Boarding Facilities'), 'boarding-facilities')
  const group = findGroup(data, 'boarding-facilities')
  assert.equal(group?.label, 'Boarding Facilities')
  assert.deepEqual(group?.pages.map((p) => p.slug), ['harwan', 'guest-house'])
  assert.equal(findGroup(data, 'nothing-here'), null)
})

test('old addresses redirect within the site only', () => {
  const data = school({
    pages: [{ slug: 'history', title: 'History', aliases: ['/SchoolHistory.aspx'] }],
    redirects: [
      { from: '/About.aspx', to: '/about' },
      { from: '/Evil.aspx', to: 'https://elsewhere.example' },
      { from: '/Sneaky.aspx', to: '//elsewhere.example' },
    ],
  })
  assert.equal(findRedirect(data, 'about.aspx'), '/about')
  assert.equal(findRedirect(data, 'SchoolHistory.aspx'), '/history')
  assert.equal(findRedirect(data, 'Evil.aspx'), null)
  assert.equal(findRedirect(data, 'Sneaky.aspx'), null)
  assert.equal(findRedirect(data, '%E0%A4%A'), null)
})
