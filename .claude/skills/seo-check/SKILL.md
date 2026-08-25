---
name: seo-check
description: Audit robots.txt, sitemap.xml, and per-page meta tags for Google Search Console / SEO readiness. Trigger phrases (English or Italian) — "check SEO", "check GSC readiness", "verifica la SEO".
---

# GSC / SEO readiness check

1. Read `nuxt.config.ts` for `i18n.baseUrl` (production domain), `routeRules` (prerendered vs SSR routes), `app.head.meta` (structural defaults), and `i18n.locales` (codes + hreflang values). Read `app/app.config.ts` for the brand defaults (`site.name`, `site.themeColor`, `site.ogImage`, `site.twitterImage`, `social.*`), which `app/layouts/default.vue` injects into the head.
2. Check `server/routes/robots.txt.ts`: production branch (`process.env.CONTEXT === 'production'`) must return `User-Agent: *`, `Allow: /`, a `Sitemap:` directive built from `runtimeConfig.public.siteUrl` matching `i18n.baseUrl` (not `localhost`); non-production branch must return `Disallow: /` so Netlify deploy previews stay unindexable.
3. Check `public/sitemap.xml`: valid XML with `urlset` + `xmlns:xhtml` namespaces, all `<loc>` URLs on the production domain, `<lastmod>`/`<changefreq>`/`<priority>` per URL, `<xhtml:link>` alternates for every locale, correct `x-default`, hreflang values matching `i18n.locales[].iso`, and all prerendered routes represented.
4. Check global meta/brand values aren't placeholders (`yoursite.com`, `Your Site Name`, `Your Website`, etc.) in `nuxt.config.ts`, `app/app.config.ts`, and `.env`/`.env.example` — flag any that still are.
5. Scan `app/pages/**/*.vue` for `useHead`/`useSeoMeta`: each page should set `title`, `description`/`ogDescription`, `ogTitle`, `ogImage`, all via `t()`/`$t()` (no hardcoded strings, no `TODO`/`…` placeholders). Flag pages with no head call at all — they inherit only global defaults.
6. Report per check (robots.txt, sitemap.xml, global meta, per-page table) plus a summary of blockers vs warnings vs OK.
