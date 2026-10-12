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

const emit = defineEmits<{ (e: 'change-lang', langCode: string): void }>()

// Data
const open = useState('header-drawer-open', () => false)
const isMdUp = import.meta.client ? useMediaQuery('(min-width: 768px)') : ref(false)
const currentRoute = useRoute()
const getRouteBaseName = useRouteBaseName()
const appConfig = useAppConfig()
const { activeId } = useScrollSpy(() => props.routes.flatMap(r => r.sectionIds ?? []))

const isActiveRoute = (r: RouteItem) => {
  if (r.disabled) {
    return false
  }
  if (r.sectionIds?.length) {
    return activeId.value !== null && r.sectionIds.includes(activeId.value)
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
      class="fixed top-0 inset-x-0 h-16 border-b border-border backdrop-blur px-6 md:px-10 sb-transition"
      :class="{
        'bg-bg': open,
        'bg-bg/80 supports-backdrop-filter:bg-bg/60': !open,
      }"
    >
      <div class="h-full flex items-center max-w-350 mx-auto justify-between gap-4">
        <!-- Brand -->
        <NuxtLink
          class="inline-flex items-center gap-2.5 shrink-0 sb-focus sb-transition rounded-sm cursor-pointer group"
          :to="localePath('index')"
        >
          <span
            class="inline-flex items-center justify-center size-9 md:size-10 rounded-sm
                   bg-surface-2 border border-border overflow-hidden shrink-0 sb-transition"
          >
            <img
              alt=""
              aria-hidden="true"
              class="object-contain size-6 md:size-7"
              fetchpriority="high"
              height="797"
              loading="eager"
              src="/logo.svg"
              width="682"
            />
          </span>
          <span class="sb-h3 tracking-tight text-ink sb-transition">
            {{ appConfig.site.name }}
          </span>
        </NuxtLink>

        <!-- Desktop nav: underline indicator, not a generic pill -->
        <nav class="hidden md:flex items-center gap-1">
          <template v-for="r in routes" :key="r.path">
            <NuxtLink
              v-if="!r.disabled"
              :aria-current="isActiveRoute(r) ? 'location' : undefined"
              class="relative px-3 py-2 cursor-pointer sb-transition sb-focus rounded-sm"
              :class="isActiveRoute(r) ? 'text-primary' : 'text-ink-muted hover:text-ink'"
              :to="r.path"
            >
              {{ r.name }}
              <span
                aria-hidden="true"
                class="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary origin-left transition-transform duration-200"
                :class="isActiveRoute(r) ? 'scale-x-100' : 'scale-x-0'"
              ></span>
            </NuxtLink>
            <span
              v-else
              aria-disabled="true"
              class="px-3 py-2 sb-body-strong cursor-not-allowed opacity-40 text-ink-muted"
            >
              {{ r.name }}
            </span>
          </template>
        </nav>

        <!-- Desktop controls -->
        <div class="hidden md:flex items-center gap-1 p-1 rounded-sm border border-border bg-surface sb-transition">
          <ClientOnly>
            <TheThemeToggle />
            <template #fallback>
              <BaseIconButton
                :aria-label="t('ui.loading-theme')"
                icon="lucide:ellipsis"
              />
            </template>
          </ClientOnly>
          <span aria-hidden="true" class="w-px h-5 bg-border mx-0.5"></span>
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
        class="fixed inset-0 top-16 bg-bg/80 backdrop-blur-sm transition-opacity duration-200"
        :class="open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        @click.stop="onClose()"
      ></div>

      <aside
        id="mobile-drawer"
        :aria-modal="open ? 'true' : undefined"
        class="fixed left-0 top-16 h-[calc(100dvh-4rem)] w-72 max-w-[85vw] bg-surface border-r border-border shadow-lg transition-transform duration-300 will-change-transform flex flex-col"
        :class="open ? 'translate-x-0' : '-translate-x-full'"
        :inert="!open"
        :role="open ? 'dialog' : undefined"
      >
        <div class="px-6 py-4 border-b border-border">
          <span class="sb-overline text-ink-muted sb-transition">{{ t('header.route-section') }}</span>
        </div>

        <nav class="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
          <template v-for="r in routes" :key="r.path">
            <NuxtLink
              v-if="!r.disabled"
              :aria-current="isActiveRoute(r) ? 'location' : undefined"
              class="rounded-sm px-4 py-3 sb-body-strong cursor-pointer sb-transition sb-focus"
              :class="isActiveRoute(r)
                ? 'bg-primary text-on-primary font-bold!'
                : 'text-ink/80 hover:bg-surface-2'"
              :to="r.path"
              @click="onClose()"
            >
              {{ r.name }}
            </NuxtLink>
            <span
              v-else
              aria-disabled="true"
              class="rounded-sm px-4 py-3 sb-body-strong cursor-not-allowed opacity-40 text-ink/70"
            >
              {{ r.name }}
            </span>
          </template>
        </nav>

        <div class="px-6 py-3 border-t border-border">
          <span class="sb-overline text-ink-muted sb-transition">{{ t('header.settings-section') }}</span>
        </div>
        <div class="p-4 flex items-center gap-1 border-t border-border">
          <ClientOnly>
            <TheThemeToggle />
            <template #fallback>
              <BaseIconButton
                :aria-label="t('ui.loading-theme')"
                icon="lucide:ellipsis"
              />
            </template>
          </ClientOnly>
          <span aria-hidden="true" class="w-px h-5 bg-border mx-1"></span>
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
