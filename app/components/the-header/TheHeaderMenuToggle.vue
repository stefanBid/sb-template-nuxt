<script setup lang="ts">
interface TheHeaderMenuToggleProps {
  open: boolean
}
// Dependencies
const { t } = useI18n()

// Input / Output
const props = defineProps<TheHeaderMenuToggleProps>()
const emit = defineEmits<{
  (e: 'toggle', newOpenValue: boolean): void
}>()

const onToggle = () => emit('toggle', !props.open)
</script>

<template>
  <button
    aria-controls="mobile-drawer"
    :aria-expanded="open ? 'true' : 'false'"
    :aria-label="open ? t('header.close-menu') : t('header.open-menu')"
    class="inline-flex group items-center rounded-sm p-1 sb-focus cursor-pointer"
    @click="onToggle()"
  >
    <svg
      aria-hidden="true"
      class="size-7"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >

      <line
        class="origin-[12px_12px] transition-[translate,rotate,opacity] duration-(--sb-duration-base) ease-standard"
        :class="open ? 'rotate-45' : '-translate-y-[5px]'"
        x1="4"
        x2="20"
        y1="12"
        y2="12"
      />
      <line
        class="origin-[12px_12px] transition-[translate,rotate,opacity] duration-(--sb-duration-base) ease-standard"
        :class="open ? 'opacity-0' : 'opacity-100'"
        x1="4"
        x2="20"
        y1="12"
        y2="12"
      />
      <line
        class="origin-[12px_12px] transition-[translate,rotate,opacity] duration-(--sb-duration-base) ease-standard"
        :class="open ? '-rotate-45' : 'translate-y-[5px]'"
        x1="4"
        x2="20"
        y1="12"
        y2="12"
      />
    </svg>
  </button>
</template>
