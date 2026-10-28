import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // ---------------------------------------------------------------------------
  // Modules
  // ---------------------------------------------------------------------------
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/i18n', '@nuxtjs/color-mode', '@vueuse/nuxt', '@nuxtjs/sitemap'],

  // ---------------------------------------------------------------------------
  // Environment overrides — merged in based on the actual Nuxt CLI command
  // (`nuxt dev` → $development, `nuxt build`/`generate` → $production), not `process.env.NODE_ENV`
  // ---------------------------------------------------------------------------
  $development: {
    devtools: { enabled: true },
  },
  $production: {
    devtools: { enabled: false },
  },

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  ssr: true,

  // ---------------------------------------------------------------------------
  // App & Head
  // ---------------------------------------------------------------------------
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  site: {
    // Every sitemap <loc> resolves against this URL (resolved at build: the sitemaps are prerendered)
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.yoursite.com',
    name: 'Your Site Name',
  },
  colorMode: {
    classSuffix: '',
    dataValue: 'theme',
    preference: 'system',
    fallback: 'light',
  },

  // ---------------------------------------------------------------------------
  // Runtime config & routing
  // ---------------------------------------------------------------------------
  runtimeConfig: {
    public: {
      isProduction: process.env.CONTEXT === 'production',
      siteUrl: 'https://www.yoursite.com',
    },
  },
  routeRules: {
    '/': { isr: 3600 },
    '/it': { isr: 3600 },
    // Dynamic, must run per-request — never prerender
    '/robots.txt': { prerender: false },
  },

  // ---------------------------------------------------------------------------
  // Build & server
  // ---------------------------------------------------------------------------
  sourcemap: {
    client: false,
    server: false,
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'netlify',
    externals: {
      external: ['isomorphic-dompurify'],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'isomorphic-dompurify',
        'sb-floating-panel-vue',
      ],
    },
  },
  hooks: {
    'build:before': () => {
      const isNetlifyProduction = process.env.CONTEXT === 'production'
      const siteUrl = process.env.NUXT_PUBLIC_SITE_URL

      if (isNetlifyProduction && (!siteUrl || siteUrl === 'https://www.yoursite.com')) {
        throw new Error(
          'NUXT_PUBLIC_SITE_URL is missing or still the template placeholder (https://www.yoursite.com). '
          + 'Set the real production URL as a Netlify environment variable before deploying.',
        )
      }
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  fonts: {
    families: [
      { name: 'Poppins', provider: 'google', weights: [600, 700] },
      { name: 'Inter', provider: 'google', weights: [400, 600, 700] },
    ],
  },
  i18n: {
    baseUrl: 'https://www.yoursite.com',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'it', iso: 'it-IT', language: 'it-IT', name: 'Italiano', file: 'it.json' },
    ],
    langDir: 'locales/',
    detectBrowserLanguage: false,
  },
  icon: {
    mode: 'svg',
    serverBundle: 'local',
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      sizeLimitKb: 256,
    },
  },
  image: {
    provider: 'ipx',
    domains: [],
    quality: 80,
    format: ['webp', 'avif', 'png'],
    screens: { 'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536 },
    providers: {
      // registers the built-in pass-through provider so `<NuxtImg provider="none">` type-checks —
      // used for arbitrary external URLs (e.g. CMS media) not covered by image.domains
      none: {},
    },
  },
  sitemap: {
    // Every page is static: prerender the sitemaps at build and ship no sitemap code in the server bundle.
    // Pages come from app sources, hreflang alternates from @nuxtjs/i18n, priority/changefreq/lastmod from definePageMeta.
    zeroRuntime: true,
  },
})
