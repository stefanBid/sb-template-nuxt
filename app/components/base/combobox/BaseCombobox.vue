<script setup lang="ts" generic="T">
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

// Floating UI composable
const {
  reference,
  floating,
  floatingStyles,
  open,
  toggleFloating,
} = useFloatingUi({
  placement: 'bottom',
  offset: 8,
  strategy: 'fixed',
})

// Data
const menu = ref<HTMLElement | null>(null)
const menuWidth = ref<string | null>(null)
const resizeRafId = ref<number | null>(null)

// Index of the option highlighted by the keyboard (focus itself stays on the input)
const activeIndex = ref(-1)
const isKeyboardNav = ref(false)

const listboxId = computed(() => `${props.id}-listbox`)
const labelId = computed(() => `${props.id}-label`)
const activeOptionId = computed(() => {
  return open.value && activeIndex.value >= 0 ? _optionId(activeIndex.value) : undefined
})

const valuesWithCommas = computed<string>(() => {
  return model.value.map((v) => {
    const item = props.items.find(i => i.value === v)
    return item ? item.label : ''
  }).join(', ')
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

// Typeahead state
let _typeBuffer = ''
let _typeTimer: ReturnType<typeof setTimeout> | undefined

// Helpers
function _optionId(index: number): string {
  return `${props.id}-option-${index}`
}

const _isSelected = (value: T): boolean => model.value.includes(value)

const _updateMenuWidth = () => {
  if (!import.meta.client) {
    return
  }
  const el = reference.value as HTMLElement | null
  if (el) {
    menuWidth.value = `${el.offsetWidth}px`
  }
}

const _openMenu = (target: 'selected' | 'first' | 'last' = 'selected') => {
  if (props.isDisabled) {
    return
  }

  const lastIndex = props.items.length - 1
  const selectedIndex = props.items.findIndex(item => _isSelected(item.value))

  if (target === 'first') {
    activeIndex.value = lastIndex >= 0 ? 0 : -1
  }
  else if (target === 'last') {
    activeIndex.value = lastIndex
  }
  else {
    activeIndex.value = selectedIndex >= 0 ? selectedIndex : (lastIndex >= 0 ? 0 : -1)
  }

  toggleFloating(true)
}

const _closeMenu = () => {
  toggleFloating(false)
  activeIndex.value = -1
}

const _moveActive = (index: number) => {
  if (!props.items.length) {
    return
  }
  isKeyboardNav.value = true
  activeIndex.value = Math.min(Math.max(index, 0), props.items.length - 1)
}

const _typeahead = (char: string) => {
  clearTimeout(_typeTimer)
  _typeBuffer += char.toLowerCase()
  _typeTimer = setTimeout(() => {
    _typeBuffer = ''
  }, 600)

  const total = props.items.length
  // A repeated single letter cycles through matches, a longer buffer refines the current one
  const start = _typeBuffer.length === 1 ? activeIndex.value + 1 : Math.max(activeIndex.value, 0)

  for (let offset = 0; offset < total; offset++) {
    const index = (start + offset) % total
    if (props.items[index]?.label.toLowerCase().startsWith(_typeBuffer)) {
      if (!open.value) {
        _openMenu()
      }
      _moveActive(index)
      return
    }
  }
}

// Events
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
    if (_isSelected(value)) {
      model.value = []
    }
    else {
      model.value = [value]
    }
    _closeMenu()
  }
}

const onToggle = () => {
  if (open.value) {
    _closeMenu()
  }
  else {
    isKeyboardNav.value = false
    _openMenu()
  }
}

const onOptionHover = (index: number) => {
  isKeyboardNav.value = false
  activeIndex.value = index
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.isDisabled) {
    return
  }

  const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey

  // Space continues a typeahead word, otherwise it behaves like Enter
  if (isPrintable && !(e.key === ' ' && !_typeBuffer)) {
    e.preventDefault()
    _typeahead(e.key)
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (open.value) {
        _moveActive(activeIndex.value + 1)
      }
      else {
        isKeyboardNav.value = true
        _openMenu()
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (open.value) {
        _moveActive(activeIndex.value - 1)
      }
      else {
        isKeyboardNav.value = true
        _openMenu('last')
      }
      break
    case 'Home':
      if (open.value) {
        e.preventDefault()
        _moveActive(0)
      }
      break
    case 'End':
      if (open.value) {
        e.preventDefault()
        _moveActive(props.items.length - 1)
      }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!open.value) {
        isKeyboardNav.value = true
        _openMenu()
      }
      else if (activeIndex.value >= 0) {
        onSelect(props.items[activeIndex.value]!.value)
      }
      break
    case 'Escape':
      // Only swallow Escape while open, so a surrounding dialog can still close on the next press
      if (open.value) {
        e.preventDefault()
        e.stopPropagation()
        _closeMenu()
      }
      break
    case 'Tab':
      if (open.value) {
        _closeMenu()
      }
      break
  }
}

