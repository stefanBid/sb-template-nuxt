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
    <div class="border-t border-border bg-surface sb-transition">
      <div
        class="max-w-350 mx-auto grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.8fr)]
               items-start px-6 md:px-10 py-10 md:py-12"
      >
        <!-- 1) Logo + descrizione -->
        <section class="space-y-4">
          <NuxtLink
            class="inline-flex items-center gap-2.5 sb-transition sb-focus rounded-sm hover:opacity-90"
            :to="props.quickLinks[0]?.path || '/'"
          >
            <span
              class="inline-flex items-center justify-center size-9 sm:size-10 rounded-sm
                       bg-surface-2 border border-border overflow-hidden shrink-0 sb-transition"
            >
              <img
                :alt="t('ui.logo-alt')"
                class="object-contain size-6 sm:size-7"
                fetchpriority="high"
                height="797"
                loading="eager"
                src="/logo.svg"
                width="682"
              />
            </span>
            <span class="sb-h3">
              Your Website
            </span>
          </NuxtLink>

          <p class="sb-small text-ink-muted max-w-md sb-transition">
            {{ t('footer.tagline') }}
          </p>
        </section>

        <!-- 2) Link veloci -->
        <section class="space-y-3.5">
          <h2 class="sb-overline text-primary sb-transition">
            {{ t('footer.route-section') }}
          </h2>

          <nav class="flex flex-col gap-2.5">
            <template v-if="props.quickLinks.length">
              <template v-for="link in props.quickLinks" :key="link.path">
                <NuxtLink
                  v-if="!link.disabled"
                  class="group w-fit inline-flex items-center gap-2 sb-small text-ink/70
                           hover:text-ink sb-transition sb-focus rounded-sm"
                  :to="link.path"
                >
                  <span
                    class="size-1 rounded-full bg-primary/0 group-hover:bg-primary
                             scale-0 group-hover:scale-100 sb-transition shrink-0"
                  ></span>
                  {{ link.name }}
                </NuxtLink>
                <span
                  v-else
                  class="inline-flex items-center gap-2 sb-small text-ink/40
                           cursor-not-allowed sb-transition"
                >
                  <span class="size-1 rounded-full bg-ink/20 shrink-0"></span>
                  {{ link.name }}
                </span>
              </template>
            </template>
            <p
              v-else
              class="sb-small text-ink-muted sb-transition"
            >
              {{ t('footer.route-fallback') }}
            </p>
          </nav>
        </section>

        <!-- 3) Contact + Social -->
        <section class="space-y-4">
          <h2 class="sb-overline text-primary sb-transition">
            {{ t('footer.contact-section') }}
          </h2>

          <div class="space-y-2.5">
            <span
              v-if="props.email"
              class="sb-small text-ink/85 sb-transition flex items-center gap-2.5"
            >
              <span
                class="inline-flex items-center justify-center size-8 rounded-sm
                         bg-surface-2 border border-border text-ink-muted shrink-0 sb-transition"
              >
                <Icon class="size-4" name="lucide:mail" />
              </span>
              <a
                class="underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary
                         sb-transition sb-focus rounded-sm"
                :href="`mailto:${props.email}`"
              >
                {{ props.email }}
              </a>
            </span>

            <span
              v-if="props.phone"
              class="sb-small text-ink/85 sb-transition flex items-center gap-2.5"
            >
              <span
                class="inline-flex items-center justify-center size-8 rounded-sm
                         bg-surface-2 border border-border text-ink-muted shrink-0 sb-transition"
              >
                <Icon class="size-4" name="lucide:phone" />
              </span>
              <a
                class="underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary
                         sb-transition sb-focus rounded-sm"
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
      <div class="border-t border-border bg-surface-2 px-6 md:px-10 py-4 sb-transition">
        <div
          class="max-w-350 mx-auto flex flex-col lg:flex-row items-center justify-between gap-2"
        >
          <!-- Left side: credit + made with -->
          <div class="flex flex-col flex-1 items-center lg:items-start gap-1 sb-small text-ink-muted text-center lg:text-left sb-transition">
            <p class=" sb-small">
              {{ t('footer.credit-section', { year: new Date().getFullYear() }) }}
            </p>

            <p class="text-ink-muted/80 sb-small">
              {{ t('footer.made-with') }}
            </p>
          </div>

          <!-- Right side: legal links -->
          <div class="flex flex-1 items-center justify-center lg:justify-end gap-3 sb-small text-ink-muted/80 text-center lg:text-right sb-transition">
            <!-- Privacy -->
            <NuxtLink
              class="hover:text-primary underline underline-offset-4 decoration-border hover:decoration-primary sb-focus rounded-sm w-fit sb-transition"
              :to="localePath('index')"
            >
              {{ t('nav.privacy-policy') }}
            </NuxtLink>

            <!-- Separator: filled dot instead of a pipe, consistent with the system's badge-dot motif -->
            <span class="size-1 rounded-full bg-ink-muted/40 select-none shrink-0"></span>

            <!-- Terms -->
            <NuxtLink
              class="hover:text-primary underline underline-offset-4 decoration-border hover:decoration-primary sb-focus rounded-sm w-fit sb-transition"
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
