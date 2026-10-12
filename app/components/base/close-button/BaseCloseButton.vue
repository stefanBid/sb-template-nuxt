<script setup lang="ts">
// Input / Output
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'close', falsyValue: false): void
}>()

// Events
const onClose = () => {
  emit('close', false)
}
</script>

<template>
  <button
    class="inline-flex group items-center rounded-sm p-1 ml-4 cursor-pointer text-ink-muted hover:text-ink sb-transition sb-focus"
    @click.stop="onClose"
  >
    <Icon
      class="size-6 md:size-7 sb-transition"
      name="lucide:x"
    />
  </button>
</template>