// Click outside: close when clicking outside the menu, ignoring the trigger
onClickOutside(
  floating,
  () => {
    _closeMenu()
  },
  { ignore: [reference] },
)

const onResize = () => {
  if (!import.meta.client) {
    return
  }
  // Throttle with requestAnimationFrame
  if (resizeRafId.value !== null) {
    cancelAnimationFrame(resizeRafId.value)
  }
  resizeRafId.value = requestAnimationFrame(() => {
    _updateMenuWidth()
  })
}

onMounted(() => {
  if (!import.meta.client) {
    return
  }
  window.addEventListener('resize', onResize)
  // Initial width sync (in case the menu opens immediately)
  _updateMenuWidth()
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }
  window.removeEventListener('resize', onResize)
  clearTimeout(_typeTimer)
  if (resizeRafId.value !== null) {
    cancelAnimationFrame(resizeRafId.value)
  }
})

// When the menu opens, match its width to the input
watch(open, (newVal) => {
  if (newVal && import.meta.client) {
    nextTick(() => {
      _updateMenuWidth()
    })
  }
})

// Keep the highlighted option visible while moving with the keyboard
watch(activeIndex, (index) => {
  if (!import.meta.client || index < 0) {
    return
  }
  nextTick(() => {
    document.getElementById(_optionId(index))?.scrollIntoView({ block: 'nearest' })
  })
})
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

    <div
      class="relative"
      :class="{ 'opacity-45': props.isDisabled }"
    >
      <span
        v-if="props.prefixIcon"
        class="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-ink-muted sb-transition pointer-events-none"
      >
        <Icon class="size-5" :name="props.prefixIcon" />
      </span>

      <span class="absolute top-1/2 right-3 md:right-4 transform -translate-y-1/2 text-ink-muted sb-transition pointer-events-none">
        <Icon
          class="size-6 sb-transition"
          :class="{
            'rotate-0': !open,
            'rotate-180': open,
          }"
          name="lucide:chevron-down"
        />

      </span>

      <input
        :id="props.id"
        ref="reference"
        :aria-activedescendant="activeOptionId"
        aria-autocomplete="none"
        :aria-controls="listboxId"
        :aria-describedby="describedBy"
        :aria-expanded="open ? 'true' : 'false'"
        aria-haspopup="listbox"
        :aria-invalid="props.error ? 'true' : 'false'"
        class="w-full rounded-sm bg-surface-2 border pl-3 pr-11 py-1.5 md:pl-4 md:pr-12 md:py-2 text-ink sb-body focus:outline-none focus:ring-2 focus:ring-focus-ring truncate cursor-pointer disabled:cursor-not-allowed"
        :class="{
          'border-error': props.error,
          'border-border-strong': !props.error,
          'pl-10! md:pl-11!': props.prefixIcon,
        }"
        :disabled="props.isDisabled"
        :name="props.name || `${props.id}-name`"
        :placeholder="props.placeholder ?? t('ui.placeholder')"
        readonly
        role="combobox"
        type="text"
        :value="valuesWithCommas"
        @click="onToggle"
        @keydown="onKeydown"
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

    <Teleport to="body">
      <transition name="scale-fade">
        <div
          v-if="open"
          ref="floating"
          class="z-300 rounded-md border border-border bg-surface shadow-lg"
          :style="[
            floatingStyles,
            { width: menuWidth ? menuWidth : 'auto' },
          ]"
        >
          <ul
            :id="listboxId"
            ref="menu"
            :aria-labelledby="props.label ? labelId : undefined"
            :aria-multiselectable="props.type === 'multiple' ? 'true' : undefined"
            class="outline-none max-h-80 overflow-y-auto p-1"
            role="listbox"
          >
            <li
              v-for="(item, index) in props.items"
              :id="_optionId(index)"
              :key="index"
              :aria-selected="_isSelected(item.value) ? 'true' : 'false'"
              class="relative flex items-center w-full text-left px-3 py-2 md:px-3.5 md:py-2.5 min-h-9 sm:min-h-10 pointer-coarse:min-h-11 gap-1 rounded-sm text-ink cursor-pointer sb-label sb-transition"
              :class="{
                'bg-surface-2': activeIndex === index,
                'bg-primary-soft': activeIndex !== index && _isSelected(item.value),
                'ring-2 ring-inset ring-focus-ring': activeIndex === index && isKeyboardNav,
              }"
              role="option"
              @click="onSelect(item.value)"
              @mousedown.prevent
              @mousemove="onOptionHover(index)"
            >
              <span class="truncate flex-1">{{ item.label }}</span>
              <Icon
                v-if="_isSelected(item.value)"
                class="size-5 text-primary shrink-0 sb-transition"
                name="lucide:check"
              />
            </li>
            <li
              v-if="!props.items.length"
              aria-disabled="true"
              class="px-3 py-2 md:px-3.5 md:py-2.5 text-ink-muted sb-small"
              role="option"
            >
              {{ t('ui.empty') }}
            </li>
          </ul>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
