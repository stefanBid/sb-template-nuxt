// * ============================================================
// * nuxt.config.ts — sb-template-nuxt
// * https://nuxt.com/docs/api/configuration/nuxt-config
// * ============================================================
//
// * MODULES
// * @nuxt/eslint        — linting and stylistic formatting
// * @nuxt/icon          — SVG icon system via Iconify (lucide + flagpack)
// * @nuxt/image         — image optimisation (ipx local + Cloudinary provider)
// * @nuxtjs/i18n        — multi-language support (en default, it secondary)
// * @nuxtjs/color-mode  — dark/light theme via .dark class on <html>
// * @vueuse/nuxt        — Vue composition utilities auto-import
//
// * APP.HEAD — global meta applied to all pages (overridable per-page via useHead)
// !   og:site_name, og:image, twitter:image → replace with real values before going live
// !   theme-color → update to match your brand colour
//
// * CSS — single entry point: ./app/assets/css/main.css
// *   imports cascade in order: tailwind → theme → typography → utilities → animations → global styles
//
// * RUNTIME CONFIG — env vars via useRuntimeConfig()
// ?   add public vars here: NUXT_PUBLIC_* in .env → runtimeConfig.public.*
//
// * ROUTE RULES — per-route rendering strategy
// *   prerender:true  → static HTML at build time
// *   ssr:false       → SPA mode (client-only)
// *   isr:N           → incremental static regen every N seconds
//
// * NITRO — server engine
// *   preset:'netlify' → change to 'vercel' or 'node-server' for other targets
// *   isomorphic-dompurify excluded from server bundle (client-side only, jsdom incompatible with serverless)
//
// * I18N
// !   baseUrl → replace with production domain before going live
// *   strategy:'prefix_except_default' → /page (en), /it/page (it)
// *   detectBrowserLanguage:false → intentional, prevents unexpected redirects
//
// * ICON — SVG mode, local bundle only (fallbackToApi:false)
// ?   to add a collection: npm install @iconify-json/<name>
//
// * IMAGE — default provider ipx (local); cloudinary available via provider="cloudinary" on <NuxtImg>
// ?   to allow external image domains, add them to image.domains[]
// * ============================================================

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/color-mode', '@vueuse/nuxt'],

  ssr: true,

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0f0f20' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Your Site Name' },
        { property: 'og:image', content: 'https://www.yoursite.com/og-image.jpg' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:image', content: 'https://www.yoursite.com/twitter-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['./app/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: 'https://www.yoursite.com',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/it': { prerender: true },
  },

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
        '@floating-ui/vue',
      ],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
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
    providers: {
      cloudinary: {
        name: 'cloudinary',
        options: {
          baseURL: process.env.NUXT_PUBLIC_CLOUDINARY_BASE,
        },
      },
    },
    domains: [],
    quality: 80,
    format: ['webp', 'avif', 'png'],
    screens: { 'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536 },
  },
})
