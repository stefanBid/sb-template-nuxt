<script setup lang="ts">
interface BaseCheckboxProps {
  id: string
  name?: string
  label?: string
  error?: string | null
  isDisabled?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseCheckboxProps>(), {
  name: undefined,
  label: undefined,
  error: null,
  isDisabled: false,
})

const model = defineModel<boolean>('input')
</script>

<template>
  <div>
    <label
      class="flex w-fit h-fit items-center gap-2 cursor-pointer pointer-coarse:min-h-11 has-disabled:cursor-not-allowed has-disabled:opacity-45"
      :for="props.id"
    >
      <span class="relative inline-flex shrink-0">
        <input
          :id="props.id"
          v-model="model"
          :aria-describedby="props.error ? `${props.id}-error` : undefined"
          :aria-invalid="props.error ? 'true' : 'false'"
          class="peer size-4.5 md:size-5 rounded-sm border bg-surface-2 sb-transition cursor-pointer appearance-none checked:bg-primary checked:border-primary sb-focus"
          :class="props.error ? 'border-error' : 'border-border-strong'"
          :disabled="props.isDisabled"
          :name="props.name || `${props.id}-name`"
          type="checkbox"
        />
        <Icon
          class="pointer-events-none absolute inset-0 m-auto size-3.5 text-on-primary opacity-0 peer-checked:opacity-100 sb-transition"
          name="lucide:check"
        />
      </span>

      <span
        v-if="!$slots.default"
        class="sb-body text-ink sb-transition"
      >
        {{ props.label }}
      </span>
      <span
        v-else
        class="sb-body text-ink sb-transition"
      >
        <slot></slot>
      </span>
    </label>

    <p
      v-if="props.error"
      :id="`${props.id}-error`"
      class="sb-small text-error mt-1 md:mt-1.5 sb-transition"
      role="alert"
    >
      {{ props.error }}
    </p>
  </div>
</template>
