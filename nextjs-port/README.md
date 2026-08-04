# AEON Cloud — Next.js (App Router) port

A complete Next.js 15 / React 19 port of the AEON Cloud site: marketing pages, 41 docs pages,
20 blog articles, and the full `/app` portal (dashboard, projects, builds, testing, copilot,
reports, TTCN engine, API & SDK, billing, tokens, team, settings).

Verified with `next build` — 24 static routes + 20 SSG blog pages + 41 SSG docs pages + sitemap.

## Contents

```
aeon/                     -> shared code, alias @aeon/*
  components/             -> shadcn/ui + app shell + marketing components
  hooks/  lib/            -> hooks, blog + docs content, services, seo helper
  styles/aeon.css         -> Tailwind v4 theme (design tokens)
app/
  (aeon)/layout.tsx       -> route-group layout (fonts, css, providers, JSON-LD)
  (aeon)/page.tsx         -> /
  (aeon)/platform|workflow|pricing|login|register/
  (aeon)/blog + blog/[slug]
  (aeon)/docs + docs/[slug]
  (aeon)/app/layout.tsx   -> portal shell (sidebar + topbar)
  (aeon)/app/**           -> portal pages
  sitemap.ts              -> /sitemap.xml
public/aeon-blog/*.jpg    -> blog hero images
```

Every page is split into `page.tsx` (server component: `metadata` / `generateMetadata`,
`generateStaticParams`, JSON-LD) and `view.tsx` (`"use client"` UI). This keeps per-page SEO
on the server while the interactive UI stays client-side.

## Install into your existing app

1. Copy `aeon/`, the contents of `app/` and `public/aeon-blog/` into your project.
2. Add the path alias in `tsconfig.json`:

```json
{ "compilerOptions": { "paths": { "@aeon/*": ["./aeon/*"] } } }
```

3. Install dependencies (skip any you already have):

```bash
npm i @tanstack/react-query lucide-react class-variance-authority clsx tailwind-merge \
  tailwindcss @tailwindcss/postcss tw-animate-css \
  @fontsource/inter @fontsource/jetbrains-mono \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio \
  @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress \
  @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle \
  @radix-ui/react-toggle-group @radix-ui/react-tooltip \
  cmdk date-fns embla-carousel-react input-otp react-day-picker react-hook-form \
  react-resizable-panels recharts sonner vaul zod
```

4. Tailwind v4 via PostCSS (`postcss.config.mjs`):

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

5. `aeon/styles/aeon.css` is imported by `app/(aeon)/layout.tsx`. If your app already has a
   global stylesheet, either import `@aeon/styles/aeon.css` there instead, or keep it scoped
   to the route group as shipped. Check the `@source` lines at the top of the file match where
   you placed the folders.

## Notes for merging with an existing app

- `app/(aeon)/layout.tsx` renders a `<div className="dark ...">` wrapper, **not** `<html>/<body>` —
  so it nests safely under your existing root layout. It also sets `metadataBase` and site-wide
  OG defaults; delete those keys if your root layout already owns them.
- The theme is dark-only via the `dark` class on the wrapper.
- If your app already defines `/blog`, `/docs`, or `/app`, move the corresponding folders under
  a prefix (e.g. `app/(aeon)/certification/...`) and update `aeon/components/app/app-sidebar.tsx`,
  `aeon/components/marketing/site-nav.tsx`, `site-footer.tsx`, and `app/sitemap.ts`.
- Update `SITE_URL` in `aeon/lib/seo.ts` to your production domain — it drives canonicals, OG
  URLs, and the sitemap.
- Login/register are UI-only mocks (they `router.push("/app")`). Wire them to your own auth.
- Portal data comes from `aeon/lib/services/index.ts` mock fixtures; swap those for real fetches.

## Regenerating

The port is generated from the TanStack source by `scripts/port-to-nextjs.mjs` in the Lovable
project. After changing the Lovable app, re-run `bun scripts/port-to-nextjs.mjs` to refresh
this folder.
