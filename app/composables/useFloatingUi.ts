import type { Placement, Strategy } from '@floating-ui/vue'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'

interface FloatingConfig {
  placement?: Placement
  offset?: number
  strategy?: Strategy
}

const DEFAULT_CONFIG: FloatingConfig = {
  placement: 'bottom-start',
  offset: 8,
  strategy: 'absolute',
}

export default function useFloatingUi(conf: FloatingConfig = {}) {
  const mergedConf: FloatingConfig = {
    ...DEFAULT_CONFIG,
    ...conf,
  }
  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)
  const open = ref(false)

  const { floatingStyles } = useFloating(reference, floating, {
    placement: mergedConf.placement,
    strategy: mergedConf.strategy,
    middleware: [offset(mergedConf.offset), flip(), shift()],
    whileElementsMounted: autoUpdate,
    transform: false,

  })

  const toggleFloating = (newFloatingState: boolean) => {
    if (newFloatingState === open.value) {
      return
    }
    open.value = newFloatingState
  }

  return {
    reference,
    floating,
    floatingStyles,
    open,
    toggleFloating,
  }
}
