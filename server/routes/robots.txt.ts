export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain')

  // Netlify sets CONTEXT to 'production' only for the production deploy context —
  // deploy previews and branch deploys get 'deploy-preview' / 'branch-deploy' and must stay unindexable.
  const isProduction = process.env.CONTEXT === 'production'

  if (!isProduction) {
    return 'User-Agent: *\nDisallow: /\n'
  }

  const { public: { siteUrl } } = useRuntimeConfig(event)

  return `User-Agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
