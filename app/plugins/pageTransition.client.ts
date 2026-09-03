export default defineNuxtPlugin(() => {
  const router = useRouter()
  const getRouteBaseName = useRouteBaseName()
  const { pageSkipTransition } = usePageTransition()

  router.beforeEach((to, from) => {
    const toParent = to.matched[0] as Parameters<typeof getRouteBaseName>[0]
    const fromParent = from.matched[0] as Parameters<typeof getRouteBaseName>[0]
    pageSkipTransition.value = getRouteBaseName(toParent) === getRouteBaseName(fromParent)
  })
})
