<script setup lang="ts">
// Dependencies
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

// Data
const isSmDialogOpen = ref(false)
const isMdDialogOpen = ref(false)
const isLgDialogOpen = ref(false)
const isFullDialogOpen = ref(false)

const githubRepoUrl = 'https://github.com/stefanBid/sb-template-nuxt'
const personalWebsiteUrl = 'https://stefanobiddau.com/'
const otherTemplatesUrl = 'https://stefanobiddau.com/my-projects/sb-templates'

const carouselItems = [
  { type: 'photo' as const, url: '/example.jpg', alternativeText: 'Example image 1' },
  { type: 'photo' as const, url: '/example.jpg', alternativeText: 'Example image 2' },
  { type: 'photo' as const, url: '/example.jpg', alternativeText: 'Example image 3' },
]

const richTextBlocks = computed<RichBlock[]>(() => [
  {
    type: 'heading',
    level: 3,
    children: [{ type: 'text', text: t('pages.home.components.rich-text-heading') }],
  },
  {
    type: 'paragraph',
    children: [{ type: 'text', text: t('pages.home.components.rich-text-intro') }],
  },
  {
    type: 'list',
    format: 'unordered',
    children: [
      {
        type: 'list-item',
        children: [{ type: 'text', text: t('pages.home.components.rich-text-list-item-1') }],
      },
      {
        type: 'list-item',
        children: [{ type: 'text', text: t('pages.home.components.rich-text-list-item-2') }],
      },
    ],
  },
])

const projectName = ref('')
const emailValue = ref('invalid@')
const descriptionValue = ref('')

const teamOptions = computed(() => [
  { label: t('pages.home.form.team.frontend'), value: 'frontend' },
  { label: t('pages.home.form.team.backend'), value: 'backend' },
  { label: t('pages.home.form.team.design'), value: 'design' },
])
const selectedTeam = ref('frontend')

const emailNotifications = ref(true)
const weeklyReport = ref(false)

const visibility = ref('private')

const acceptTerms = ref(true)
const newsletter = ref(false)

useSeoMeta({
  // LOCALIZED
  title: () => t('meta.home.title'),
  description: () => t('meta.home.description'),
  ogTitle: () => t('meta.home.title'),
  ogDescription: () => t('meta.home.description'),
  twitterTitle: () => t('meta.home.title'),
  twitterDescription: () => t('meta.home.description'),

  // DYNAMIC BUT NOT TIED TO CONTENT LANGUAGE
  ogUrl: () => `${config.public.siteUrl}${route.fullPath}`,
})
</script>

