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
    class="rich-text u-app-soft-transition"
    v-html="htmlContent"
  ></div>
</template>

<style scoped>
/* Typography styles conformi al progetto */

/* h1 = ty-app-title-xl */
.rich-text :deep(h1) {
  font-family: var(--font-app-primary);
  line-height: 1.375; /* leading-tight */
  font-size: 2.25rem; /* text-4xl */
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.rich-text :deep(h1:first-child) {
  margin-top: 0;
}

@media (min-width: 640px) {
  .rich-text :deep(h1) {
    font-size: 3rem; /* sm:text-5xl */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(h1) {
    font-size: 3.75rem; /* md:text-6xl */
  }
}

@media (min-width: 1024px) {
  .rich-text :deep(h1) {
    font-size: 4.5rem; /* lg:text-7xl */
  }
}

/* h2 = ty-app-title-lg */
.rich-text :deep(h2) {
  font-family: var(--font-app-primary);
  line-height: 1.375; /* leading-tight */
  font-size: 1.875rem; /* text-3xl */
  margin-bottom: 1.25rem;
  margin-top: 1.75rem;
}

.rich-text :deep(h2:first-child) {
  margin-top: 0;
}

@media (min-width: 640px) {
  .rich-text :deep(h2) {
    font-size: 2.25rem; /* sm:text-4xl */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(h2) {
    font-size: 3rem; /* md:text-5xl */
  }
}

@media (min-width: 1024px) {
  .rich-text :deep(h2) {
    font-size: 3.75rem; /* lg:text-6xl */
  }
}

/* h3 = ty-app-title */
.rich-text :deep(h3) {
  font-family: var(--font-app-primary);
  line-height: 1.375; /* leading-tight */
  font-size: 1.5rem; /* text-2xl */
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.rich-text :deep(h3:first-child) {
  margin-top: 0;
}

@media (min-width: 640px) {
  .rich-text :deep(h3) {
    font-size: 1.875rem; /* sm:text-3xl */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(h3) {
    font-size: 2.25rem; /* md:text-4xl */
  }
}

/* h4-h6 = ty-app-subtitle */
.rich-text :deep(h4),
.rich-text :deep(h5),
.rich-text :deep(h6) {
  font-family: var(--font-app-secondary);
  font-weight: 600; /* font-semibold */
  line-height: 1.375; /* leading-snug */
  font-size: 1rem; /* text-base */
  margin-bottom: 0.75rem;
  margin-top: 1.25rem;
}

.rich-text :deep(h4:first-child),
.rich-text :deep(h5:first-child),
.rich-text :deep(h6:first-child) {
  margin-top: 0;
}

@media (min-width: 640px) {
  .rich-text :deep(h4),
  .rich-text :deep(h5),
  .rich-text :deep(h6) {
    font-size: 1.125rem; /* sm:text-lg */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(h4),
  .rich-text :deep(h5),
  .rich-text :deep(h6) {
    font-size: 1.25rem; /* md:text-xl */
  }
}

/* p, ul, ol = ty-app-paragraph */
.rich-text :deep(p) {
  font-family: var(--font-app-secondary);
  line-height: 1.625; /* leading-relaxed */
  font-size: 0.875rem; /* text-sm */
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .rich-text :deep(p) {
    font-size: 1rem; /* sm:text-base */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(p) {
    font-size: 1.125rem; /* md:text-lg */
  }
}

.rich-text :deep(ul),
.rich-text :deep(ol) {
  font-family: var(--font-app-secondary);
  line-height: 1.625; /* leading-relaxed */
  font-size: 0.875rem; /* text-sm */
  margin-bottom: 1rem;
  padding-left: 2rem; /* Aumentato per dare spazio ai bullet */
  list-style-position: outside;
}

@media (min-width: 640px) {
  .rich-text :deep(ul),
  .rich-text :deep(ol) {
    font-size: 1rem; /* sm:text-base */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(ul),
  .rich-text :deep(ol) {
    font-size: 1.125rem; /* md:text-lg */
  }
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

/* blockquote = ty-app-paragraph + italic */
.rich-text :deep(blockquote) {
  font-family: var(--font-app-secondary);
  line-height: 1.625; /* leading-relaxed */
  font-size: 0.875rem; /* text-sm */
  font-style: italic;
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid var(--color-app-accent);
  opacity: 0.8;
}

@media (min-width: 640px) {
  .rich-text :deep(blockquote) {
    font-size: 1rem; /* sm:text-base */
  }
}

@media (min-width: 768px) {
  .rich-text :deep(blockquote) {
    font-size: 1.125rem; /* md:text-lg */
  }
}

.rich-text :deep(pre) {
  margin: 1rem 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.375rem;
  overflow-x: auto;
}

@media (prefers-color-scheme: dark) {
  .rich-text :deep(pre) {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.rich-text :deep(code) {
  font-family: monospace;
  font-size: 0.875rem;
}

.rich-text :deep(pre code) {
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .rich-text :deep(pre code) {
    font-size: 0.875rem;
  }
}

.rich-text :deep(a) {
  color: var(--color-app-accent);
  text-decoration: underline;
  transition: opacity 300ms ease-in-out;
}

.rich-text :deep(a:hover) {
  opacity: 0.8;
}

.rich-text :deep(strong) {
  font-weight: 700;
  color: var(--color-app-contrast);
}

.rich-text :deep(em) {
  font-style: italic;
}
</style>
