const SETTLE_DELAY = 100
const PIN_MIN_DURATION = 150
const PIN_MAX_DURATION = 1500
const PIN_RELEASE_EVENTS = ['scrollend', 'wheel', 'touchstart', 'keydown'] as const

export default function useScrollSpy(ids: MaybeRefOrGetter<string[]>): {
  activeId: Ref<string | null>
  pin: (id: string) => void
} {
  // Internal state
  const _route = useRoute()
  const _intersecting = new Set<string>()
  let _order: string[] = []
  let _observer: IntersectionObserver | null = null
  let _settleTimer: ReturnType<typeof setTimeout> | undefined
  let _pinTimer: ReturnType<typeof setTimeout> | undefined
  let _pinnedAt = 0
  let _isPinned = false

  // State
  const activeId = ref<string | null>(null)

  // Helpers
  function _pickActive() {
    if (_isPinned) {
      return
    }
    // The first section (in page order) crossing the reading band wins; the last one is kept between sections
    const next = _order.find(id => _intersecting.has(id))
    clearTimeout(_settleTimer)
    if (!next || next === activeId.value) {
      return
    }
    // Only commit once the reading position has settled, so a fast traversal never lights the sections it passes through
    _settleTimer = setTimeout(() => {
      activeId.value = next
    }, SETTLE_DELAY)
  }

  function _release(e?: Event) {
    // A scrollend that fires before the programmatic scroll has really started must not unpin
    if (e?.type === 'scrollend' && Date.now() - _pinnedAt < PIN_MIN_DURATION) {
      return
    }
    _isPinned = false
    clearTimeout(_pinTimer)
    PIN_RELEASE_EVENTS.forEach(name => window.removeEventListener(name, _release))
    _pickActive()
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

    _order = toValue(ids)
    const elements = _order.flatMap((id) => {
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
      _pickActive()
    }, { rootMargin: '-96px 0px -55% 0px' })

    elements.forEach(el => _observer?.observe(el))
  }

  // Methods
  /**
   * Marks a section as active right away and holds it while the page scrolls there,
   * so only the chosen item is lit and not every item between the start and the target.
   * Released when the scroll ends, after a timeout, or as soon as the user takes over.
   */
  function pin(id: string) {
    if (!import.meta.client) {
      return
    }
    clearTimeout(_settleTimer)
    clearTimeout(_pinTimer)
    PIN_RELEASE_EVENTS.forEach(name => window.removeEventListener(name, _release))

    _isPinned = true
    _pinnedAt = Date.now()
    activeId.value = id

    PIN_RELEASE_EVENTS.forEach(name => window.addEventListener(name, _release, { passive: true }))
    _pinTimer = setTimeout(_release, PIN_MAX_DURATION)
  }

  onMounted(() => nextTick(_observe))
  watch(() => _route.path, () => nextTick(_observe), { flush: 'post' })
  onBeforeUnmount(() => {
    _disconnect()
    clearTimeout(_settleTimer)
    clearTimeout(_pinTimer)
    PIN_RELEASE_EVENTS.forEach(name => window.removeEventListener(name, _release))
  })

  return { activeId, pin }
}
