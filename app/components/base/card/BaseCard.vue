<script setup lang="ts">
interface BaseCardProps {
  title?: string
  subtitle?: string
  paragraph?: string
  variant?: 'dark' | 'dark-hover' | 'light' | 'light-hover'
  align?: 'left' | 'center' | 'right'
  fullCustomContent?: boolean
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  title: undefined,
  subtitle: undefined,
  paragraph: undefined,
  variant: 'light',
  align: 'left',
  fullCustomContent: false,
})
</script>

<template>
  <div
    class="flex flex-col justify-center p-4 md:p-6 rounded-xl border border-app-border shadow-[0_4px_20px_var(--color-app-shadow)] u-app-soft-transition"
    :class="{
      'bg-app-surface': props.variant === 'dark',
      'bg-app-surface hover:bg-app-surface-2 focus-within:bg-app-surface-2': props.variant === 'dark-hover',
      'bg-app-surface-2': props.variant === 'light',
      'bg-app-surface-2 hover:bg-app-surface focus-within:bg-app-surface   ': props.variant === 'light-hover',
    }"
  >
    <template v-if="props.fullCustomContent">
      <slot></slot>
    </template>
    <template v-else>
      <div
        v-if="$slots['card-header']"
        class="flex items-start mb-3 md:mb-4 u-app-soft-transition"
        :class="{
          'justify-center md:justify-start': props.align === 'left',
          'justify-center': props.align === 'center',
          'justify-center md:justify-end': props.align === 'right',
        }"
      >
        <slot name="card-header"></slot>
      </div>
      <h2
        v-if="props.title"
        class="ty-app-title u-app-soft-transition"
        :class="{
          'text-center md:text-left': props.align === 'left',
          'text-center': props.align === 'center',
          'text-center md:text-right': props.align === 'right',
        }"
      >
        {{ props.title }}
      </h2>
      <p
        v-if="props.subtitle"
        class="ty-app-subtitle text-app-muted mt-1 u-app-soft-transition"
        :class="{
          'text-center md:text-left': props.align === 'left',
          'text-center': props.align === 'center',
          'text-center md:text-right': props.align === 'right',
        }"
      >
        {{ props.subtitle }}
      </p>
      <p
        v-if="props.paragraph"
        class="ty-app-paragraph text-justify mt-3 md:mt-4 u-app-soft-transition"
      >
        {{ props.paragraph }}
      </p>
      <div
        v-if="$slots['card-footer']"
        class="flex flex-1 items-end mt-6 md:mt-8"
        :class="{
          'justify-center md:justify-start': props.align === 'left',
          'justify-center': props.align === 'center',
          'justify-center md:justify-end': props.align === 'right',
        }"
      >
        <slot name="card-footer"></slot>
      </div>
    </template>
  </div>
</template>
