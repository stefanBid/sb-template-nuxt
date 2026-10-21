<script setup lang="ts" generic="T">
import { SbContainer, SbFloating, SbReference } from 'sb-floating-panel-vue'

interface BaseComboboxProps {
  id: string
  name?: string
  type?: 'single' | 'multiple'
  items: {
    label: string
    value: T
  }[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string | null
  prefixIcon?: string
  isDisabled?: boolean
}

// Dependencies
const { t } = useI18n()
const { isPointer, onPointerMove, reset: _resetPointer } = usePointerHighlight()

// Input / Output
const props = withDefaults(defineProps<BaseComboboxProps>(), {
  type: 'single',
  label: undefined,
  placeholder: undefined,
  name: undefined,
  hint: undefined,
  error: null,
  prefixIcon: undefined,
  isDisabled: false,
})

const model = defineModel<T[]>('input', {
  default: () => [],
})

// Data
const chipList = ref<HTMLElement | null>(null)

const labelId = computed(() => `${props.id}-label`)
const valueId = computed(() => `${props.id}-value`)

const selectedItems = computed(() => {
  return model.value.flatMap((v) => {
    const item = props.items.find(i => i.value === v)
    return item ? [item] : []
  })
})

// Up to two names fit the field; past that a joined string would truncate, so it collapses to a count
const displayValue = computed<string>(() => {
  if (selectedItems.value.length <= 2) {
    return selectedItems.value.map(i => i.label).join(', ')
  }
  return t('ui.combobox.selected-count', { n: selectedItems.value.length })
})

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

// Helpers
const _isSelected = (value: T): boolean => model.value.includes(value)

// Events
// In single mode the panel closes through closeOnSelect; a multiselectable listbox stays open.
// Picking the selected option again keeps it: confirming a choice must never clear it.
const onSelect = (value: T) => {
  if (props.type === 'multiple') {
    if (_isSelected(value)) {
      model.value = model.value.filter(v => v !== value)
    }
    else {
      model.value = [...model.value, value]
    }
  }
  else {
    model.value = [value]
  }
}

// The removed chip unmounts with focus on it: move focus to the chip now in its place, else the field
const onRemove = (value: T, index: number) => {
  model.value = model.value.filter(v => v !== value)
  nextTick(() => {
    const chips = chipList.value?.querySelectorAll<HTMLElement>('button') ?? []
    const target = chips[Math.min(index, chips.length - 1)] ?? document.getElementById(props.id)
    target?.focus()
  })
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
          <Icon
            v-if="props.prefixIcon"
            class="size-5 shrink-0 text-ink-muted sb-transition"
            :name="props.prefixIcon"
          />
          <span
            :id="valueId"
            class="truncate flex-1"
            :class="displayValue ? 'text-ink' : 'text-ink-muted'"
          >
            {{ displayValue || (props.placeholder ?? t('ui.select-placeholder')) }}
          </span>
          <Icon
            class="size-5 shrink-0 text-ink-muted sb-transition"
            :class="isOpen ? 'rotate-180' : 'rotate-0'"
            name="lucide:chevron-down"
          />
        </SbReference>

        <SbFloating
          :aria-labelledby="props.label ? labelId : props.id"
          :aria-multiselectable="props.type === 'multiple' ? 'true' : undefined"
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
            v-for="(item, index) in props.items"
            :key="index"
            :aria-selected="_isSelected(item.value) ? 'true' : 'false'"
            class="relative flex items-center w-full text-left px-3 py-2 md:px-3.5 md:py-2.5 min-h-9 sm:min-h-10 pointer-coarse:min-h-11 gap-2 rounded-sm text-ink cursor-pointer outline-none sb-transition"
            :class="{
              'bg-primary-soft sb-body-strong': _isSelected(item.value),
              'focus:bg-surface-2 sb-body': !_isSelected(item.value),
              'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring': !isPointer,
            }"
            role="option"
            tabindex="-1"
            @click="onSelect(item.value)"
            @pointermove="onPointerMove"
          >
            <span class="flex-1 min-w-0 break-words">{{ item.label }}</span>
            <Icon
              v-if="_isSelected(item.value)"
              class="size-5 text-primary shrink-0 sb-transition"
              name="lucide:check"
            />
          </li>
          <li
            v-if="!props.items.length"
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

    <!-- A button submits no value, so native forms read the selection from hidden fields -->
    <input
      v-for="(value, index) in model"
      :key="index"
      :disabled="props.isDisabled"
      :name="props.name || `${props.id}-name`"
      type="hidden"
      :value="String(value)"
    />

    <!-- Selected items (multiple): each one is removable without opening the menu -->
    <ul
      v-if="props.type === 'multiple' && selectedItems.length"
      ref="chipList"
      :aria-label="t('ui.combobox.selected-list')"
      class="flex flex-wrap gap-2 mt-2"
    >
      <li v-for="(item, index) in selectedItems" :key="index">
        <BaseChip
          :aria-label="t('ui.combobox.remove', { label: item.label })"
          clickable
          icon="lucide:x"
          :is-disabled="props.isDisabled"
          :text="item.label"
          variant="secondary"
          @chip-click="onRemove(item.value, index)"
        />
      </li>
    </ul>

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
