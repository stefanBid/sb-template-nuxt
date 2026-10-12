<script setup lang="ts">
interface Props {
  blocks: RichBlock[]
}

// Dependencies
const { sanitizeHtml } = useSanitize()

// Input / Output
const props = defineProps<Props>()

// State
const htmlContent = computed(() => {
  const html = blocksToHtml(props.blocks)
  return sanitizeHtml(html)
})

// Prose styling for the injected HTML: v-html content can only be reached through descendant selectors
const proseClasses = [
  '[&_h1]:mt-8 [&_h1]:mb-6 [&_h2]:mt-7 [&_h2]:mb-5 [&_h3]:mt-6 [&_h3]:mb-4',
  '[&_h4]:mt-5 [&_h4]:mb-3 [&_h5]:mt-5 [&_h5]:mb-3 [&_h6]:mt-5 [&_h6]:mb-3',
  '[&_h1:first-child]:mt-0 [&_h2:first-child]:mt-0 [&_h3:first-child]:mt-0',
  '[&_h4:first-child]:mt-0 [&_h5:first-child]:mt-0 [&_h6:first-child]:mt-0',
  '[&_p]:sb-body [&_p]:mb-4 [&_ul]:sb-body [&_ul]:mb-4 [&_ol]:sb-body [&_ol]:mb-4',
  '[&_ul]:pl-8 [&_ol]:pl-8 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:list-outside [&_ol]:list-outside',
  '[&_li]:mb-2 [&_li]:list-item',
  '[&_blockquote]:sb-body [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-sm [&_blockquote]:bg-surface-2 [&_blockquote]:text-ink-muted',
  '[&_pre]:my-4 [&_pre]:p-4 [&_pre]:bg-surface-2 [&_pre]:rounded-sm [&_pre]:overflow-x-auto',
  '[&_code]:sb-small [&_code]:font-mono',
  '[&_a]:text-primary [&_a]:underline [&_a]:sb-transition [&_a:hover]:opacity-80',
  '[&_strong]:font-bold [&_strong]:text-ink [&_em]:italic',
]
</script>

<template>
  <div
    class="sb-transition"
    :class="proseClasses"
    v-html="htmlContent"
  ></div>
</template>
