<script setup lang="ts">
interface BaseSwitchProps {
  id: string
  name?: string
  label?: string
}

// Input / Output
const props = withDefaults(defineProps<BaseSwitchProps>(), {
  name: undefined,
  label: undefined,
})

const model = defineModel<boolean>('input')
</script>

<template>
  <label class="flex w-fit items-center gap-3 cursor-pointer" :for="props.id">
    <span class="relative inline-flex w-10.5 h-6 shrink-0">
      <input
        :id="props.id"
        v-model="model"
        class="peer sr-only"
        :name="props.name || `${props.id}-name`"
        type="checkbox"
      />
      <span
        aria-hidden="true"
        class="absolute inset-0 rounded-full bg-app-border u-app-soft-transition
               peer-checked:bg-app-accent
               peer-focus-visible:ring-2 peer-focus-visible:ring-app-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-app-main"
      ></span>
      <span
        aria-hidden="true"
        class="absolute left-0.75 top-0.75 size-4.5 rounded-full bg-app-surface shadow-[0_1px_2px_var(--color-app-shadow)]
               u-app-soft-transition peer-checked:translate-x-4.5"
      ></span>
    </span>
    <span v-if="props.label" class="ty-app-p text-app-contrast">{{ props.label }}</span>
  </label>
</template>
