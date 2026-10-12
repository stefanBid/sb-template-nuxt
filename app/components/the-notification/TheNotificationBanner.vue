<script setup lang="ts">
interface TheNotificationBannerProps {
  type?: 'success' | 'warning' | 'error' | 'info'
  icon?: string | null
  title?: string | null
  message: string
  dismissible?: boolean
  autoClose?: boolean
  duration?: number
}
// Input / Output
const props = withDefaults(defineProps<TheNotificationBannerProps>(), {
  type: 'info',
  icon: null,
  title: null,
  dismissible: true,
  autoClose: false,
  duration: 5000,
})

const emit = defineEmits <{
  (e: 'close', falsyValue: false): void
}>()

// Data
// Errors and warnings interrupt screen readers, the rest is announced politely
const liveRole = computed(() => (props.type === 'error' || props.type === 'warning') ? 'alert' : 'status')

let _timerId: ReturnType<typeof setTimeout> | undefined
let _remaining = props.duration
let _startedAt = 0

// Helpers
const _startTimer = () => {
  if (!props.autoClose || _remaining <= 0 || !import.meta.client) {
    return
  }
  clearTimeout(_timerId)
  _startedAt = Date.now()
  _timerId = setTimeout(() => {
    onClose()
  }, _remaining)
}

// Events
const onClose = () => {
  emit('close', false)
}

// Hovering or focusing the banner pauses the countdown so it can be read and used
const onPauseTimer = () => {
  if (_timerId === undefined) {
    return
  }
  clearTimeout(_timerId)
  _timerId = undefined
  _remaining -= Date.now() - _startedAt
}

const onResumeTimer = () => {
  if (_timerId === undefined) {
    _startTimer()
  }
}

onMounted(() => {
  _startTimer()
})

onBeforeUnmount(() => {
  clearTimeout(_timerId)
})
</script>

<template>
  <div
    :class="[
      'w-full sm:w-lg p-4 md:p-6 rounded-md border sb-transition pointer-events-auto',
      'shadow-md',
      {
        'bg-success-soft border-success': props.type === 'success',
        'bg-warning-soft border-warning': props.type === 'warning',
        'bg-error-soft border-error': props.type === 'error',
        'bg-info-soft border-info': props.type === 'info',
      },
    ]"
    :role="liveRole"
    @focusin="onPauseTimer"
    @focusout="onResumeTimer"
    @mouseenter="onPauseTimer"
    @mouseleave="onResumeTimer"
  >
    <div class="flex items-start gap-3 md:gap-4 sb-transition">
      <!-- Icon -->
      <div
        v-if="props.icon"
        :class="[
          'shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-sm sb-transition',
          {
            'bg-surface text-success': props.type === 'success',
            'bg-surface text-warning': props.type === 'warning',
            'bg-surface text-error': props.type === 'error',
            'bg-surface text-info': props.type === 'info',
          },
        ]"
      >
        <Icon class="size-5 md:size-6" :name="props.icon" />
      </div>

      <!-- Text Content -->
      <div class="flex-1 min-w-0">
        <h3
          v-if="props.title"
          class="sb-h4 text-ink mb-1 sb-transition"
        >
          {{ props.title }}
        </h3>
        <p
          class="sb-small text-ink-muted sb-transition"
        >
          {{ props.message }}
        </p>
      </div>

      <!-- Close Button -->
      <BaseCloseButton
        v-if="props.dismissible"
        class="shrink-0 -mt-1 -mr-1"
        @close="onClose()"
      />
    </div>
  </div>
</template>
