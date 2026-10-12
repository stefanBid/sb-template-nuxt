<script setup lang="ts">
interface BaseIconMenuProps {
  icon: string
  items: Array<MenuItem>
  ariaLabel?: string
  selectedItemId?: string | null
}

// Input / Output
const props = withDefaults(defineProps<BaseIconMenuProps>(), {
  ariaLabel: undefined,
  selectedItemId: null,
})

const emit = defineEmits<{
  (e: 'select', itemId: string): void
}>()

// Floating UI composable
const { reference, floating, floatingStyles, open, toggleFloating } = useFloatingUi({
  placement: 'bottom-start',
  offset: 8,
  strategy: 'fixed',
})

// Data
const menuId = useId()
const menu = ref<HTMLElement | null>(null)

// Which item receives focus when the menu opens
let _initialFocus: 'first' | 'last' = 'first'

// Helpers
const _getItems = (): HTMLElement[] => {
  return Array.from(menu.value?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])
}

const _focusTrigger = () => {
  reference.value?.querySelector<HTMLElement>('button')?.focus()
}

const _closeAndRestoreFocus = () => {
  toggleFloating(false)
  _focusTrigger()
}

const _moveFocus = (step: 1 | -1) => {
  const items = _getItems()
  if (!items.length) {
    return
  }
  const current = items.indexOf(document.activeElement as HTMLElement)
  const next = (current + step + items.length) % items.length
  items[next]?.focus()
}

// Events
const onSelect = (itemId: string) => {
  emit('select', itemId)
  _closeAndRestoreFocus()
}

// Click outside: close when clicking outside the menu, ignoring the trigger
onClickOutside(floating, () => {
  toggleFloating(false)
}, { ignore: [reference] })

const onTriggerKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    _initialFocus = e.key === 'ArrowUp' ? 'last' : 'first'
    toggleFloating(true)
  }
  else if (e.key === 'Escape' && open.value) {
    e.preventDefault()
    e.stopPropagation()
    toggleFloating(false)
  }
}

const onMenuKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      _moveFocus(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      _moveFocus(-1)
      break
    case 'Home':
      e.preventDefault()
      _getItems()[0]?.focus()
      break
    case 'End':
      e.preventDefault()
      _getItems().at(-1)?.focus()
      break
    case 'Escape':
    case 'Tab':
      // The panel is teleported to <body>, so Tab would leave the page flow: return to the trigger instead
      e.preventDefault()
      e.stopPropagation()
      _closeAndRestoreFocus()
      break
  }
}

watch(open, (newVal) => {
  if (newVal) {
    nextTick(() => {
      const items = _getItems()
      const target = _initialFocus === 'last' ? items.at(-1) : items[0]
      target?.focus()
      _initialFocus = 'first'
    })
  }
})
</script>

<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div ref="reference" @keydown="onTriggerKeydown">
      <BaseIconButton
        :aria-controls="open ? menuId : undefined"
        :aria-expanded="open ? 'true' : 'false'"
        aria-haspopup="menu"
        :aria-label="props.ariaLabel"
        :icon="props.icon"
        :is-active="open"
        @click="toggleFloating(!open)"
      />
    </div>

    <!-- Menu -->
    <Teleport to="body">
      <transition name="scale-fade">
        <div
          v-if="open"
          ref="floating"
          class="z-100 rounded-md border border-border bg-surface w-fit shadow-lg"
          :style="floatingStyles"
          @keydown="onMenuKeydown"
        >
          <ul
            :id="menuId"
            ref="menu"
            :aria-label="props.ariaLabel"
            class="p-2 outline-none space-y-2 mb-0"
            role="menu"
          >
            <li v-for="item in props.items" :key="item.code" role="none">
              <button
                :aria-checked="item.code === props.selectedItemId ? 'true' : 'false'"
                class="group inline-flex items-center w-full text-left rounded-sm px-3 py-2 md:px-3.5 md:py-2.5 pointer-coarse:min-h-11 text-ink gap-2 sb-focus sb-transition"
                :class="{
                  'bg-surface-2': props.selectedItemId === item.code,
                  'hover:bg-surface-2 cursor-pointer': props.selectedItemId !== item.code,
                }"
                role="menuitemradio"
                tabindex="-1"
                type="button"
                @click="onSelect(item.code)"
              >
                <Icon
                  v-if="item.iconType === 'nuxt-icon'"
                  class="size-4 shrink-0"
                  :name="item.icon"
                />
                <NuxtImg
                  v-else-if="item.iconType === 'custom'"
                  alt=""
                  class="size-4 shrink-0"
                  :src="item.icon"
                />
                <span class="truncate flex-1 sb-small">{{ item.label }}</span>
                <Icon
                  v-if="item.code === props.selectedItemId"
                  class="size-4 text-primary shrink-0"
                  name="lucide:check"
                />
              </button>
            </li>
          </ul>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
