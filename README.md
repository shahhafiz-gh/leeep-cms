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

## Site data — one layer, one resolver

Every route renders from `SchoolData` fetched through a **single** server-side
data layer, [`src/lib/cms.ts`](src/lib/cms.ts). There is no second content path
(the former `src/lib/frappe.ts` has been retired — see below).

```ts
getSiteData(school: string, mode: "published" | "draft" = "published"): Promise<SchoolData>
```

- **Server-side only.** Called from pages / `generateMetadata`; no component
  fetches Frappe directly and there is no client-side fetching of site content,
  so there are no CORS calls to the backend from the browser.
- Each page fetches **once** and passes slices to its sections via props.
  `getSiteData` is wrapped in React `cache()`, so `generateMetadata` + the page
  body share one fetch per render.
- Template is chosen from `data.config.template_id` (`template-a` / `template-b`)
  via [`renderTemplate`](src/lib/render-template.tsx) — **never** a URL param.
  Missing/unknown → defaults to `template-a` with a `console.warn`.

### Tenancy: ONE renderer, one Frappe site per school

This single deployment serves EVERY school. Each school runs its **own Frappe
site** (e.g. `kcs.leeep.in`) holding its single `School Website`, so a request is
routed to the right **backend**, resolved from the host in `middleware.ts`:

| Incoming host | Backend used | Slug |
|---|---|---|
| `kcs.schools.leeep.in` (platform subdomain) | `https://kcs.leeep.in` — label + `FRAPPE_BASE_DOMAIN`, deterministic, no registry | `kcs` |
| `www.stpauls.org` (custom domain) | looked up via `FRAPPE_DIRECTORY_URL`'s `resolve_domain` → `{ backend }` | from directory |
| `localhost` / `*.vercel.app` | `FRAPPE_URL` (dev fallback); `?school=<slug>` sets the slug | override |

Middleware injects `x-frappe-backend` + `x-school-subdomain`; `resolveBackend()`
and `resolveSchool()` in `cms.ts` read them. `getSiteData` fetches from the
per-request backend (the school's own site, which serves its single website — so
the `?school=` param is optional and only a hint).

Draft preview is token-gated: `?preview=1&token=<signed>` makes
`resolvePreviewMode` return `"draft"`; otherwise `"published"`. The
`PREVIEW_SECRET` must equal the school site's Frappe `preview_secret`.

### Environment variables (`.env.local` / Vercel project env)

| Var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_PLATFORM_DOMAIN` | `schools.leeep.in` | Zone that carries school subdomains (public). |
| `FRAPPE_BASE_DOMAIN` | `leeep.in` | Zone the per-school Frappe sites live under; backend = `https://<label>.<this>`. |
| `FRAPPE_DIRECTORY_URL` | _(unset)_ | Central directory for custom-domain → backend resolution — set to `https://admin.leeep.in`. Unset → custom domains don't resolve (subdomains still work). |
| `FRAPPE_URL` | `http://localhost:8000` | Dev/localhost fallback backend only. |
| `NEXT_PUBLIC_DEV_SUBDOMAIN` | _(unset)_ | Slug used on localhost when no `?school=`. |
| `USE_LOCAL_DATA` | `false` | `true` → serve the local mock fixture offline. |
| `FRAPPE_GET_SITE_METHOD` | `education.education.website_builder.get_site` | Dotted method path for content. |
| `FRAPPE_GET_IDENTITY_METHOD` | `education.education.api.get_website_registration` | Dotted method path for `getWebsiteIdentity`. |
| `FRAPPE_RESOLVE_DOMAIN_METHOD` | `leeep.leeep.website_directory.resolve_domain` | Custom-domain resolver on the central directory (admin.leeep.in). |
| `PREVIEW_SECRET` | _(unset)_ | Must match each school site's Frappe `preview_secret`. |
| `DEMO_FALLBACK` | `false` | **Opt-in** fallback to the local mock when Frappe is unreachable. |

### Endpoints used

```
GET {FRAPPE_URL}/api/method/education.education.website_builder.get_site?school=<slug>&mode=<published|draft>
→ { "message": <SchoolData> }            // getSiteData unwraps `message`

GET {FRAPPE_URL}/api/method/education.education.api.get_website_registration
→ { "message": <WebsiteIdentity | null> } // getWebsiteIdentity
```

`get_site` uses `cache: "no-store"` (always fresh in dev). On a non-2xx or network
error it **throws** (failures visible in dev) unless `DEMO_FALLBACK=true`, which
logs a warning and serves the local mock instead.

### Running / the toggle

1. Start Frappe on `:8000` (seeded `demo` school) and Next on `:3000`.
2. **Live:** `USE_LOCAL_DATA=false` → open `http://localhost:3000/?school=demo`
   (the localhost dev override) to render from Frappe.
3. **Offline fixture:** set `USE_LOCAL_DATA=true` and reload — pages render fully
   from the local mock even with Frappe stopped. Toggling the flag should produce
   identical output.

### What was retired / carve-outs

- **`src/lib/frappe.ts` removed.** Its preview-token gate and graceful fallback
  were folded into `cms.ts`; its `getSchoolData` is replaced by `getSiteData`; its
  unused `resolveFrappeMediaUrl` was dropped (re-add to `cms.ts` if ever needed).
- **`/demo` route unchanged.** It deliberately uses neutral fictional data
  (`src/lib/demo.ts`) and a `?template=` switch for offline template previews. It
  never touched `frappe.ts` and has no `config.template_id` source, so it stays as
  a self-contained preview tool outside the unified pipeline.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
