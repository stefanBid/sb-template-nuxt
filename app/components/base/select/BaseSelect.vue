<script setup lang="ts">
interface BaseSelectOption {
  label: string
  value: string
}

interface BaseSelectProps {
  id: string
  name?: string
  label?: string
  options: BaseSelectOption[]
  placeholder?: string
  hint?: string
  error?: string | null
}

// Input / Output
const props = withDefaults(defineProps<BaseSelectProps>(), {
  name: undefined,
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: null,
})

const model = defineModel<string>('input')

// Data
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) {
    ids.push(`${props.id}-hint`)
  }
  if (props.error) {
    ids.push(`${props.id}-error`)
  }
  return ids.length ? ids.join(' ') : undefined
})
</script>

<template>
  <div>
    <label
      v-if="props.label"
      class="ty-app-label block text-app-muted mb-2 md:mb-3 u-app-soft-transition"
      :for="props.id"
    >
      {{ props.label }}
    </label>

    <div class="relative">
      <select
        :id="props.id"
        v-model="model"
        :aria-describedby="describedBy"
        :aria-invalid="props.error ? 'true' : 'false'"
        class="w-full appearance-none rounded-sm bg-app-surface-2 border pl-3 pr-10 py-1.5 md:pl-4 md:pr-11 md:py-2
               text-app-contrast ty-app-p focus:outline-none focus:ring-2 focus:ring-app-accent cursor-pointer"
        :class="props.error ? 'border-app-error' : 'border-app-border'"
        :name="props.name || `${props.id}-name`"
      >
        <option v-if="props.placeholder" disabled value="">
          {{ props.placeholder }}
        </option>
        <option v-for="option in props.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <span class="absolute top-1/2 right-3 md:right-4 -translate-y-1/2 text-app-muted/70 pointer-events-none">
        <Icon class="size-5" name="lucide:chevron-down" />
      </span>
    </div>

    <!-- Hint -->
    <p
      v-if="props.hint"
      :id="`${props.id}-hint`"
      class="ty-app-label normal-case! text-app-muted mt-1 md:mt-1.5 u-app-soft-transition"
    >
      {{ props.hint }}
    </p>

    <!-- Error -->
    <p
      v-if="props.error"
      :id="`${props.id}-error`"
      class="ty-app-label normal-case! text-app-error mt-1 md:mt-1.5 u-app-soft-transition"
      role="alert"
    >
      {{ props.error }}
    </p>
  </div>
</template>
