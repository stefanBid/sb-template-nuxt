<script setup lang="ts">
interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset' | 'link'
  ariaLabel?: string
  to?: string
  isDisabled?: boolean
  isLoading?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  to: undefined,
  ariaLabel: undefined,
  isDisabled: false,
  isLoading: false,
})

const sizeClasses = computed(() => ({
  'px-3 py-1.5 md:px-3.5 md:py-2': props.size === 'sm',
  'px-4 py-2 md:px-6 md:py-3': props.size === 'md',
  'px-6 py-3 md:px-8 md:py-4': props.size === 'lg',
}))

const isInteractive = computed(() => {
  return !props.isDisabled && !props.isLoading
})
</script>

<template>
  <a
    v-if="props.type === 'link'"
    :aria-label="props.ariaLabel"
    class="ty-app-btn-label border rounded-sm u-app-soft-transition inline-flex items-center u-app-focus"
    :class="[
      sizeClasses,

      // Variants
      props.variant === 'primary'
        ? 'bg-app-accent hover:bg-app-accent-hover border-app-accent-border text-white'
        : '',

      props.variant === 'secondary'
        ? 'bg-app-surface hover:bg-app-surface-2 border-app-border text-app-contrast'
        : '',

      props.variant === 'outline'
        ? 'bg-transparent border-app-accent text-app-accent hover:bg-app-accent hover:text-white'
        : '',

      props.variant === 'ghost'
        ? 'bg-transparent border-transparent text-app-muted hover:bg-app-surface-2 hover:text-app-contrast'
        : '',

      props.variant === 'danger'
        ? 'bg-app-error-bg border-transparent text-app-error hover:bg-app-error hover:text-white'
        : '',
    ]"
    :href="props.to"
    rel="noopener noreferrer"
    target="_blank"
  >
    <slot></slot>
  </a>
  <button
    v-else
    :aria-label="props.ariaLabel"
    class="ty-app-btn-label border rounded-sm u-app-soft-transition inline-flex items-center u-app-focus"

    :class="[
      sizeClasses,

      // General state
      isInteractive ? 'cursor-pointer' : 'opacity-45 cursor-not-allowed',

      // Variants
      props.variant === 'primary'
        ? isInteractive
          ? 'bg-app-accent hover:bg-app-accent-hover border-app-accent-border text-white'
          : 'bg-app-accent border-app-accent-border text-white'
        : '',

      props.variant === 'secondary'
        ? isInteractive
          ? 'bg-app-surface hover:bg-app-surface-2 border-app-border text-app-contrast'
          : 'bg-app-surface border-app-border text-app-contrast'
        : '',

      props.variant === 'outline'
        ? isInteractive
          ? 'bg-transparent border-app-accent text-app-accent hover:bg-app-accent hover:text-white'
          : 'bg-transparent border-app-accent text-app-accent'
        : '',

      props.variant === 'ghost'
        ? isInteractive
          ? 'bg-transparent border-transparent text-app-muted hover:bg-app-surface-2 hover:text-app-contrast'
          : 'bg-transparent border-transparent text-app-muted'
        : '',

      props.variant === 'danger'
        ? isInteractive
          ? 'bg-app-error-bg border-transparent text-app-error hover:bg-app-error hover:text-white'
          : 'bg-app-error-bg border-transparent text-app-error'
        : '',
    ]"
    :disabled="props.isDisabled || props.isLoading"
    :type="props.type"
  >
    <slot></slot>
    <Icon v-if="props.isLoading" class="inline-block size-5 md:size-6 ml-2 animate-spin" name="lucide:loader-circle" />
  </button>
</template>
