<script setup lang="ts">
interface BaseCardProps {
  title?: string
  subtitle?: string
  paragraph?: string
  variant?: 'dark' | 'dark-hover' | 'light' | 'light-hover'
  align?: 'left' | 'center' | 'right'
  fullCustomContent?: boolean
}

// Input / Output
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
    class="flex flex-col justify-center rounded-md border border-border shadow-sm sb-transition"
    :class="{
      'p-4 md:p-6': props.fullCustomContent,
      'bg-surface': props.variant === 'dark',
      'bg-surface hover:bg-surface-2 focus-within:bg-surface-2': props.variant === 'dark-hover',
      'bg-surface-2': props.variant === 'light',
      'bg-surface-2 hover:bg-surface focus-within:bg-surface': props.variant === 'light-hover',
    }"
  >
    <template v-if="props.fullCustomContent">
      <slot></slot>
    </template>
    <template v-else>
      <div
        v-if="$slots['card-header']"
        class="flex items-start px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 sb-transition"
        :class="{
          'justify-center md:justify-start': props.align === 'left',
          'justify-center': props.align === 'center',
          'justify-center md:justify-end': props.align === 'right',
        }"
      >
        <slot name="card-header"></slot>
      </div>

      <!-- Body content -->
      <div
        class="flex-1 flex flex-col px-4 md:px-6 sb-transition"
        :class="{
          'pt-4 md:pt-6': !$slots['card-header'],
          'pt-0': $slots['card-header'],
          'pb-4 md:pb-6': !$slots['card-footer'],
          'pb-0': $slots['card-footer'],
        }"
      >
        <!-- Custom body slot -->
        <div v-if="$slots['card-body']">
          <slot name="card-body"></slot>
        </div>

        <!-- Default body content -->
        <template v-else>
          <h3
            v-if="props.title"
            class="sb-h3 sb-transition"
            :class="{
              'text-center md:text-left': props.align === 'left',
              'text-center': props.align === 'center',
              'text-center md:text-right': props.align === 'right',
            }"
          >
            {{ props.title }}
          </h3>
          <p
            v-if="props.subtitle"
            class="sb-h4 text-ink-muted mt-1 sb-transition"
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
            class="sb-body mt-3 md:mt-4 sb-transition"
          >
            {{ props.paragraph }}
          </p>
        </template>
      </div>

      <div
        v-if="$slots['card-footer']"
        class="flex flex-1 items-end px-4 md:px-6 pb-4 md:pb-6 pt-6 md:pt-8 sb-transition"
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
