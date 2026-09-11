<script setup lang="ts">
interface BaseRadioProps {
  id: string
  name: string
  value: string
  label?: string
}

// Input / Output
const props = withDefaults(defineProps<BaseRadioProps>(), {
  label: undefined,
})

const model = defineModel<string>('input')
</script>

<template>
  <div class="flex w-fit items-center gap-2.5">
    <input
      :id="props.id"
      v-model="model"
      class="size-4.5 md:size-5 accent-app-accent cursor-pointer u-app-focus"
      :name="props.name"
      type="radio"
      :value="props.value"
    />
    <label
      v-if="props.label"
      class="ty-app-p text-app-contrast cursor-pointer"
      :for="props.id"
    >
      {{ props.label }}
    </label>
  </div>
</template>
