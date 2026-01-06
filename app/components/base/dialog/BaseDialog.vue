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

      nextTick(() => {
        if (dialogRef.value) {
          dialogRef.value.focus()
        }
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
          class="absolute inset-0 bg-app-main/80 backdrop-blur-sm u-app-soft-transition"
          @click="onClose"
        ></div>

        <!-- Dialog Panel -->
        <div
          ref="dialogRef"
          class="relative z-10 w-full mx-auto border rounded-xl border-app-border shadow-[0_20px_60px_var(--color-app-shadow)] bg-app-main outline-none flex flex-col max-h-[90dvh] u-app-soft-transition"
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
            class="flex items-start justify-between gap-4 p-4 md:p-6 border-b border-app-border/70 u-app-soft-transition"
          >
            <div class="flex flex-col flex-1 min-w-0">
              <h2
                id="app-dialog-title"
                class="ty-app-title u-app-soft-transition truncate"
              >
                {{ props.title }}
              </h2>
              <p
                v-if="props.subtitle"
                class="ty-app-subtitle text-app-muted mt-1 u-app-soft-transition"
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
            class="p-4 md:p-6 u-app-soft-transition"
          >
            <slot name="header"></slot>
          </section>

          <!-- BODY -->
          <section
            class="flex-1 p-4 md:p-6 overflow-y-auto ty-app-paragraph u-app-soft-transition"
          >
            <slot></slot>
          </section>

          <!-- FOOTER -->
          <footer
            v-if="$slots.footer"
            class="flex justify-end gap-3 p-4 md:p-6 border-t border-app-border/70 u-app-soft-transition"
          >
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
