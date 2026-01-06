<script setup lang="ts">
interface BaseAccordionProps {
  id: string
  title: string
  icon?: string
  isOpen?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseAccordionProps>(), {
  isOpen: undefined,
  icon: undefined,
})

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'toggle'): void
}>()

// State
const internalOpen = ref(false)
const open = computed(() => props.isOpen !== undefined ? props.isOpen : internalOpen.value)

// Events
const onToggle = () => {
  if (props.isOpen !== undefined) {
    emit('toggle')
  }
  else {
    internalOpen.value = !internalOpen.value
  }
}
</script>

<template>
  <div
    class="border border-app-border rounded-xl bg-app-surface overflow-hidden shadow-[0_4px_20px_var(--color-app-shadow)] u-app-soft-transition hover:shadow-[0_6px_24px_var(--color-app-shadow)] u-app-focus-within"
    :data-accordion-id="props.id"
  >
    <!-- Header -->
    <button
      class="w-full p-4 md:p-6 cursor-pointer flex items-center gap-4 md:gap-6 text-left u-app-soft-transition u-app-no-focus"
      :class="{
        'bg-app-surface-2': open,
        'bg-app-surface hover:bg-app-surface-2': !open,
      }"
      type="button"
      @click="onToggle"
    >
      <!-- Icon Box -->
      <div
        v-if="props.icon"
        class="shrink-0 size-12 md:size-14 rounded-lg bg-app-accent/10 flex items-center justify-center u-app-soft-transition"
      >
        <Icon
          class="size-6 md:size-7 text-app-accent u-app-soft-transition"
          :name="props.icon"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="ty-app-subtitle text-app-contrast u-app-soft-transition">
          {{ props.title }}
        </h3>
      </div>

      <!-- Chevron -->
      <Icon
        class="shrink-0 size-5 md:size-6 text-app-accent u-app-soft-transition"
        :class="{
          'rotate-180': open,
        }"
        name="lucide:chevron-down"
      />
    </button>

    <!-- Content -->
    <transition name="slide-down">
      <div
        v-if="open"
        class=" p-6 md:p-8 border-t border-app-border"
      >
        <div class="text-app-muted u-app-soft-transition">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
