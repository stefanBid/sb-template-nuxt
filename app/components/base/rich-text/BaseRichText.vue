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
</script>

<template>
  <div
    class="rich-text sb-transition"
    v-html="htmlContent"
  ></div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

/* Headings take their size from the base layer (sb-h1…sb-h4); only prose spacing lives here */
.rich-text :deep(h1) {
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.rich-text :deep(h2) {
  margin-bottom: 1.25rem;
  margin-top: 1.75rem;
}

.rich-text :deep(h3) {
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.rich-text :deep(h4),
.rich-text :deep(h5),
.rich-text :deep(h6) {
  margin-bottom: 0.75rem;
  margin-top: 1.25rem;
}

.rich-text :deep(h1:first-child),
.rich-text :deep(h2:first-child),
.rich-text :deep(h3:first-child),
.rich-text :deep(h4:first-child),
.rich-text :deep(h5:first-child),
.rich-text :deep(h6:first-child) {
  margin-top: 0;
}

.rich-text :deep(p),
.rich-text :deep(ul),
.rich-text :deep(ol) {
  @apply sb-body;
  margin-bottom: 1rem;
}

.rich-text :deep(ul),
.rich-text :deep(ol) {
  padding-left: 2rem;
  list-style-position: outside;
}

.rich-text :deep(li) {
  margin-bottom: 0.5rem;
  display: list-item;
}

.rich-text :deep(ul li) {
  list-style-type: disc;
}

.rich-text :deep(ol li) {
  list-style-type: decimal;
}

.rich-text :deep(blockquote) {
  @apply sb-body;
  font-style: italic;
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid var(--color-primary);
  opacity: 0.8;
}

.rich-text :deep(pre) {
  margin: 1rem 0;
  padding: 1rem;
  background-color: var(--color-surface-2);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.rich-text :deep(code),
.rich-text :deep(pre code) {
  @apply sb-small;
  font-family: var(--font-mono);
}

.rich-text :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  transition: opacity var(--sb-duration-fast) var(--ease-standard);
}

.rich-text :deep(a:hover) {
  opacity: 0.8;
}

.rich-text :deep(strong) {
  font-weight: 700;
  color: var(--color-ink);
}

.rich-text :deep(em) {
  font-style: italic;
}
</style>
