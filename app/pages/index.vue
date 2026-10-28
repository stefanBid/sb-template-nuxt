<script setup lang="ts">
definePageMeta({
  sitemap: { lastmod: '2025-11-24', changefreq: 'monthly', priority: 1.0 },
})

// Dependencies
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const localePath = useLocalePath()

// Data
const isSmDialogOpen = ref(false)
const isMdDialogOpen = ref(false)
const isLgDialogOpen = ref(false)
const isFullDialogOpen = ref(false)

const githubRepoUrl = 'https://github.com/stefanBid/sb-template-nuxt'
const personalWebsiteUrl = 'https://stefanobiddau.com/'
const otherTemplatesUrl = 'https://stefanobiddau.com/my-projects/sb-templates'

const carouselItems = computed(() => ['road', 'forest', 'mist'].map((name, index) => ({
  type: 'photo' as const,
  url: `/example-${name}.jpg`,
  alternativeText: t('pages.home.components.carousel-alt', { n: index + 1 }),
})))

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

// Reads the live tokens so the hero panel never drifts from theme.css and typography.css
const colorMode = useColorMode()
const tokenValues = reactive({
  primary: '',
  fontDisplay: '',
  fontBody: '',
  textBody: '',
})

const _readFamily = (value: string): string => value.split(',')[0]?.replace(/["']/g, '').trim() ?? ''

const _readTokens = () => {
  const styles = getComputedStyle(document.documentElement)
  tokenValues.primary = styles.getPropertyValue('--sb-primary').trim().toUpperCase()
  tokenValues.fontDisplay = _readFamily(styles.getPropertyValue('--font-display'))
  tokenValues.fontBody = _readFamily(styles.getPropertyValue('--font-body'))
  tokenValues.textBody = styles.getPropertyValue('--text-body').trim()
}

const specimenRoles = [
  { className: 'sb-display' },
  { className: 'sb-h1' },
  { className: 'sb-h2' },
  { className: 'sb-h3' },
  { className: 'sb-h4' },
  { className: 'sb-body' },
  { className: 'sb-small' },
]

const projectName = ref('')
const emailValue = ref('')
const emailError = computed(() => {
  const isInvalid = emailValue.value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.value)
  return isInvalid ? t('pages.home.form.email.error') : null
})
const descriptionValue = ref('')

const teamOptions = computed(() => [
  { label: t('pages.home.form.team.frontend'), value: 'frontend' },
  { label: t('pages.home.form.team.backend'), value: 'backend' },
  { label: t('pages.home.form.team.design'), value: 'design' },
])
const selectedTeam = ref('frontend')
const primaryTeam = ref<string[]>([])
const collaboratingTeams = ref<string[]>(['design'])

const emailNotifications = ref(true)
const weeklyReport = ref(false)

const visibility = ref('private')

const acceptTerms = ref(true)
const newsletter = ref(false)

onMounted(_readTokens)
watch(() => colorMode.value, () => nextTick(_readTokens))

// Events
const onExploreComponents = () => {
  navigateTo(`${localePath('index')}#cards`)
}

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
    <section class="pb-20 md:pb-28">
      <BaseBadge dot :text="t('pages.home.hero.badge')" variant="accent" />
      <h1 class="sb-display text-ink text-balance mt-5 max-w-4xl">
        {{ t('pages.home.hero.title') }}
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start mt-10 md:mt-14">
        <div>
          <p class="sb-lead text-ink-muted max-w-xl">
            {{ t('pages.home.hero.lead') }}
          </p>
          <div class="flex flex-wrap gap-3 mt-8">
            <BaseButton
              size="lg"
              variant="primary"
              @click="onExploreComponents"
            >
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

        <!-- Token panel: shows the design-system tokens -->
        <BaseWindowPanel :filename="t('pages.home.hero.panel-filename')">
          <div class="grid grid-cols-6 gap-2 mb-4">
            <div class="aspect-square rounded-sm border border-border bg-primary"></div>
            <div class="aspect-square rounded-sm border border-border bg-primary-hover"></div>
            <div class="aspect-square rounded-sm border border-border bg-success"></div>
            <div class="aspect-square rounded-sm border border-border bg-warning"></div>
            <div class="aspect-square rounded-sm border border-border bg-error"></div>
            <div class="aspect-square rounded-sm border border-border bg-info"></div>
          </div>

          <div class="flex items-center justify-between py-2 border-t border-border sb-small text-ink-muted">
            <span class="flex items-center gap-2">
              <span aria-hidden="true" class="size-2.5 rounded-sm shrink-0 bg-primary"></span>
              {{ t('pages.home.hero.token-lines.accent') }}
            </span>
            <span class="text-ink font-semibold">{{ tokenValues.primary }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-border sb-small text-ink-muted">
            <span>{{ t('pages.home.hero.token-lines.font-primary') }}</span>
            <span class="text-ink font-semibold">{{ tokenValues.fontDisplay }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-border sb-small text-ink-muted">
            <span>{{ t('pages.home.hero.token-lines.font-secondary') }}</span>
            <span class="text-ink font-semibold">{{ tokenValues.fontBody }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-border sb-small text-ink-muted">
            <span>{{ t('pages.home.hero.token-lines.scale-ratio') }}</span>
            <span class="text-ink font-semibold">{{ tokenValues.textBody }}</span>
          </div>
        </BaseWindowPanel>
      </div>
    </section>

    <!-- Buttons -->
    <section id="buttons" class="py-12 md:py-16 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.buttons.description')"
        :eyebrow="t('pages.home.buttons.eyebrow')"
        :heading="t('pages.home.buttons.heading')"
      />

      <div class="flex flex-wrap items-center gap-3 mb-4">
        <BaseButton variant="primary">
          {{ t('pages.home.buttons.save') }}
        </BaseButton>
        <BaseButton variant="secondary">
          {{ t('pages.home.buttons.duplicate') }}
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
        <BaseButton is-loading variant="primary">
          {{ t('pages.home.buttons.loading') }}
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
    <section id="badges" class="py-12 md:py-16 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.badges.description')"
        :eyebrow="t('pages.home.badges.eyebrow')"
        :heading="t('pages.home.badges.heading')"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p class="sb-overline text-ink-muted mb-3">
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
          <p class="sb-overline text-ink-muted mb-3">
            {{ t('pages.home.badges.chips-label') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <BaseChip :text="t('pages.home.badges.all')" variant="primary" />
            <BaseChip :text="t('pages.home.badges.frontend')" variant="secondary" />
            <BaseChip :text="t('pages.home.badges.backend')" variant="secondary" />
            <BaseChip icon="lucide:pen-tool" :text="t('pages.home.badges.design')" variant="secondary" />
            <BaseChip is-disabled :text="t('pages.home.badges.archived')" variant="secondary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section id="cards" class="py-20 md:py-28 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.cards.description')"
        :eyebrow="t('pages.home.cards.eyebrow')"
        :heading="t('pages.home.cards.heading')"
      />

      <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr] gap-5">
        <!-- Feature card -->
        <BaseCard :full-custom-content="true" variant="dark">
          <div class="flex flex-col justify-between h-full">
            <div>
              <div class="size-11 rounded-sm bg-primary text-on-primary flex items-center justify-center mb-4">
                <Icon aria-hidden="true" class="size-6" name="lucide:layers" />
              </div>
              <h3 class="text-ink">
                {{ t('pages.home.cards.feature.title') }}
              </h3>
              <p class="sb-body text-ink-muted mt-2">
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
          <p class="sb-overline text-ink-muted">
            {{ t('pages.home.cards.stat.label') }}
          </p>
          <p class="sb-h2 text-ink mt-1">
            {{ t('pages.home.cards.stat.value') }}
          </p>
          <p class="sb-label text-success flex items-center gap-1">
            <Icon aria-hidden="true" class="size-4" name="lucide:trending-up" />
            {{ t('pages.home.cards.stat.delta') }}
          </p>
        </BaseCard>

        <!-- List card -->
        <BaseCard :full-custom-content="true" variant="light">
          <p class="sb-overline text-ink-muted mb-3">
            {{ t('pages.home.cards.list.label') }}
          </p>
          <div class="flex flex-col divide-y divide-border">
            <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span class="flex items-center gap-2.5 sb-body text-ink">
                <span class="size-7 rounded-full bg-surface-2 flex items-center justify-center sb-small text-ink-muted shrink-0">{{ t('pages.home.cards.list.button.name').slice(0, 2) }}</span>
                {{ t('pages.home.cards.list.button.name') }}
              </span>
              <BaseBadge :text="t('pages.home.cards.list.button.status')" variant="success" />
            </div>
            <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span class="flex items-center gap-2.5 sb-body text-ink">
                <span class="size-7 rounded-full bg-surface-2 flex items-center justify-center sb-small text-ink-muted shrink-0">{{ t('pages.home.cards.list.dialog.name').slice(0, 2) }}</span>
                {{ t('pages.home.cards.list.dialog.name') }}
              </span>
              <BaseBadge :text="t('pages.home.cards.list.dialog.status')" variant="success" />
            </div>
            <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span class="flex items-center gap-2.5 sb-body text-ink">
                <span class="size-7 rounded-full bg-surface-2 flex items-center justify-center sb-small text-ink-muted shrink-0">{{ t('pages.home.cards.list.accordion.name').slice(0, 2) }}</span>
                {{ t('pages.home.cards.list.accordion.name') }}
              </span>
              <BaseBadge :text="t('pages.home.cards.list.accordion.status')" variant="warning" />
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Accordion -->
    <section id="accordion" class="py-12 md:py-16 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.accordion.description')"
        :eyebrow="t('pages.home.accordion.eyebrow')"
        :heading="t('pages.home.accordion.heading')"
      />

      <div class="max-w-3xl space-y-3">
        <BaseAccordion
          id="accordion-theme-colors"
          default-open
          :title="t('pages.home.accordion.items.theme-colors.title')"
        >
          <p class="sb-body">
            {{ t('pages.home.accordion.items.theme-colors.content') }}
          </p>
        </BaseAccordion>

        <BaseAccordion
          id="accordion-nuxt-compat"
          :title="t('pages.home.accordion.items.nuxt-compat.title')"
        >
          <p class="sb-body">
            {{ t('pages.home.accordion.items.nuxt-compat.content') }}
          </p>
        </BaseAccordion>

        <BaseAccordion
          id="accordion-dark-mode"
          :title="t('pages.home.accordion.items.dark-mode.title')"
        >
          <p class="sb-body">
            {{ t('pages.home.accordion.items.dark-mode.content') }}
          </p>
        </BaseAccordion>
      </div>
    </section>

    <!-- Form -->
    <section id="form" class="py-20 md:py-28 border-t border-border scroll-mt-24 lg:grid lg:grid-cols-[18rem_1fr] lg:gap-14">
      <BaseSectionHeader
        class="mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start"
        :description="t('pages.home.form.description')"
        :eyebrow="t('pages.home.form.eyebrow')"
        :heading="t('pages.home.form.heading')"
      />

      <div>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl">
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
              :error="emailError"
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

            <BaseCombobox
              id="form-primary-team"
              v-model:input="primaryTeam"
              :items="teamOptions"
              :label="t('pages.home.form.combobox.single-label')"
            />
          </div>

          <div class="space-y-6">
            <BaseCombobox
              id="form-collaborating-teams"
              v-model:input="collaboratingTeams"
              :items="teamOptions"
              :label="t('pages.home.form.combobox.multiple-label')"
              type="multiple"
            />

            <fieldset class="min-w-0">
              <legend class="sb-overline text-ink-muted mb-3">
                {{ t('pages.home.form.notifications-title') }}
              </legend>
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
            </fieldset>

            <fieldset class="min-w-0">
              <legend class="sb-overline text-ink-muted mb-3">
                {{ t('pages.home.form.visibility-title') }}
              </legend>
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
            </fieldset>

            <fieldset class="min-w-0">
              <legend class="sb-overline text-ink-muted mb-3">
                {{ t('pages.home.form.preferences-title') }}
              </legend>
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
            </fieldset>
          </div>
        </div>
        <div class="max-w-4xl mt-10 rounded-md border border-dashed border-border p-5 md:p-6">
          <p class="sb-overline text-ink-muted mb-4">
            {{ t('pages.home.form.states-title') }}
          </p>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-6">
            <BaseInput
              id="form-state-disabled"
              is-disabled
              :label="t('pages.home.form.states.disabled-label')"
              :placeholder="t('pages.home.form.states.disabled-placeholder')"
            />
            <BaseInput
              id="form-state-error"
              :error="t('pages.home.form.email.error')"
              :input="t('pages.home.form.states.error-value')"
              :label="t('pages.home.form.states.error-label')"
              type="email"
            />
            <BaseInput
              id="form-state-readonly"
              :input="t('pages.home.form.states.readonly-value')"
              is-readonly
              :label="t('pages.home.form.states.readonly-label')"
            />
            <BaseSwitch
              id="form-state-switch"
              :input="true"
              is-disabled
              :label="t('pages.home.form.states.disabled-switch')"
            />
            <BaseCheckbox
              id="form-state-checkbox"
              :input="true"
              is-disabled
              :label="t('pages.home.form.states.disabled-checkbox')"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Dialog -->
    <section id="dialog" class="py-12 md:py-16 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.dialog.description')"
        :eyebrow="t('pages.home.dialog.eyebrow')"
        :heading="t('pages.home.dialog.heading')"
      />

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
      <p class="sb-body">
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
      <p class="sb-body">
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
      <p class="sb-body">
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
      <p class="sb-body">
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
    <section id="components" class="py-20 md:py-28 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.components.description')"
        :eyebrow="t('pages.home.components.eyebrow')"
        :heading="t('pages.home.components.heading')"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <p class="sb-overline text-ink-muted mb-3">
            {{ t('pages.home.components.carousel-label') }}
          </p>
          <BaseMediaCarousel :items="carouselItems" />
        </div>

        <div>
          <p class="sb-overline text-ink-muted mb-3">
            {{ t('pages.home.components.rich-text-label') }}
          </p>
          <div class="rounded-md border border-border bg-surface p-5 md:p-6">
            <BaseRichText :blocks="richTextBlocks" />
          </div>
        </div>
      </div>
    </section>

    <!-- i18n -->
    <section id="i18n" class="py-12 md:py-16 border-t border-border scroll-mt-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <BaseSectionHeader
            :description="t('pages.home.i18n.description')"
            :eyebrow="t('pages.home.i18n.eyebrow')"
            :heading="t('pages.home.i18n.heading')"
          />
          <p class="sb-small text-ink-muted mt-4 flex items-center gap-2">
            <Icon class="size-4 text-primary shrink-0" name="lucide:languages" />
            {{ t('pages.home.i18n.hint') }}
          </p>
        </div>

        <BaseWindowPanel :filename="t('pages.home.i18n.panel-filename')">
          <div class="flex items-center justify-between py-2 sb-small text-ink-muted">
            <span>{{ t('pages.home.i18n.locale-label') }}</span>
            <BaseBadge dot :text="locale" variant="accent" />
          </div>
          <div class="flex items-center justify-between py-2 border-t border-border sb-small text-ink-muted">
            <span>{{ t('pages.home.i18n.strategy-label') }}</span>
            <span class="text-ink font-semibold">{{ t('pages.home.i18n.strategy-value') }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-t border-border sb-small text-ink-muted">
            <span>{{ t('pages.home.i18n.files-label') }}</span>
            <span class="text-ink font-semibold">{{ t('pages.home.i18n.files-value') }}</span>
          </div>
        </BaseWindowPanel>
      </div>
    </section>

    <!-- Responsive -->
    <section id="responsive" class="py-12 md:py-16 border-t border-border scroll-mt-24">
      <BaseSectionHeader
        class="mb-8"
        :description="t('pages.home.responsive.description')"
        :eyebrow="t('pages.home.responsive.eyebrow')"
        :heading="t('pages.home.responsive.heading')"
      />

      <!-- Type specimen: the real sb-* roles, so resizing the window shows display/h1/h2 stepping at lg -->
      <div class="mb-10 divide-y divide-border border-y border-border">
        <div
          v-for="role in specimenRoles"
          :key="role.className"
          class="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6"
        >
          <code class="sb-small text-ink-muted shrink-0 md:w-36">{{ role.className }}</code>
          <p class="text-ink min-w-0 text-balance" :class="role.className">
            {{ t('pages.home.responsive.specimen-sample') }}
          </p>
        </div>
      </div>

      <div class="rounded-lg border border-border bg-surface-2 p-6 md:p-8">
        <h3 class="sb-h4 text-ink mb-4">
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
