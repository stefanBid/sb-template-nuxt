<script setup lang="ts">
interface BaseTextareaProps {
  id: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | null
  maxLength?: number
}

// Input / Output
const props = withDefaults(defineProps<BaseTextareaProps>(), {
  label: undefined,
  placeholder: 'Insert a value...',
  name: undefined,
  hint: undefined,
  error: null,
  maxLength: undefined,
})

const model = defineModel<string>('input')

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

const lengths = computed(() => ({
  current: model.value?.length || 0,
  max: props.maxLength || 0,
}),
)
</script>

<template>
  <div>
    <label
      class="sb-label block text-ink-muted sb-transition mb-2 md:mb-3"
      :for="props.id"
    >{{ props.label }}</label>
    <textarea
      :id="props.id"
      v-model="model"
      :aria-describedby="describedBy"
      :aria-invalid="props.error ? 'true' : 'false'"
      class="w-full rounded-sm bg-surface-2 border px-3 py-1.5 md:px-4 md:py-2 text-ink sb-body focus:outline-none focus:ring-2 focus:ring-focus-ring resize-y min-h-38"
      :class="props.error ? 'border-error' : 'border-border'"
      :name="props.name || `${props.id}-name`"
      :placeholder="props.placeholder"
    ></textarea>
    <!-- Max Counter -->
    <p
      v-if="props.maxLength"
      class="sb-small text-ink-muted sb-transition text-right mt-1"
    >
      <span :class="lengths.current > lengths.max ? 'text-error!' : 'text-ink-muted!'">{{ lengths.current }} </span> / {{ lengths.max }}
    </p>
    <!-- Hint -->
    <p
      v-if="props.hint"
      :id="`${props.id}-hint`"
      class="sb-small text-ink-muted mt-1 md:mt-1.5 sb-transition"
    >
      {{ props.hint }}
    </p>
    <!-- Error -->
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
