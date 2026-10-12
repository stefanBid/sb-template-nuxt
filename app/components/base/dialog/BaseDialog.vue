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
  // eslint-disable-next-line no-unused-vars
  (e: 'close', falsyValue: false): void
}>()

// Data
const dialogRef = ref<HTMLElement | null>(null)

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

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    e.preventDefault()
    onClose()
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
      // Disable scroll when dialog opens
      lock()

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
        aria-labelledby="app-dialog-title"
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
          class="relative z-10 w-full mx-auto border rounded-lg border-border shadow-lg bg-bg outline-none flex flex-col max-h-[90dvh] sb-transition"
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
                id="app-dialog-title"
                class="sb-transition truncate"
                :class="titleClass"
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
            id="second-custom-header"
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
