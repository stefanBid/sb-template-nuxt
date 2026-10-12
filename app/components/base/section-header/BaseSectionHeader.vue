<script setup lang="ts">
interface BaseSectionHeaderProps {
  heading: string
  eyebrow?: string
  description?: string
}

// Input / Output
const props = withDefaults(defineProps<BaseSectionHeaderProps>(), {
  eyebrow: undefined,
  description: undefined,
})
</script>

<template>
  <div class="max-w-2xl">
    <span v-if="props.eyebrow" class="sb-overline text-primary block mb-2">
      {{ props.eyebrow }}
    </span>
    <h2 class="text-ink text-balance">
      {{ props.heading }}
    </h2>
    <p v-if="props.description" class="sb-body text-ink-muted mt-2">
      {{ props.description }}
    </p>
  </div>
</template>
