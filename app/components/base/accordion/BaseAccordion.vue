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
    class="border border-border rounded-md bg-surface overflow-hidden shadow-md sb-transition hover:shadow-md sb-focus-within"
    :data-accordion-id="props.id"
  >
    <!-- Header -->
    <button
      class="w-full p-4 md:p-6 cursor-pointer flex items-center gap-4 md:gap-6 text-left sb-transition sb-no-focus"
      :class="{
        'bg-surface-2': open,
        'bg-surface hover:bg-surface-2': !open,
      }"
      type="button"
      @click="onToggle"
    >
      <!-- Icon Box -->
      <div
        v-if="props.icon"
        class="shrink-0 size-12 md:size-14 rounded-sm bg-primary-soft flex items-center justify-center sb-transition"
      >
        <Icon
          class="size-6 md:size-7 text-primary sb-transition"
          :name="props.icon"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="sb-h4 text-ink sb-transition">
          {{ props.title }}
        </h3>
      </div>

      <!-- Chevron -->
      <Icon
        class="shrink-0 size-5 md:size-6 text-primary sb-transition"
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
        class=" p-6 md:p-8 border-t border-border"
      >
        <div class="text-ink-muted sb-transition">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
