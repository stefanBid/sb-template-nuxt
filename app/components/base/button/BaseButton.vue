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
    class="sb-body-strong border rounded-sm sb-transition inline-flex items-center sb-focus"
    :class="[
      sizeClasses,

      // Variants
      props.variant === 'primary'
        ? 'bg-primary hover:bg-primary-hover border-primary text-on-primary'
        : '',

      props.variant === 'secondary'
        ? 'bg-surface hover:bg-surface-2 border-border text-ink'
        : '',

      props.variant === 'outline'
        ? 'bg-transparent border-primary text-primary hover:bg-primary hover:text-on-primary'
        : '',

      props.variant === 'ghost'
        ? 'bg-transparent border-transparent text-ink-muted hover:bg-surface-2 hover:text-ink'
        : '',

      props.variant === 'danger'
        ? 'bg-error-soft border-transparent text-error hover:bg-error hover:text-surface'
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
    class="sb-body-strong border rounded-sm sb-transition inline-flex items-center sb-focus"

    :class="[
      sizeClasses,

      // General state
      isInteractive ? 'cursor-pointer' : 'opacity-45 cursor-not-allowed',

      // Variants
      props.variant === 'primary'
        ? isInteractive
          ? 'bg-primary hover:bg-primary-hover border-primary text-on-primary'
          : 'bg-primary border-primary text-on-primary'
        : '',

      props.variant === 'secondary'
        ? isInteractive
          ? 'bg-surface hover:bg-surface-2 border-border text-ink'
          : 'bg-surface border-border text-ink'
        : '',

      props.variant === 'outline'
        ? isInteractive
          ? 'bg-transparent border-primary text-primary hover:bg-primary hover:text-on-primary'
          : 'bg-transparent border-primary text-primary'
        : '',

      props.variant === 'ghost'
        ? isInteractive
          ? 'bg-transparent border-transparent text-ink-muted hover:bg-surface-2 hover:text-ink'
          : 'bg-transparent border-transparent text-ink-muted'
        : '',

      props.variant === 'danger'
        ? isInteractive
          ? 'bg-error-soft border-transparent text-error hover:bg-error hover:text-surface'
          : 'bg-error-soft border-transparent text-error'
        : '',
    ]"
    :disabled="props.isDisabled || props.isLoading"
    :type="props.type"
  >
    <slot></slot>
    <Icon v-if="props.isLoading" class="inline-block size-5 md:size-6 ml-2 animate-spin" name="lucide:loader-circle" />
  </button>
</template>
