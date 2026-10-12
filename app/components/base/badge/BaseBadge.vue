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
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm sb-overline sb-transition"
    :class="{
      'bg-primary-soft text-primary': props.variant === 'accent',
      'bg-success-soft text-success': props.variant === 'success',
      'bg-warning-soft text-warning': props.variant === 'warning',
      'bg-error-soft text-error': props.variant === 'error',
      'bg-info-soft text-info': props.variant === 'info',
      'bg-transparent border border-border text-ink-muted': props.variant === 'outline',
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
