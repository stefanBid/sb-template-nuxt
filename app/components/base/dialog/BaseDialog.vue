<script setup lang="ts">
interface BaseDialogProps {
  isOpen: boolean
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
}

// Dependencies
const { lock, unlock } = useLockScroll()

// Input / Output
const props = withDefaults(defineProps<BaseDialogProps>(), {
  subtitle: undefined,
  size: 'sm',
})

const emit = defineEmits<{
  (e: 'close', falsyValue: false): void
}>()

// Data
const titleId = useId()
const dialogRef = ref<HTMLElement | null>(null)
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// App root made inert while the dialog is open, so assistive tech and Tab cannot reach the page behind
const _setBackgroundInert = (isInert: boolean) => {
  const root = document.getElementById('__nuxt')
  if (isInert) {
    root?.setAttribute('inert', '')
  }
  else {
    root?.removeAttribute('inert')
  }
}

// Element that had focus before the dialog opened, restored on close
let _previousFocus: HTMLElement | null = null

const titleClass = computed(() => ({
  'sb-h4': props.size === 'sm',
  'sb-h3': props.size === 'md',
  'sb-h2': props.size === 'lg',
  'sb-h1': props.size === 'full',
}))

const paddingClass = computed(() => (props.size === 'lg' || props.size === 'full') ? 'p-6 md:p-8' : 'p-4 md:p-6')

// Events
const onClose = () => {
  emit('close', false)
}

// Keeps Tab / Shift+Tab cycling inside the panel
const _trapFocus = (e: KeyboardEvent) => {
  const panel = dialogRef.value
  if (!panel) {
    return
  }

  const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
  if (!focusable.length) {
    e.preventDefault()
    panel.focus()
    return
  }

  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  const active = document.activeElement

  if (!panel.contains(active) || (e.shiftKey && (active === first || active === panel))) {
    e.preventDefault()
    const target = e.shiftKey ? last : first
    target.focus()
  }
  else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) {
    return
  }

  if (e.key === 'Escape') {
    e.preventDefault()
    onClose()
  }
  else if (e.key === 'Tab') {
    _trapFocus(e)
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
    _setBackgroundInert(false)
  }
  unlock()
})

watch(
  () => props.isOpen,
  (value) => {
    // Avoid DOM access during SSR
    if (!import.meta.client) {
      return
    }

    if (value) {
      // Remember the opener so focus can return to it
      _previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null

      // Disable scroll when dialog opens
      lock()
      _setBackgroundInert(true)

      // Use requestAnimationFrame to avoid forced reflow
      nextTick(() => {
        requestAnimationFrame(() => {
          if (dialogRef.value) {
            dialogRef.value.focus()
          }
        })
      })
    }
    else {
      // Re-enable scroll when dialog closes
      unlock()
      _setBackgroundInert(false)

      _previousFocus?.focus()
      _previousFocus = null
    }
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <Teleport to="body">
    <Transition appear name="scale-fade">
      <div
        v-if="isOpen"
        :aria-labelledby="titleId"
        aria-modal="true"
        class="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-6 will-change-[opacity,transform]"
        role="dialog"
        style="isolation: isolate;"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-bg/80 backdrop-blur-sm sb-transition"
          @click="onClose"
        ></div>

        <!-- Dialog Panel -->
        <div
          ref="dialogRef"
          class="relative z-10 w-full mx-auto border rounded-lg border-border shadow-lg bg-surface outline-none flex flex-col max-h-[90dvh] sb-transition"
          :class="{
            'max-w-lg': size === 'sm',
            'max-w-4xl': size === 'md',
            'max-w-6xl': size === 'lg',
            'max-w-350 h-full': size === 'full',
          }"
          tabindex="-1"
        >
          <!-- HEADER -->
          <header
            class="flex items-start justify-between gap-4 border-b border-border/70 sb-transition"
            :class="paddingClass"
          >
            <div class="flex flex-col flex-1 min-w-0">
              <h2
                :id="titleId"
                class="sb-transition truncate"
                :class="titleClass"
                :title="props.title"
              >
                {{ props.title }}
              </h2>
              <p
                v-if="props.subtitle"
                class="sb-body text-ink-muted mt-1 sb-transition"
              >
                {{ props.subtitle }}
              </p>
            </div>

            <BaseCloseButton
              class="shrink-0"
              @close="onClose"
            />
          </header>

          <section
            v-if="$slots.header"
            class="sb-transition"
            :class="paddingClass"
          >
            <slot name="header"></slot>
          </section>

          <!-- BODY -->
          <section
            class="flex-1 overflow-y-auto sb-body sb-transition"
            :class="paddingClass"
          >
            <slot></slot>
          </section>

          <!-- FOOTER -->
          <footer
            v-if="$slots.footer"
            class="flex justify-end gap-3 border-t border-border/70 sb-transition"
            :class="paddingClass"
          >
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
