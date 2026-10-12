<script setup lang="ts">
interface BaseIconButtonProps {
  icon: string
  ariaLabel?: string
  isActive?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseIconButtonProps>(), {
  ariaLabel: undefined,
  isActive: false,
})

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'click'): void
}>()

// Events
const onClick = () => {
  emit('click')
}
</script>

<template>
  <button
    :aria-label="props.ariaLabel"
    class="group relative inline-flex items-center justify-center rounded-sm border border-border sb-transition sb-focus cursor-pointer size-7 md:size-8"
    :class="{
      'bg-surface-2': props.isActive,
      'bg-surface border hover:bg-surface-2': !props.isActive,
    }"
    type="button"
    @click="onClick"
  >
    <Icon
      class="size-4.5 md:size-5"
      :class="{
        'text-ink': props.isActive,
        'text-ink-muted group-hover:text-ink': !props.isActive,
      }"
      :name="props.icon"
    />
  </button>
</template>
