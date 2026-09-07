import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  backendForLabel,
  isAllowedBackend,
  isDevHost,
  normalizeHost,
  platformLabel,
  resolveTenant,
  siteTag,
  sitePath,
} from './tenant.ts'

/**
 * Tests for tenant resolution.
 *
 * These exist because this module has already broken a live school twice, in
 * ways nothing else would have caught:
 *
 *   1. A custom domain resolved with an EMPTY slug. Rendering did not care —
 *      the backend alone identifies the school — but `/api/admissions/*`
 *      forwards a school identity and refuses a request without one, so
 *      ingeniousschool.com told families "Admissions are currently closed"
 *      over an open 2027 admission. A build and a typecheck both passed.
 *   2. The backend guard is the only thing standing between a URL segment and
 *      an arbitrary outbound fetch.
 *
 * `resolveTenant` is exercised for hosts that need no network. The custom-domain
 * path is covered through a stubbed `fetch`, which is the case that actually
 * regressed.
 */

const PLATFORM = 'schools.leeep.in'

test('a platform subdomain resolves deterministically, with a slug', async () => {
  const tenant = await resolveTenant(`kcs.${PLATFORM}`)
  assert.ok(tenant)
  assert.equal(tenant.host, `kcs.${PLATFORM}`)
  assert.equal(tenant.backend, 'https://kcs.leeep.in')
  // The slug is what `/api/admissions/*` forwards to Frappe. Empty means every
  // admissions call 400s and the site claims admissions are closed.
  assert.equal(tenant.slug, 'kcs')
})

test('the bare platform apex belongs to no school', async () => {
  assert.equal(await resolveTenant(PLATFORM), null)
})

test('an empty host resolves to nothing rather than a half-tenant', async () => {
  assert.equal(await resolveTenant(''), null)
  assert.equal(await resolveTenant('   '), null)
})

test('a custom domain ALWAYS gets a slug, even when the directory omits one', async () => {
  const realFetch = globalThis.fetch
  // The shape older directory rows return: a backend, and no slug at all.
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ message: { backend: 'https://ingenious.leeep.in' } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })) as typeof fetch
  // FRAPPE_DIRECTORY_URL is set by the `test` script: the module reads it at
  // load time, so setting it here would already be too late.
  try {
    const tenant = await resolveTenant('ingeniousschool.com')
    assert.ok(tenant, 'a registered custom domain must resolve')
    assert.equal(tenant.backend, 'https://ingenious.leeep.in')
    // THE REGRESSION: this was '' and broke admissions on a live school.
    assert.equal(tenant.slug, 'ingenious')
  } finally {
    globalThis.fetch = realFetch
  }
})

test('a backend outside our own zones is refused', () => {
  assert.equal(isAllowedBackend('https://kcs.leeep.in'), true)
  assert.equal(isAllowedBackend('https://leeep.in'), true)
  assert.equal(isAllowedBackend('http://localhost:8000'), true)
  // The path segment is user-supplied, so this guard is the SSRF boundary.
  assert.equal(isAllowedBackend('https://evil.example.com'), false)
  assert.equal(isAllowedBackend('https://leeep.in.evil.com'), false)
  assert.equal(isAllowedBackend('not-a-url'), false)
  assert.equal(isAllowedBackend(''), false)
})

test('hosts are normalised before anything trusts them', () => {
  assert.equal(normalizeHost('KCS.Schools.Leeep.IN'), 'kcs.schools.leeep.in')
  assert.equal(normalizeHost('https://kcs.leeep.in/about'), 'kcs.leeep.in')
  assert.equal(normalizeHost('kcs.leeep.in:3000'), 'kcs.leeep.in')
  assert.equal(normalizeHost('kcs.leeep.in.'), 'kcs.leeep.in')
  assert.equal(normalizeHost(null), '')
})

test('dev hosts are recognised so they are never redirected to production', () => {
  for (const host of ['localhost', '127.0.0.1', 'kcs.localhost', 'preview-abc.vercel.app']) {
    assert.equal(isDevHost(host), true, host)
  }
  for (const host of ['kcs.schools.leeep.in', 'ingeniousschool.com']) {
    assert.equal(isDevHost(host), false, host)
  }
})

test('platform labels are read from the last segment only', () => {
  assert.equal(platformLabel('kcs.schools.leeep.in'), 'kcs')
  assert.equal(platformLabel('ingeniousschool.com'), '')
  assert.equal(platformLabel('schools.leeep.in'), '')
  assert.equal(backendForLabel('kcs'), 'https://kcs.leeep.in')
})

test('the cache tag matches what Frappe computes on publish', () => {
  // Frappe sends its own `backend_url()`; both sides must land on the same tag
  // or a publish invalidates nothing and the site looks frozen for an hour.
  assert.equal(siteTag('https://kcs.leeep.in'), 'site:kcs.leeep.in')
  assert.equal(siteTag('https://kcs.leeep.in/'), 'site:kcs.leeep.in')
})

test('internal paths encode the tenant without losing it', () => {
  const tenant = { host: 'ingeniousschool.com', backend: 'https://ingenious.leeep.in', slug: 'ingenious' }
  assert.equal(sitePath(tenant, '/'), '/site/ingeniousschool.com/ingenious')
  assert.equal(sitePath(tenant, '/about'), '/site/ingeniousschool.com/ingenious/about')
  // An unknown slug still produces a well-formed path.
  assert.equal(sitePath({ ...tenant, slug: '' }, '/about'), '/site/ingeniousschool.com/-/about')
})
