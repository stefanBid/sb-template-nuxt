<script setup lang="ts">
import { BaseIconButton } from '#components'
import { SbContainer, SbFloating, SbReference } from 'sb-floating-panel-vue'

interface BaseIconMenuProps {
  icon: string
  items: Array<MenuItem>
  ariaLabel?: string
  selectedItemId?: string | null
}

// Dependencies
const { isPointer, onPointerMove, reset: _resetPointer } = usePointerHighlight()

// Input / Output
const props = withDefaults(defineProps<BaseIconMenuProps>(), {
  ariaLabel: undefined,
  selectedItemId: null,
})

const emit = defineEmits<{
  (e: 'select', itemId: string): void
}>()

// Events
// closeOnSelect skips menuitemradio, so the menu is closed here; focus goes back to the trigger
const onSelect = (itemId: string, close: () => void) => {
  emit('select', itemId)
  close()
}
</script>

<template>
  <div class="inline-block">
    <SbContainer placement="bottom-start" strategy="fixed">
      <template #default="{ isOpen, close }">
        <!-- Trigger -->
        <SbReference
          :aria-label="props.ariaLabel"
          :as="BaseIconButton"
          :icon="props.icon"
          :is-active="isOpen"
        />

        <!-- Menu -->
        <SbFloating
          :aria-label="props.ariaLabel"
          as="ul"
          class="rounded-md border border-border bg-surface w-fit shadow-lg p-1 mb-0 outline-none origin-(--sbf-transform-origin) data-[sbf-state=closed]:pointer-events-none"
          role="menu"
          transition="scale-fade"
          :z-index="100"
          @after-leave="_resetPointer"
          @keydown="_resetPointer"
        >
          <li v-for="item in props.items" :key="item.code" role="none">
            <button
              :aria-checked="item.code === props.selectedItemId ? 'true' : 'false'"
              class="inline-flex items-center w-full text-left rounded-sm px-3 py-2 md:px-3.5 md:py-2.5 pointer-coarse:min-h-11 text-ink gap-2 cursor-pointer outline-none sb-transition"
              :class="{
                'bg-primary-soft': props.selectedItemId === item.code,
                'focus:bg-surface-2': props.selectedItemId !== item.code,
                'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring': !isPointer,
              }"
              role="menuitemradio"
              tabindex="-1"
              type="button"
              @click="onSelect(item.code, close)"
              @pointermove="onPointerMove"
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
              <span
                class="truncate flex-1"
                :class="props.selectedItemId === item.code ? 'sb-body-strong' : 'sb-body'"
              >
                {{ item.label }}
              </span>
              <Icon
                v-if="item.code === props.selectedItemId"
                class="size-4 text-primary shrink-0"
                name="lucide:check"
              />
            </button>
          </li>
        </SbFloating>
      </template>
    </SbContainer>
  </div>
</template>
