export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain')

  // Netlify's CONTEXT env var ('production' vs 'deploy-preview' / 'branch-deploy') is only
  // available at build time, not in the Function runtime — read the build-time-resolved value
  // from runtimeConfig (set in nuxt.config.ts) instead of process.env.CONTEXT here.
  const { public: { siteUrl, isProduction } } = useRuntimeConfig(event)

  if (!isProduction) {
    return 'User-Agent: *\nDisallow: /\n'
  }

  return `User-Agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
