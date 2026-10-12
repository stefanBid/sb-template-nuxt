<script setup lang="ts">
interface BaseInputProps {
  id: string
  name?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
  hint?: string
  error?: string | null
  autocomplete?: string
  prefixIcon?: string
  isDisabled?: boolean
  isReadonly?: boolean
}
// Dependencies
const { t } = useI18n()

// Input / Output
const props = withDefaults(defineProps<BaseInputProps>(), {
  label: undefined,
  placeholder: undefined,
  type: 'text',
  name: undefined,
  autocomplete: 'off',
  hint: undefined,
  error: null,
  prefixIcon: undefined,
  isDisabled: false,
  isReadonly: false,
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
</script>

<template>
  <div>
    <label
      v-if="props.label"
      class="sb-label block text-ink-muted mb-2 md:mb-3 sb-transition"
      :for="props.id"
    >{{ props.label }}</label>
    <div class="relative">
      <span v-if="props.prefixIcon" class="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-ink-muted sb-transition pointer-events-none">
        <Icon class="size-5" :name="props.prefixIcon" />
      </span>
      <input
        :id="props.id"
        v-model="model"
        :aria-describedby="describedBy"
        :aria-invalid="props.error ? 'true' : 'false'"
        :autocomplete="props.autocomplete"
        class="w-full rounded-sm bg-surface-2 border px-3 py-1.5 md:px-4 md:py-2 text-ink sb-body focus:outline-none focus:ring-2 focus:ring-focus-ring truncate disabled:opacity-45 disabled:cursor-not-allowed read-only:bg-surface"
        :class="{
          'border-error': props.error,
          'border-border-strong': !props.error,
          'pl-10! md:pl-11!': props.prefixIcon,
        }
        "
        :disabled="props.isDisabled"
        :name="props.name || `${props.id}-name`"
        :placeholder="props.placeholder ?? t('ui.placeholder')"
        :readonly="props.isReadonly"
        :type="props.type"
      />
    </div>
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
