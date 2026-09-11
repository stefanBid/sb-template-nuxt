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
  // eslint-disable-next-line no-unused-vars
  (e: 'select', itemId: string): void
}>()

// Floating UI composable
const { reference, floating, floatingStyles, open, toggleFloating } = useFloatingUi({
  placement: 'bottom-start',
  offset: 8,
  strategy: 'fixed',
})

// State
const menu = ref<HTMLElement | null>(null)

// Events
const onSelect = (itemId: string) => {
  emit('select', itemId)
  toggleFloating(false)
}

// Click outside: chiudi se clicchi fuori dal menu, ignorando il trigger
onClickOutside(floating, () => {
  toggleFloating(false)
}, { ignore: [reference] })

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    toggleFloating(false)
  }
}

onMounted(() => {
  if (!import.meta.client) {
    return
  }
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }
  window.removeEventListener('keydown', onKeydown)
})

watch(open, (newVal) => {
  if (newVal) {
    nextTick(() => {
      const first = menu.value?.querySelector<HTMLElement>('[role="menuitem"]')
      first?.focus()
    })
  }
})
</script>

<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div ref="reference">
      <BaseIconButton
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
          class="z-100 rounded-md border border-app-border bg-app-surface w-fit shadow-[0_20px_44px_-18px_var(--color-app-shadow),0_2px_8px_var(--color-app-shadow)]"
          :style="floatingStyles"
        >
          <ul
            ref="menu"
            class="p-2 outline-none space-y-2 mb-0"
            role="menu"
          >
            <li v-for="item in props.items" :key="item.code">
              <button
                :aria-current="item.code === props.selectedItemId ? 'true' : 'false'"
                class="group inline-flex items-center w-full text-left rounded-sm px-3 py-2 md:px-3.5 md:py-2.5 text-app-contrast normal-case! gap-2 u-app-focus u-app-soft-transition"
                :class="{
                  'bg-app-surface-2': props.selectedItemId === item.code,
                  'hover:bg-app-surface-2 cursor-pointer': props.selectedItemId !== item.code,
                }"
                role="menuitem"
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
                <span class="truncate flex-1 ty-app-small">{{ item.label }}</span>
                <Icon
                  v-if="item.code === props.selectedItemId"
                  class="size-4 text-app-accent shrink-0"
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
