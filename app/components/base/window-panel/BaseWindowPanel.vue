<script setup lang="ts">
interface BaseWindowPanelProps {
  filename: string
}

// Input / Output
const props = defineProps<BaseWindowPanelProps>()
</script>

<template>
  <div class="rounded-lg border border-border bg-surface p-6 md:p-7 shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <div aria-hidden="true" class="flex gap-1.5">
        <span class="size-2 rounded-full bg-border"></span>
        <span class="size-2 rounded-full bg-border"></span>
        <span class="size-2 rounded-full bg-border"></span>
      </div>
      <code class="sb-small text-primary">{{ props.filename }}</code>
    </div>
    <slot></slot>
  </div>
</template>
