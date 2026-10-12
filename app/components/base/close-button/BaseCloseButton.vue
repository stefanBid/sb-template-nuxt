<script setup lang="ts">
interface BaseCloseButtonProps {
  ariaLabel?: string
}

// Dependencies
const { t } = useI18n()

// Input / Output
const props = withDefaults(defineProps<BaseCloseButtonProps>(), {
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (e: 'close', falsyValue: false): void
}>()

// Events
const onClose = () => {
  emit('close', false)
}
</script>

<template>
  <button
    :aria-label="props.ariaLabel || t('ui.close')"
    class="relative inline-flex group items-center rounded-sm p-1 ml-4 cursor-pointer text-ink-muted hover:text-ink sb-transition sb-focus before:absolute before:-inset-2"
    type="button"
    @click.stop="onClose"
  >
    <Icon
      class="size-6 md:size-7 sb-transition"
      name="lucide:x"
    />
  </button>
</template>