<template>
  <div class="py-10 md:py-14">
    <!-- Hero -->
    <section class="pb-16 md:pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <BaseBadge dot :text="t('pages.home.hero.badge')" variant="accent" />
          <h1 class="ty-app-h1 text-app-contrast mt-4">
            {{ t('pages.home.hero.title') }}
          </h1>
          <p class="ty-app-p text-app-muted mt-4 max-w-xl">
            {{ t('pages.home.hero.lead') }}
          </p>
          <div class="flex flex-wrap gap-3 mt-7">
            <BaseButton size="lg" variant="primary">
              {{ t('pages.home.hero.cta-primary') }}
            </BaseButton>
            <BaseButton
              size="lg"
              :to="githubRepoUrl"
              type="link"
              variant="outline"
            >
              {{ t('pages.home.hero.cta-secondary') }}
            </BaseButton>
          </div>
        </div>

        <!-- Token panel: mirrors the hero token-panel from the Fern UI preview -->
        <div class="rounded-lg border border-app-border bg-app-surface p-6 md:p-7 shadow-[0_20px_44px_-18px_var(--color-app-shadow),0_2px_8px_var(--color-app-shadow)]">
          <div class="flex items-center justify-between mb-4">
            <div aria-hidden="true" class="flex gap-1.5">
              <span class="size-2 rounded-full bg-app-border"></span>
              <span class="size-2 rounded-full bg-app-border"></span>
              <span class="size-2 rounded-full bg-app-border"></span>
            </div>
            <code class="ty-app-caption text-app-accent not-italic">{{ t('pages.home.hero.panel-filename') }}</code>
          </div>

          <div class="grid grid-cols-6 gap-2 mb-4">
            <div class="aspect-square rounded-sm border border-app-border" style="background: var(--color-app-accent)"></div>
            <div class="aspect-square rounded-sm border border-app-border" style="background: var(--color-app-accent-hover)"></div>
            <div class="aspect-square rounded-sm border border-app-border" style="background: var(--color-app-success)"></div>
            <div class="aspect-square rounded-sm border border-app-border" style="background: var(--color-app-warning)"></div>
            <div class="aspect-square rounded-sm border border-app-border" style="background: var(--color-app-error)"></div>
            <div class="aspect-square rounded-sm border border-app-border" style="background: var(--color-app-info)"></div>
          </div>

          <div class="flex items-center justify-between py-2 border-t border-app-border ty-app-caption not-italic text-app-muted">
            <span class="flex items-center gap-2">
              <span aria-hidden="true" class="size-2.5 rounded-xs shrink-0" style="background: var(--color-app-accent)"></span>
              {{ t('pages.home.hero.token-lines.accent') }}
            </span>
            <span class="text-app-contrast font-medium">#009F5D</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-app-border ty-app-caption not-italic text-app-muted">
            <span>{{ t('pages.home.hero.token-lines.font-primary') }}</span>
            <span class="text-app-contrast font-medium">Poppins</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-app-border ty-app-caption not-italic text-app-muted">
            <span>{{ t('pages.home.hero.token-lines.font-secondary') }}</span>
            <span class="text-app-contrast font-medium">Inter</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-app-border ty-app-caption not-italic text-app-muted">
            <span>{{ t('pages.home.hero.token-lines.scale-ratio') }}</span>
            <span class="text-app-contrast font-medium">1.25</span>
          </div>
        </div>
      </div>
    </section>

    <!-- i18n -->
    <section class="py-16 md:py-20 border-t border-app-border">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.i18n.eyebrow') }}</span>
          <h2 class="ty-app-h2 text-app-contrast">
            {{ t('pages.home.i18n.heading') }}
          </h2>
          <p class="ty-app-p text-app-muted mt-3">
            {{ t('pages.home.i18n.description') }}
          </p>
          <p class="ty-app-label normal-case! text-app-muted mt-4 flex items-center gap-2">
            <Icon class="size-4 text-app-accent shrink-0" name="lucide:languages" />
            {{ t('pages.home.i18n.hint') }}
          </p>
        </div>

        <div class="rounded-lg border border-app-border bg-app-surface p-6 md:p-7 shadow-[0_20px_44px_-18px_var(--color-app-shadow),0_2px_8px_var(--color-app-shadow)]">
          <div class="flex items-center justify-between mb-4">
            <div aria-hidden="true" class="flex gap-1.5">
              <span class="size-2 rounded-full bg-app-border"></span>
              <span class="size-2 rounded-full bg-app-border"></span>
              <span class="size-2 rounded-full bg-app-border"></span>
            </div>
            <code class="ty-app-caption text-app-accent not-italic">{{ t('pages.home.i18n.panel-filename') }}</code>
          </div>

          <div class="flex items-center justify-between py-2 ty-app-caption not-italic text-app-muted">
            <span>{{ t('pages.home.i18n.locale-label') }}</span>
            <BaseBadge dot :text="locale" variant="accent" />
          </div>
          <div class="flex items-center justify-between py-2 border-t border-app-border ty-app-caption not-italic text-app-muted">
            <span>{{ t('pages.home.i18n.strategy-label') }}</span>
            <span class="text-app-contrast font-medium">{{ t('pages.home.i18n.strategy-value') }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-app-border ty-app-caption not-italic text-app-muted">
            <span>{{ t('pages.home.i18n.files-label') }}</span>
            <span class="text-app-contrast font-medium">{{ t('pages.home.i18n.files-value') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Buttons -->
    <section id="buttons" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.buttons.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.buttons.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.buttons.description') }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 mb-4">
        <BaseButton variant="primary">
          {{ t('pages.home.buttons.save') }}
        </BaseButton>
        <BaseButton variant="outline">
          {{ t('pages.home.buttons.cancel') }}
        </BaseButton>
        <BaseButton variant="ghost">
          {{ t('pages.home.buttons.learn-more') }}
        </BaseButton>
        <BaseButton variant="danger">
          {{ t('pages.home.buttons.delete-account') }}
        </BaseButton>
        <BaseButton :is-disabled="true" variant="primary">
          {{ t('pages.home.buttons.unavailable') }}
        </BaseButton>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <BaseButton size="sm" variant="primary">
          {{ t('pages.home.buttons.small') }}
        </BaseButton>
        <BaseButton size="md" variant="primary">
          {{ t('pages.home.buttons.medium') }}
        </BaseButton>
        <BaseButton size="lg" variant="primary">
          {{ t('pages.home.buttons.large') }}
        </BaseButton>
      </div>
    </section>

    <!-- Badges & Chips -->
    <section id="badges" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.badges.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.badges.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.badges.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p class="ty-app-label text-app-muted mb-3">
            {{ t('pages.home.badges.badges-label') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <BaseBadge dot :text="t('pages.home.badges.in-progress')" variant="accent" />
            <BaseBadge :text="t('pages.home.badges.completed')" variant="success" />
            <BaseBadge :text="t('pages.home.badges.pending')" variant="warning" />
            <BaseBadge :text="t('pages.home.badges.failed')" variant="error" />
            <BaseBadge :text="t('pages.home.badges.new')" variant="info" />
            <BaseBadge :text="t('pages.home.badges.draft')" variant="outline" />
          </div>
        </div>

        <div>
          <p class="ty-app-label text-app-muted mb-3">
            {{ t('pages.home.badges.chips-label') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <BaseChip :text="t('pages.home.badges.all')" variant="primary" />
            <BaseChip :text="t('pages.home.badges.frontend')" variant="secondary" />
            <BaseChip :text="t('pages.home.badges.backend')" variant="secondary" />
            <BaseChip icon="lucide:x" :text="t('pages.home.badges.design')" variant="secondary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section id="cards" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.cards.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.cards.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.cards.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr] gap-5">
        <!-- Feature card -->
        <BaseCard :full-custom-content="true" variant="dark">
          <div class="flex flex-col justify-between h-full">
            <div>
              <div class="size-11 rounded-sm bg-app-accent text-white flex items-center justify-center ty-app-h3 font-bold mb-4">
                01
              </div>
              <h3 class="ty-app-h3 text-app-contrast">
                {{ t('pages.home.cards.feature.title') }}
              </h3>
              <p class="ty-app-p text-app-muted mt-2">
                {{ t('pages.home.cards.feature.paragraph') }}
              </p>
            </div>
            <BaseButton class="self-start mt-5" size="sm" variant="outline">
              {{ t('pages.home.cards.feature.button') }}
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Stat card -->
        <BaseCard :full-custom-content="true" variant="light">
          <p class="ty-app-label text-app-muted">
            {{ t('pages.home.cards.stat.label') }}
          </p>
          <p class="ty-app-h2 text-app-contrast mt-1">
            128
          </p>
          <p class="ty-app-label normal-case! font-semibold! text-app-success">
            {{ t('pages.home.cards.stat.delta') }}
          </p>
        </BaseCard>

        <!-- List card -->
        <BaseCard :full-custom-content="true" variant="light">
          <p class="ty-app-label text-app-muted mb-3">
            {{ t('pages.home.cards.list.label') }}
          </p>
          <div class="flex flex-col divide-y divide-app-border">
            <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span class="flex items-center gap-2.5 ty-app-p text-app-contrast">
                <span class="size-7 rounded-full bg-app-surface-2 flex items-center justify-center ty-app-label normal-case! text-app-muted shrink-0">Bt</span>
                {{ t('pages.home.cards.list.button.name') }}
              </span>
              <BaseBadge :text="t('pages.home.cards.list.button.status')" variant="success" />
            </div>
            <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span class="flex items-center gap-2.5 ty-app-p text-app-contrast">
                <span class="size-7 rounded-full bg-app-surface-2 flex items-center justify-center ty-app-label normal-case! text-app-muted shrink-0">Dg</span>
                {{ t('pages.home.cards.list.dialog.name') }}
              </span>
              <BaseBadge :text="t('pages.home.cards.list.dialog.status')" variant="success" />
            </div>
            <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span class="flex items-center gap-2.5 ty-app-p text-app-contrast">
                <span class="size-7 rounded-full bg-app-surface-2 flex items-center justify-center ty-app-label normal-case! text-app-muted shrink-0">Ac</span>
                {{ t('pages.home.cards.list.accordion.name') }}
              </span>
              <BaseBadge :text="t('pages.home.cards.list.accordion.status')" variant="warning" />
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Accordion -->
    <section id="accordion" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.accordion.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.accordion.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.accordion.description') }}
        </p>
      </div>

      <div class="max-w-3xl space-y-3">
        <BaseAccordion
          id="accordion-theme-colors"
          :is-open="true"
          :title="t('pages.home.accordion.items.theme-colors.title')"
        >
          <p class="ty-app-p">
            {{ t('pages.home.accordion.items.theme-colors.content') }}
          </p>
        </BaseAccordion>

        <BaseAccordion
          id="accordion-nuxt-compat"
          :title="t('pages.home.accordion.items.nuxt-compat.title')"
        >
          <p class="ty-app-p">
            {{ t('pages.home.accordion.items.nuxt-compat.content') }}
          </p>
        </BaseAccordion>

        <BaseAccordion
          id="accordion-dark-mode"
          :title="t('pages.home.accordion.items.dark-mode.title')"
        >
          <p class="ty-app-p">
            {{ t('pages.home.accordion.items.dark-mode.content') }}
          </p>
        </BaseAccordion>
      </div>
    </section>

    <!-- Form -->
    <section id="form" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.form.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.form.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.form.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl">
        <div class="space-y-6">
          <BaseInput
            id="form-project-name"
            v-model:input="projectName"
            :label="t('pages.home.form.project-name.label')"
            :placeholder="t('pages.home.form.project-name.placeholder')"
            type="text"
          />

          <BaseInput
            id="form-email"
            v-model:input="emailValue"
            :error="t('pages.home.form.email.error')"
            :label="t('pages.home.form.email.label')"
            type="email"
          />

          <BaseTextarea
            id="form-description"
            v-model:input="descriptionValue"
            :label="t('pages.home.form.description-field.label')"
            :placeholder="t('pages.home.form.description-field.placeholder')"
          />

          <BaseSelect
            id="form-team"
            v-model:input="selectedTeam"
            :label="t('pages.home.form.team.label')"
            :options="teamOptions"
          />
        </div>

        <div class="space-y-6">
          <div>
            <p class="ty-app-label text-app-muted mb-3">
              {{ t('pages.home.form.notifications-title') }}
            </p>
            <div class="space-y-3">
              <BaseSwitch
                id="form-email-notifications"
                v-model:input="emailNotifications"
                :label="t('pages.home.form.email-notifications')"
              />
              <BaseSwitch
                id="form-weekly-report"
                v-model:input="weeklyReport"
                :label="t('pages.home.form.weekly-report')"
              />
            </div>
          </div>

          <div>
            <p class="ty-app-label text-app-muted mb-3">
              {{ t('pages.home.form.visibility-title') }}
            </p>
            <div class="space-y-2.5">
              <BaseRadio
                id="form-visibility-private"
                v-model:input="visibility"
                :label="t('pages.home.form.visibility-private')"
                name="visibility"
                value="private"
              />
              <BaseRadio
                id="form-visibility-team"
                v-model:input="visibility"
                :label="t('pages.home.form.visibility-team')"
                name="visibility"
                value="team"
              />
              <BaseRadio
                id="form-visibility-public"
                v-model:input="visibility"
                :label="t('pages.home.form.visibility-public')"
                name="visibility"
                value="public"
              />
            </div>
          </div>

          <div>
            <p class="ty-app-label text-app-muted mb-3">
              {{ t('pages.home.form.preferences-title') }}
            </p>
            <div class="space-y-2.5">
              <BaseCheckbox
                id="form-accept-terms"
                v-model:input="acceptTerms"
                :label="t('pages.home.form.accept-terms')"
              />
              <BaseCheckbox
                id="form-newsletter"
                v-model:input="newsletter"
                :label="t('pages.home.form.subscribe-newsletter')"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dialog -->
    <section id="dialog" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.dialog.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.dialog.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.dialog.description') }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <BaseButton size="sm" variant="outline" @click="isSmDialogOpen = true">
          {{ t('pages.home.dialog.sm.trigger') }}
        </BaseButton>
        <BaseButton size="md" variant="outline" @click="isMdDialogOpen = true">
          {{ t('pages.home.dialog.md.trigger') }}
        </BaseButton>
        <BaseButton size="lg" variant="outline" @click="isLgDialogOpen = true">
          {{ t('pages.home.dialog.lg.trigger') }}
        </BaseButton>
        <BaseButton size="lg" variant="outline" @click="isFullDialogOpen = true">
          {{ t('pages.home.dialog.full.trigger') }}
        </BaseButton>
      </div>
    </section>

    <!-- Small: destructive confirmation -->
    <BaseDialog
      :is-open="isSmDialogOpen"
      size="sm"
      :title="t('pages.home.dialog.sm.title')"
      @close="isSmDialogOpen = false"
    >
      <p class="ty-app-p">
        {{ t('pages.home.dialog.sm.content') }}
      </p>
      <template #footer>
        <BaseButton size="sm" variant="ghost" @click="isSmDialogOpen = false">
          {{ t('pages.home.dialog.cancel-button') }}
        </BaseButton>
        <BaseButton size="sm" variant="danger" @click="isSmDialogOpen = false">
          {{ t('pages.home.dialog.sm.confirm-button') }}
        </BaseButton>
      </template>
    </BaseDialog>

    <!-- Medium: invite form-style content -->
    <BaseDialog
      :is-open="isMdDialogOpen"
      size="md"
      :subtitle="t('pages.home.dialog.md.subtitle')"
      :title="t('pages.home.dialog.md.title')"
      @close="isMdDialogOpen = false"
    >
      <p class="ty-app-p">
        {{ t('pages.home.dialog.md.content') }}
      </p>
      <template #footer>
        <BaseButton variant="ghost" @click="isMdDialogOpen = false">
          {{ t('pages.home.dialog.cancel-button') }}
        </BaseButton>
        <BaseButton variant="primary" @click="isMdDialogOpen = false">
          {{ t('pages.home.dialog.md.confirm-button') }}
        </BaseButton>
      </template>
    </BaseDialog>

    <!-- Large: release notes -->
    <BaseDialog
      :is-open="isLgDialogOpen"
      size="lg"
      :subtitle="t('pages.home.dialog.lg.subtitle')"
      :title="t('pages.home.dialog.lg.title')"
      @close="isLgDialogOpen = false"
    >
      <p class="ty-app-p">
        {{ t('pages.home.dialog.lg.content') }}
      </p>
      <template #footer>
        <BaseButton size="lg" variant="primary" @click="isLgDialogOpen = false">
          {{ t('pages.home.dialog.lg.confirm-button') }}
        </BaseButton>
      </template>
    </BaseDialog>

    <!-- Full: long-form content -->
    <BaseDialog
      :is-open="isFullDialogOpen"
      size="full"
      :subtitle="t('pages.home.dialog.full.subtitle')"
      :title="t('pages.home.dialog.full.title')"
      @close="isFullDialogOpen = false"
    >
      <p class="ty-app-p">
        {{ t('pages.home.dialog.full.content') }}
      </p>
      <template #footer>
        <BaseButton size="lg" variant="ghost" @click="isFullDialogOpen = false">
          {{ t('pages.home.dialog.cancel-button') }}
        </BaseButton>
        <BaseButton size="lg" variant="primary" @click="isFullDialogOpen = false">
          {{ t('pages.home.dialog.full.confirm-button') }}
        </BaseButton>
      </template>
    </BaseDialog>

    <!-- Complex components -->
    <section id="components" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.components.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.components.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.components.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <p class="ty-app-label text-app-muted mb-3">
            {{ t('pages.home.components.carousel-label') }}
          </p>
          <BaseMediaCarousel :items="carouselItems" />
        </div>

        <div>
          <p class="ty-app-label text-app-muted mb-3">
            {{ t('pages.home.components.rich-text-label') }}
          </p>
          <div class="rounded-md border border-app-border bg-app-surface p-5 md:p-6">
            <BaseRichText :blocks="richTextBlocks" />
          </div>
        </div>
      </div>
    </section>

    <!-- Responsive -->
    <section id="responsive" class="py-16 md:py-20 border-t border-app-border scroll-mt-24">
      <div class="max-w-2xl mb-8">
        <span class="ty-app-label text-app-accent block mb-2">{{ t('pages.home.responsive.eyebrow') }}</span>
        <h2 class="ty-app-h2 text-app-contrast">
          {{ t('pages.home.responsive.heading') }}
        </h2>
        <p class="ty-app-p text-app-muted mt-2">
          {{ t('pages.home.responsive.description') }}
        </p>
      </div>

      <!-- Device frames: purely decorative mockups proving the same tokens scale down, not real breakpoints -->
      <div aria-hidden="true" class="flex flex-wrap items-end gap-6 mb-10">
        <div class="flex flex-col items-center gap-2">
          <div class="w-20 h-36 rounded-md border-2 border-app-border bg-app-surface p-1.5 flex flex-col gap-1">
            <div class="h-2 rounded-full bg-app-accent w-1/2"></div>
            <div class="flex-1 rounded-sm bg-app-surface-2"></div>
            <div class="h-1.5 rounded-full bg-app-border"></div>
            <div class="h-1.5 rounded-full bg-app-border w-2/3"></div>
          </div>
          <span class="ty-app-label text-app-muted">{{ t('pages.home.responsive.mobile-label') }}</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <div class="w-36 h-28 rounded-md border-2 border-app-border bg-app-surface p-2 flex flex-col gap-1.5">
            <div class="h-2 rounded-full bg-app-accent w-1/3"></div>
            <div class="flex-1 grid grid-cols-2 gap-1.5">
              <div class="rounded-sm bg-app-surface-2"></div>
              <div class="rounded-sm bg-app-surface-2"></div>
            </div>
          </div>
          <span class="ty-app-label text-app-muted">{{ t('pages.home.responsive.tablet-label') }}</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <div class="w-56 h-32 rounded-md border-2 border-app-border bg-app-surface p-2.5 flex flex-col gap-2">
            <div class="h-2 rounded-full bg-app-accent w-1/4"></div>
            <div class="flex-1 grid grid-cols-3 gap-2">
              <div class="rounded-sm bg-app-surface-2"></div>
              <div class="rounded-sm bg-app-surface-2"></div>
              <div class="rounded-sm bg-app-surface-2"></div>
            </div>
          </div>
          <span class="ty-app-label text-app-muted">{{ t('pages.home.responsive.desktop-label') }}</span>
        </div>
      </div>

      <div class="rounded-lg border border-app-border bg-app-surface-2 p-6 md:p-8">
        <h3 class="ty-app-h4 text-app-contrast mb-4">
          {{ t('pages.home.responsive.links-heading') }}
        </h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton :to="githubRepoUrl" type="link" variant="primary">
            <Icon class="size-4.5 mr-2" name="lucide:github" />
            {{ t('pages.home.responsive.github-link') }}
          </BaseButton>
          <BaseButton :to="personalWebsiteUrl" type="link" variant="outline">
            <Icon class="size-4.5 mr-2" name="lucide:user" />
            {{ t('pages.home.responsive.website-link') }}
          </BaseButton>
          <BaseButton :to="otherTemplatesUrl" type="link" variant="outline">
            <Icon class="size-4.5 mr-2" name="lucide:layout-template" />
            {{ t('pages.home.responsive.templates-link') }}
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
