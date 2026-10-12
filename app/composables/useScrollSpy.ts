export default function useScrollSpy(ids: MaybeRefOrGetter<string[]>): { activeId: Ref<string | null> } {
  // Internal state
  const _route = useRoute()
  const _intersecting = new Set<string>()
  let _observer: IntersectionObserver | null = null

  // State
  const activeId = ref<string | null>(null)

  // Helpers
  function _pickActive(order: string[]) {
    // The first section (in page order) currently crossing the reading band wins; keep the last one while between sections
    const next = order.find(id => _intersecting.has(id))
    if (next) {
      activeId.value = next
    }
  }

  function _disconnect() {
    _observer?.disconnect()
    _observer = null
    _intersecting.clear()
  }

  function _observe() {
    if (!import.meta.client) {
      return
    }
    _disconnect()

    const order = toValue(ids)
    const elements = order.flatMap((id) => {
      const el = document.getElementById(id)
      return el ? [el] : []
    })

    if (!elements.length) {
      activeId.value = null
      return
    }

    // Reading band: below the sticky header, above the lower half of the viewport
    _observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          _intersecting.add(entry.target.id)
        }
        else {
          _intersecting.delete(entry.target.id)
        }
      }
      _pickActive(order)
    }, { rootMargin: '-96px 0px -55% 0px' })

    elements.forEach(el => _observer?.observe(el))
  }

  onMounted(() => nextTick(_observe))
  watch(() => _route.path, () => nextTick(_observe), { flush: 'post' })
  onBeforeUnmount(_disconnect)

  return { activeId }
}
