<script setup lang="ts">
import { SbContainer, SbFloating, SbReference } from 'sb-floating-panel-vue'

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
  isDisabled?: boolean
}

// Dependencies
const { t } = useI18n()
const { isPointer, onPointerMove, reset: _resetPointer } = usePointerHighlight()

// Input / Output
const props = withDefaults(defineProps<BaseSelectProps>(), {
  name: undefined,
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: null,
  isDisabled: false,
})

const model = defineModel<string>('input')

// Data
const labelId = computed(() => `${props.id}-label`)
const valueId = computed(() => `${props.id}-value`)

const selectedOption = computed(() => props.options.find(o => o.value === model.value))

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

// Events
// The panel closes through closeOnSelect, after this handler
const onSelect = (value: string) => {
  model.value = value
}
</script>

<template>
  <div>
    <label
      v-if="props.label"
      :id="labelId"
      class="sb-label block text-ink-muted mb-2 md:mb-3 sb-transition"
      :for="props.id"
    >
      {{ props.label }}
    </label>

    <SbContainer
      :disabled="props.isDisabled"
      match-width
      placement="bottom"
      strategy="fixed"
    >
      <template #default="{ isOpen }">
        <SbReference
          :id="props.id"
          :aria-describedby="describedBy"
          :aria-invalid="props.error ? 'true' : 'false'"
          :aria-labelledby="props.label ? `${labelId} ${valueId}` : undefined"
          class="flex items-center gap-2 w-full rounded-sm bg-surface-2 border px-3 py-1.5 md:px-4 md:py-2 text-left sb-body cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sb-focus sb-transition"
          :class="props.error ? 'border-error' : 'border-border-strong'"
        >
          <span
            :id="valueId"
            class="truncate flex-1"
            :class="selectedOption ? 'text-ink' : 'text-ink-muted'"
          >
            {{ selectedOption?.label ?? props.placeholder ?? t('ui.select-placeholder') }}
          </span>
          <Icon
            class="size-5 shrink-0 text-ink-muted sb-transition"
            :class="isOpen ? 'rotate-180' : 'rotate-0'"
            name="lucide:chevron-down"
          />
        </SbReference>

        <SbFloating
          :aria-labelledby="props.label ? labelId : props.id"
          as="ul"
          class="max-h-[min(20rem,var(--sbf-available-height))] overflow-y-auto p-1 rounded-md border border-border bg-surface shadow-lg outline-none origin-(--sbf-transform-origin) data-[sbf-state=closed]:pointer-events-none"
          close-on-select
          role="listbox"
          transition="scale-fade"
          :z-index="300"
          @after-leave="_resetPointer"
          @keydown="_resetPointer"
        >
          <li
            v-for="option in props.options"
            :key="option.value"
            :aria-selected="option.value === model ? 'true' : 'false'"
            class="relative flex items-center w-full text-left px-3 py-2 md:px-3.5 md:py-2.5 min-h-9 sm:min-h-10 pointer-coarse:min-h-11 gap-2 rounded-sm text-ink cursor-pointer outline-none sb-transition"
            :class="{
              'bg-primary-soft sb-body-strong': option.value === model,
              'focus:bg-surface-2 sb-body': option.value !== model,
              'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring': !isPointer,
            }"
            role="option"
            tabindex="-1"
            @click="onSelect(option.value)"
            @pointermove="onPointerMove"
          >
            <span class="flex-1 min-w-0 break-words">{{ option.label }}</span>
            <Icon
              v-if="option.value === model"
              class="size-5 text-primary shrink-0 sb-transition"
              name="lucide:check"
            />
          </li>
          <li
            v-if="!props.options.length"
            aria-disabled="true"
            class="px-3 py-2 md:px-3.5 md:py-2.5 text-ink-muted sb-small outline-none"
            role="option"
            tabindex="-1"
          >
            {{ t('ui.no-options') }}
          </li>
        </SbFloating>
      </template>
    </SbContainer>

    <!-- A button submits no value, so native forms read the selection from a hidden field -->
    <input
      v-if="model"
      :disabled="props.isDisabled"
      :name="props.name || `${props.id}-name`"
      type="hidden"
      :value="model"
    />

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
