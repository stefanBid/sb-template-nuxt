<script setup lang="ts">
interface TheFooterProps {
  quickLinks?: Array<RouteItem>
  phone?: string
  email?: string
  githubUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
}

// Dependencies
const { t } = useI18n()
const localePath = useLocalePath()

// Input / Output
const props = withDefaults(defineProps<TheFooterProps>(), {
  quickLinks: () => [],
  phone: undefined,
  email: undefined,
  githubUrl: undefined,
  linkedinUrl: undefined,
  instagramUrl: undefined,
})
</script>

<template>
  <footer class="mt-16">
    <!--
      Footer spans full viewport width like the header bar — border-t as the
      only divider, no side inset — while its content stays readable via the
      same max-w-350 constraint used by the header and page content. The
      legal bar stays inside the same block but switches to surface-2,
      marking a second hierarchy tier without a second border.
    -->
    <div class="border-t border-app-border bg-app-surface u-app-soft-transition">
      <div
        class="max-w-350 mx-auto grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.8fr)]
               items-start px-6 md:px-10 py-10 md:py-12"
      >
        <!-- 1) Logo + descrizione -->
        <section class="space-y-4">
          <NuxtLink
            class="inline-flex items-center gap-2.5 u-app-soft-transition u-app-focus rounded-sm hover:opacity-90"
            :to="props.quickLinks[0]?.path || '/'"
          >
            <span
              class="inline-flex items-center justify-center size-9 sm:size-10 rounded-sm
                       bg-app-surface-2 border border-app-border overflow-hidden shrink-0 u-app-soft-transition"
            >
              <NuxtImg
                alt="Logo"
                class="object-contain size-6 sm:size-7"
                fetchpriority="high"
                loading="eager"
                src="/logo.webp"
              />
            </span>
            <span class="ty-app-h3">
              Your Website
            </span>
          </NuxtLink>

          <p class="ty-app-label normal-case! text-app-muted max-w-md u-app-soft-transition">
            {{ t('footer.tagline') }}
          </p>
        </section>

        <!-- 2) Link veloci -->
        <section class="space-y-3.5">
          <h2 class="ty-app-label text-app-accent tracking-normal u-app-soft-transition">
            {{ t('footer.route-section') }}
          </h2>

          <nav class="flex flex-col gap-2.5">
            <template v-if="props.quickLinks.length">
              <template v-for="link in props.quickLinks" :key="link.path">
                <NuxtLink
                  v-if="!link.disabled"
                  class="group w-fit inline-flex items-center gap-2 ty-app-label normal-case! text-app-contrast/70
                           hover:text-app-contrast u-app-soft-transition u-app-focus rounded-sm"
                  :to="link.path"
                >
                  <span
                    class="size-1 rounded-full bg-app-accent/0 group-hover:bg-app-accent
                             scale-0 group-hover:scale-100 u-app-soft-transition shrink-0"
                  ></span>
                  {{ link.name }}
                </NuxtLink>
                <span
                  v-else
                  class="inline-flex items-center gap-2 ty-app-label normal-case! text-app-contrast/40
                           cursor-not-allowed u-app-soft-transition"
                >
                  <span class="size-1 rounded-full bg-app-contrast/20 shrink-0"></span>
                  {{ link.name }}
                </span>
              </template>
            </template>
            <p
              v-else
              class="ty-app-caption text-app-muted/70 u-app-soft-transition"
            >
              {{ t('footer.route-fallback') }}
            </p>
          </nav>
        </section>

        <!-- 3) Contact + Social -->
        <section class="space-y-4">
          <h2 class="ty-app-label text-app-accent tracking-normal u-app-soft-transition">
            {{ t('footer.contact-section') }}
          </h2>

          <div class="space-y-2.5">
            <span
              v-if="props.email"
              class="ty-app-label normal-case! text-app-contrast/85 u-app-soft-transition flex items-center gap-2.5"
            >
              <span
                class="inline-flex items-center justify-center size-8 rounded-sm
                         bg-app-surface-2 border border-app-border text-app-muted shrink-0 u-app-soft-transition"
              >
                <Icon class="size-4" name="lucide:mail" />
              </span>
              <a
                class="underline underline-offset-4 decoration-app-border hover:text-app-accent hover:decoration-app-accent
                         u-app-soft-transition u-app-focus rounded-sm"
                :href="`mailto:${props.email}`"
              >
                {{ props.email }}
              </a>
            </span>

            <span
              v-if="props.phone"
              class="ty-app-label normal-case! text-app-contrast/85 u-app-soft-transition flex items-center gap-2.5"
            >
              <span
                class="inline-flex items-center justify-center size-8 rounded-sm
                         bg-app-surface-2 border border-app-border text-app-muted shrink-0 u-app-soft-transition"
              >
                <Icon class="size-4" name="lucide:phone" />
              </span>
              <a
                class="underline underline-offset-4 decoration-app-border hover:text-app-accent hover:decoration-app-accent
                         u-app-soft-transition u-app-focus rounded-sm"
                :href="`tel:${props.phone}`"
              >
                {{ props.phone }}
              </a>
            </span>
          </div>

          <!-- Social badges -->
          <div class="flex flex-wrap items-center gap-2.5 mt-2">
            <BaseChip
              v-if="props.githubUrl"
              icon="lucide:github"
              :linkable="{
                href: props.githubUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              }"
              text="GitHub"
              variant="secondary"
            />

            <BaseChip
              v-if="props.linkedinUrl"
              icon="lucide:linkedin"
              :linkable="{
                href: props.linkedinUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              }"
              text="LinkedIn"
              variant="secondary"
            />

            <BaseChip
              v-if="props.instagramUrl"
              icon="lucide:instagram"
              :linkable="{
                href: props.instagramUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              }"
              text="Instagram"
              variant="secondary"
            />
          </div>
        </section>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-app-border bg-app-surface-2 px-6 md:px-10 py-4 u-app-soft-transition">
        <div
          class="max-w-350 mx-auto flex flex-col lg:flex-row items-center justify-between gap-2"
        >
          <!-- Left side: credit + made with -->
          <div class="flex flex-col flex-1 items-center lg:items-start gap-1 ty-app-caption text-app-muted text-center lg:text-left u-app-soft-transition">
            <p class=" ty-app-small">
              {{ t('footer.credit-section', { year: new Date().getFullYear() }) }}
            </p>

            <p class="text-app-muted/80 ty-app-small">
              {{ t('footer.made-with') }}
            </p>
          </div>

          <!-- Right side: legal links -->
          <div class="flex flex-1 items-center justify-center lg:justify-end gap-3 ty-app-caption text-app-muted/80 not-italic text-center lg:text-right u-app-soft-transition">
            <!-- Privacy -->
            <NuxtLink
              class="hover:text-app-accent underline underline-offset-4 decoration-app-border hover:decoration-app-accent u-app-focus rounded-sm w-fit u-app-soft-transition"
              :to="localePath('index')"
            >
              {{ t('nav.privacy-policy') }}
            </NuxtLink>

            <!-- Separator: filled dot instead of a pipe, consistent with the system's badge-dot motif -->
            <span class="size-1 rounded-full bg-app-muted/40 select-none shrink-0"></span>

            <!-- Terms -->
            <NuxtLink
              class="hover:text-app-accent underline underline-offset-4 decoration-app-border hover:decoration-app-accent u-app-focus rounded-sm w-fit u-app-soft-transition"
              :to="localePath('index')"
            >
              {{ t('nav.terms-and-conditions') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
