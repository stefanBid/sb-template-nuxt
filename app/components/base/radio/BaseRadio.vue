<script setup lang="ts">
interface BaseRadioProps {
  id: string
  name: string
  value: string
  label?: string
  isDisabled?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseRadioProps>(), {
  label: undefined,
  isDisabled: false,
})

const model = defineModel<string>('input')
</script>

<template>
  <label
    class="flex w-fit items-center gap-2.5 cursor-pointer pointer-coarse:min-h-11 has-disabled:cursor-not-allowed has-disabled:opacity-45"
    :for="props.id"
  >
    <input
      :id="props.id"
      v-model="model"
      class="size-4.5 md:size-5 accent-primary cursor-pointer disabled:cursor-not-allowed sb-focus"
      :disabled="props.isDisabled"
      :name="props.name"
      type="radio"
      :value="props.value"
    />
    <span
      v-if="props.label"
      class="sb-body text-ink"
    >
      {{ props.label }}
    </span>
  </label>
</template>
