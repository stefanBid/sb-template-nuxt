<script setup lang="ts">
interface BaseChipProps {
  text: string
  icon?: string
  variant?: 'accent' | 'primary' | 'secondary'
}
const props = withDefaults(defineProps<BaseChipProps>(), {
  icon: undefined,
  variant: 'accent',
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full u-app-soft-transition"
    :class="{
      'bg-app-accent text-white': props.variant === 'accent',
      'bg-app-surface border border-app-border text-app-contrast': props.variant === 'primary',
      'bg-app-surface-2 border border-app-border text-app-contrast': props.variant === 'secondary',
    }"
  >
    <Icon
      v-if="props.icon"
      class="size-3.5 md:size-4"
      :name="props.icon"
    />
    <span class="ty-app-label truncate">{{ props.text }}</span>
  </span>
</template>
