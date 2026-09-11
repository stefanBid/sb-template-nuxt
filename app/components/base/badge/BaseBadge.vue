<script setup lang="ts">
interface BaseBadgeProps {
  text: string
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  dot?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseBadgeProps>(), {
  variant: 'accent',
  dot: false,
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm ty-app-label normal-case! font-semibold! u-app-soft-transition"
    :class="{
      'bg-app-surface-2 text-app-accent': props.variant === 'accent',
      'bg-app-success-bg text-app-success': props.variant === 'success',
      'bg-app-warning-bg text-app-warning': props.variant === 'warning',
      'bg-app-error-bg text-app-error': props.variant === 'error',
      'bg-app-info-bg text-app-info': props.variant === 'info',
      'bg-transparent border border-app-border text-app-muted': props.variant === 'outline',
    }"
  >
    <span
      v-if="props.dot"
      aria-hidden="true"
      class="size-1.5 rounded-full bg-current shrink-0"
    ></span>
    {{ props.text }}
  </span>
</template>
