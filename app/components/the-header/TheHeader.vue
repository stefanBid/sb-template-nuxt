<script setup lang="ts">
interface TheHeaderProps {
  routes: Array<RouteItem>
  langs: Array<MenuItem>
  selectedLangId?: string | null
}

// Dependencies
const { lock, unlock } = useLockScroll()
const { t } = useI18n()
const localePath = useLocalePath()

// Input / Output
const props = withDefaults(defineProps<TheHeaderProps>(), {
  selectedLangId: null,
})

// eslint-disable-next-line no-unused-vars
const emit = defineEmits<{ (e: 'change-lang', langCode: string): void }>()

// Data
const open = useState('header-drawer-open', () => false)
const isMdUp = import.meta.client ? useMediaQuery('(min-width: 768px)') : ref(false)
const currentRoute = useRoute()
const getRouteBaseName = useRouteBaseName()

const isActiveRoute = (r: RouteItem) => {
  if (r.disabled) {
    return false
  }
  if (!r.routeName) {
    return currentRoute.path === r.path
  }
  const baseName = String(getRouteBaseName(currentRoute) ?? '')
  return baseName === r.routeName || baseName.startsWith(`${r.routeName}-`)
}

const currentLang = computed(() =>
  props.langs.find(l => l.code === props.selectedLangId) ?? props.langs[0] ?? null,
)

// Events
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    onClose()
  }
}

const onToggle = (newOpenValue: boolean) => {
  open.value = newOpenValue
  if (open.value) {
    lock()
  }
  else {
    unlock()
  }
}

const onClose = () => {
  open.value = false
  unlock()
}

const onSelectLang = (langCode: string) => {
  emit('change-lang', langCode)
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
  }
  unlock()
})

watch(isMdUp, (newVal) => {
  if (newVal && open.value) {
    onClose()
  }
})
</script>

<template>
  <div class="relative z-50">
    <!-- HEADER BAR -->
    <header
      class="fixed top-0 inset-x-0 h-16 border-b border-app-border backdrop-blur px-6 md:px-10 u-app-soft-transition"
      :class="{
        'bg-app-main': open,
        'bg-app-main/80 supports-backdrop-filter:bg-app-main/60': !open,
      }"
    >
      <div class="h-full flex items-center max-w-350 mx-auto justify-between gap-4">
        <!-- Brand -->
        <NuxtLink
          class="inline-flex items-center gap-2.5 shrink-0 u-app-focus u-app-soft-transition rounded-sm cursor-pointer group"
          :to="localePath('index')"
        >
          <span
            class="inline-flex items-center justify-center size-9 md:size-10 rounded-sm
                   bg-app-surface-2 border border-app-border overflow-hidden shrink-0 u-app-soft-transition"
          >
            <NuxtImg
              alt="Logo"
              class="object-contain size-6 md:size-7"
              fetchpriority="high"
              loading="eager"
              src="/logo.webp"
            />
          </span>
          <span class="ty-app-h3 tracking-tight text-app-contrast normal-case! u-app-soft-transition">
            Your Website
          </span>
        </NuxtLink>

        <!-- Desktop nav: underline indicator, not a generic pill -->
        <nav class="hidden md:flex items-center gap-1">
          <template v-for="r in routes" :key="r.path">
            <NuxtLink
              v-if="!r.disabled"
              class="relative px-3 py-2 normal-case! font-medium! cursor-pointer u-app-soft-transition u-app-focus rounded-sm"
              :class="isActiveRoute(r) ? 'text-app-accent' : 'text-app-muted hover:text-app-contrast'"
              :to="r.path"
            >
              {{ r.name }}
              <span
                aria-hidden="true"
                class="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-app-accent origin-left transition-transform duration-200"
                :class="isActiveRoute(r) ? 'scale-x-100' : 'scale-x-0'"
              ></span>
            </NuxtLink>
            <span
              v-else
              class="px-3 py-2 ty-app-btn-label normal-case! font-medium! cursor-not-allowed opacity-40 text-app-muted"
            >
              {{ r.name }}
            </span>
          </template>
        </nav>

        <!-- Desktop controls -->
        <div class="hidden md:flex items-center gap-1 p-1 rounded-sm border border-app-border bg-app-surface u-app-soft-transition">
          <ClientOnly>
            <TheThemeToggle />
            <template #fallback>
              <BaseIconButton
                aria-label="Loading theme"
                icon="lucide:ellipsis"
              />
            </template>
          </ClientOnly>
          <span aria-hidden="true" class="w-px h-5 bg-app-border mx-0.5"></span>
          <BaseIconMenu
            v-if="currentLang"
            :aria-label="t('header.change-lang')"
            :icon="currentLang.icon"
            :items="langs"
            :selected-item-id="selectedLangId"
            @select="langCode => onSelectLang(langCode)"
          />
        </div>

        <!-- Mobile: hamburger -->
        <TheHeaderMenuToggle
          class="md:hidden"
          :open="open"
          @toggle="newOpenValue => onToggle(newOpenValue)"
        />
      </div>
    </header>

    <!-- OVERLAY + LATERAL DRAWER (below md) -->
    <div class="md:hidden">
      <div
        aria-hidden="true"
        class="fixed inset-0 top-16 bg-app-main/80 backdrop-blur-sm transition-opacity duration-200"
        :class="open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        @click.stop="onClose()"
      ></div>

      <aside
        id="mobile-drawer"
        :aria-modal="open ? 'true' : undefined"
        class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 max-w-[85vw] bg-app-surface border-r border-app-border shadow-[0_20px_60px_var(--color-app-shadow)] transition-transform duration-300 will-change-transform flex flex-col"
        :class="open ? 'translate-x-0' : '-translate-x-full'"
        :inert="!open"
        :role="open ? 'dialog' : undefined"
      >
        <div class="px-6 py-4 border-b border-app-border">
          <span class="ty-app-label text-app-muted u-app-soft-transition">{{ t('header.route-section') }}</span>
        </div>

        <nav class="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
          <template v-for="r in routes" :key="r.path">
            <NuxtLink
              v-if="!r.disabled"
              class="rounded-sm px-4 py-3 ty-app-btn-label normal-case! cursor-pointer u-app-soft-transition u-app-focus"
              :class="isActiveRoute(r)
                ? 'bg-app-accent text-white font-bold!'
                : 'text-app-contrast/80 font-medium! hover:bg-app-surface-2'"
              :to="r.path"
              @click="onClose()"
            >
              {{ r.name }}
            </NuxtLink>
            <span
              v-else
              class="rounded-sm px-4 py-3 ty-app-btn-label normal-case! font-medium! cursor-not-allowed opacity-40 text-app-contrast/70"
            >
              {{ r.name }}
            </span>
          </template>
        </nav>

        <div class="px-6 py-3 border-t border-app-border">
          <span class="ty-app-label text-app-muted u-app-soft-transition">{{ t('header.settings-section') }}</span>
        </div>
        <div class="p-4 flex items-center gap-1 border-t border-app-border">
          <ClientOnly>
            <TheThemeToggle />
            <template #fallback>
              <BaseIconButton
                aria-label="Loading theme"
                icon="lucide:ellipsis"
              />
            </template>
          </ClientOnly>
          <span aria-hidden="true" class="w-px h-5 bg-app-border mx-1"></span>
          <BaseIconMenu
            v-if="currentLang"
            :aria-label="t('header.change-lang')"
            :icon="currentLang.icon"
            :items="langs"
            :selected-item-id="selectedLangId"
            @select="langCode => onSelectLang(langCode)"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
