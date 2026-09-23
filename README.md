This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Architecture: the tenant is in the URL, and the pages are cached

Every route renders from `SchoolData` fetched through a **single** server-side
data layer, [`src/lib/cms.ts`](src/lib/cms.ts).

```ts
getSiteData(tenant: Tenant, mode?: "published" | "draft", previewToken?: string): Promise<SchoolData>
```

- **Server-side only.** No component fetches Frappe directly and nothing fetches
  site content from the browser, so there are no CORS calls to the backend.
- **`getSiteData` takes a `Tenant`, never `headers()`.** This is the load-bearing
  rule. A page that touches `headers()`, `cookies()` or `searchParams` can never
  be statically rendered, and that single fact is what used to make every page
  view a fresh server render plus a round trip to the school's Frappe.
- Template comes from `data.config.template_id` via
  [`renderTemplate`](src/lib/render-template.tsx) — **never** a URL param.
  Missing/unknown → `template-a` with a `console.warn`.

### Tenancy: one renderer, one Frappe site per school

This deployment serves EVERY school; each school runs its own Frappe site (e.g.
`kcs.leeep.in`) holding its single `School Website`.
[`src/proxy.ts`](src/proxy.ts) (Next 16's renamed `middleware`) resolves the
incoming host and **rewrites** the tenant into the path:

| Incoming host | Rewritten to | Backend |
|---|---|---|
| `kcs.schools.leeep.in/about` | `/site/kcs.schools.leeep.in/kcs/about` | `https://kcs.leeep.in` — label + `FRAPPE_BASE_DOMAIN`, deterministic |
| `stpauls.org/about` (custom domain) | `/site/stpauls.org/-/about` | looked up via `FRAPPE_DIRECTORY_URL`'s `resolve_domain` |
| `localhost` / `*.vercel.app` | `/site/localhost/<slug>/…` | `FRAPPE_URL`; `?school=` sets the slug |

A rewrite is invisible — the address bar keeps the clean URL — but the page gets
its tenant as ordinary `params`, which is what lets it be prerendered. The two
segments answer different questions: **host** is the reliable key (the central
directory returns a backend but *no* slug for custom domains); **slug** is
optional (`-` when unknown) and exists for the `?school=` dev override.

Requests to `/site/…` or `/preview/…` directly are 404ed — they exist only as
rewrite targets, so there is never a second URL for a page.

### Caching, and how a publish reaches the site

Public pages are **statically generated on demand and cached** (`generateStaticParams`
returns `[]`, so nothing is prerendered at build but every route is on the static
path). `getSiteData` tags its published fetch `site:<backend-host>`.

When a school publishes, Frappe calls the renderer:

```
POST /api/revalidate  { backend, secret }   ->  revalidateTag("site:<backend-host>")
```

Callers in the education app: `website_builder.publish()`,
`website_domains.{set,refresh,remove}_custom_domain`, `api.set_website_analytics_id`,
and doc events on `Website Announcements` / `Website Event` (those are folded into
published pages by `get_site` at read time, so they change a live page without
anyone pressing Publish).

`export const revalidate = 3600` on each page is only the backstop for a lost call.

Two consequences worth knowing:

- **An outage no longer takes a school's website down.** The last good render
  keeps being served. `getSiteData` distinguishes *no such school* (Frappe 404,
  or the backend host not resolving → `SiteNotFoundError` → a real 404) from
  *school is unwell* (5xx, timeouts → re-thrown), so a blip can never cache a
  404 over a working site.
- **`loading.tsx` lives under `/preview` only.** At the app root it became the
  prerendered fallback shell for the public pages, which meant an unknown host
  got "Loading…" with a `200` — exactly what a crawler would index.

### Preview is a separate route, on purpose

`?preview=1&token=…` is rewritten to `/preview/[host]/[slug]/[[...path]]`, which
is `force-dynamic`, `noindex`, and loads the ~1,000-line inline editor through
`next/dynamic` so no public visitor downloads it. The builder's existing preview
URLs are unchanged — the proxy does the translation.

The token is minted by Frappe's `website_builder.get_preview_token` (editor-gated)
as `<school>:<expiry>:<hmac>`; `PREVIEW_SECRET` must equal the school site's
Frappe `preview_secret`.

### SEO

`app/robots.ts` and `app/sitemap.ts` are per-tenant and built on the school's
**canonical host** — its own domain once `custom_domain_status` is `Active`,
otherwise the platform subdomain (see [`src/lib/canonical.ts`](src/lib/canonical.ts)).
Every page emits a `<link rel="canonical">`, and a school arriving on the platform
subdomain of a verified custom domain is redirected to it (a 307, not a 301:
browsers cache permanent redirects hard, and a school that later drops its domain
would strand everyone who had seen one).

`src/shared/SiteHead.tsx` emits `School` JSON-LD built from content the school
already entered, plus GA4 — only when `config.analytics_id` is set.

### Fonts and images

The root layout loads **no fonts**. Each template owns its faces in a `fonts.ts`
beside its component and puts the variables on its own root `<div>`, so the CSS
custom properties that read them are scoped to `.template-x` rather than `body`.
All faces declare `preload: false`: Next bundles every template's `@font-face`
into one stylesheet (it cannot know which template a school picked until the
request), so preloading meant 17 eager font downloads to use two.

Template `Photo` slots render `fill` images through `next/image`; the hero passes
`priority`. Uploads are downscaled to 2000px in the browser before they are sent
(`builder/uploadFile.ts` in the education app), which also strips EXIF GPS.

### Environment variables (`.env.local` / Vercel project env)

| Var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_PLATFORM_DOMAIN` | `schools.leeep.in` | Zone that carries school subdomains. |
| `FRAPPE_BASE_DOMAIN` | `leeep.in` | Zone the per-school Frappe sites live under. |
| `FRAPPE_DIRECTORY_URL` | _(unset)_ | Custom-domain → backend resolution — set to `https://admin.leeep.in`. Unset → custom domains don't resolve. |
| `FRAPPE_URL` | `http://localhost:8000` | Dev/localhost fallback backend only. |
| `NEXT_PUBLIC_DEV_SUBDOMAIN` | _(unset)_ | Slug used on localhost when no `?school=`. |
| `USE_LOCAL_DATA` | `false` | `true` → serve the local mock fixture offline. |
| `DEMO_FALLBACK` | `false` | Opt-in fallback to the mock when Frappe is unreachable. |
| `PREVIEW_SECRET` | _(unset)_ | Must match each school site's Frappe `preview_secret`. |
| **`REVALIDATE_SECRET`** | _(unset)_ | **Must match `revalidate_secret` in the bench's `common_site_config.json`.** Unset → the endpoint 503s and publishes wait out the hourly TTL. |
| `SITE_REVALIDATE_SECONDS` | `3600` | Backstop TTL for a published page. |
| `FRAPPE_GET_SITE_METHOD` | `education.education.website_builder.get_site` | Content method. |
| `FRAPPE_RESOLVE_DOMAIN_METHOD` | `leeep.leeep.website_directory.resolve_domain` | Custom-domain resolver. |

`vercel.json` pins the function region to `bom1` — the schools' Frappe sites are
in India, and the default region ran the renderer in US-East, so every uncached
render crossed the planet twice.

### Running locally

1. Start Frappe and Next (`npm run dev`), then open `http://localhost:3000/?school=demo`.
2. To exercise a real backend without a bench:
   `FRAPPE_URL=https://demo.leeep.in npm run build && npm start`.
3. Offline: `USE_LOCAL_DATA=true` renders fully from the local mock.

To check caching is working, look for `x-nextjs-cache: HIT` (locally) or
`x-vercel-cache: HIT` (deployed) on a second request.

### Carve-outs

- **`/demo`** stays a self-contained, `force-dynamic` template preview using
  neutral fictional data (`src/lib/demo.ts`) and a `?template=` switch. It has no
  tenant and never talks to a backend.
- **`getWebsiteIdentity`** was removed — it was dead code that read `headers()`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
