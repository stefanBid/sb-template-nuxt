<script setup lang="ts">
// Dependencies
const { t } = useI18n()
const route = useRoute()

useSeoMeta({
  // LOCALIZED
  title: () => t('meta.home.title'),
  description: () => t('meta.home.description'),
  ogTitle: () => t('meta.home.title'),
  ogDescription: () => t('meta.home.description'),
  twitterTitle: () => t('meta.home.title'),
  twitterDescription: () => t('meta.home.description'),

  // DYNAMIC BUT NOT TIED TO CONTENT LANGUAGE
  ogUrl: () => `http://localhost:3000${route.fullPath}`,
})
</script>

<template>
  <div class="min-h-screen bg-app-main text-app-contrast py-20">
    <div class="space-y-16">
      <!-- Typography Section -->
      <section class="space-y-8">
        <h2 class="ty-app-title-xl text-app-accent mb-8">
          Typography
        </h2>

        <div class="space-y-6">
          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Hero Text
            </p>
            <h1 class="ty-app-hero text-app-contrast">
              HERO
            </h1>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Impact Text
            </p>
            <h2 class="ty-app-impact text-app-contrast">
              IMPACT
            </h2>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Title XL
            </p>
            <h3 class="ty-app-title-xl text-app-contrast">
              Title Extra Large
            </h3>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Title LG
            </p>
            <h4 class="ty-app-title-lg text-app-contrast">
              Title Large
            </h4>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Title
            </p>
            <h5 class="ty-app-title text-app-contrast">
              Title Standard
            </h5>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Subtitle XL
            </p>
            <p class="ty-app-subtitle-xl text-app-contrast">
              Subtitle Extra Large
            </p>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Subtitle LG
            </p>
            <p class="ty-app-subtitle-lg text-app-contrast">
              Subtitle Large
            </p>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Subtitle
            </p>
            <p class="ty-app-subtitle text-app-contrast">
              Subtitle Standard
            </p>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Paragraph
            </p>
            <p class="ty-app-paragraph text-app-contrast">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Label
            </p>
            <span class="ty-app-label text-app-contrast">Label Text</span>
          </div>

          <div class="p-6 bg-app-surface rounded-lg border border-app-border">
            <p class="ty-app-caption text-app-accent mb-2">
              Caption
            </p>
            <span class="ty-app-caption text-app-contrast">Caption text in italic style</span>
          </div>
        </div>
      </section>

      <!-- Cards Section -->
      <section class="space-y-8">
        <h2 class="ty-app-title-xl text-app-accent mb-8">
          Cards
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card 1 - Simple Dark -->
          <BaseCard
            variant="dark"
            :title="t('pages.home.cards.simple-dark.title')"
            :subtitle="t('pages.home.cards.simple-dark.subtitle')"
            :paragraph="t('pages.home.cards.simple-dark.paragraph')"
          />

          <!-- Card 2 - Simple Light -->
          <BaseCard
            variant="light"
            :title="t('pages.home.cards.simple-light.title')"
            :paragraph="t('pages.home.cards.simple-light.paragraph')"
          />

          <!-- Card 3 - Dark Hover -->
          <BaseCard
            variant="dark-hover"
            :title="t('pages.home.cards.dark-hover.title')"
            :subtitle="t('pages.home.cards.dark-hover.subtitle')"
            :paragraph="t('pages.home.cards.dark-hover.paragraph')"
          />

          <!-- Card 4 - Light Hover -->
          <BaseCard
            variant="light-hover"
            :title="t('pages.home.cards.light-hover.title')"
            :paragraph="t('pages.home.cards.light-hover.paragraph')"
          />

          <!-- Card 5 - With Header Icon -->
          <BaseCard
            variant="dark"
            :title="t('pages.home.cards.with-icon.title')"
            :subtitle="t('pages.home.cards.with-icon.subtitle')"
            :paragraph="t('pages.home.cards.with-icon.paragraph')"
          >
            <template #card-header>
              <div class="w-12 h-12 bg-app-accent/20 rounded-lg flex items-center justify-center">
                <Icon class="size-6 text-app-accent" name="lucide:star" />
              </div>
            </template>
          </BaseCard>

          <!-- Card 6 - With Footer Button -->
          <BaseCard
            variant="light-hover"
            :title="t('pages.home.cards.with-action.title')"
            :subtitle="t('pages.home.cards.with-action.subtitle')"
            :paragraph="t('pages.home.cards.with-action.paragraph')"
          >
            <template #card-footer>
              <BaseButton variant="primary">
                <Icon class="size-5 mr-2" name="lucide:arrow-right" />
                {{ t('pages.home.cards.with-action.button') }}
              </BaseButton>
            </template>
          </BaseCard>

          <!-- Card 7 - Center Aligned -->
          <BaseCard
            variant="dark"
            align="center"
            :title="t('pages.home.cards.center-aligned.title')"
            :subtitle="t('pages.home.cards.center-aligned.subtitle')"
            :paragraph="t('pages.home.cards.center-aligned.paragraph')"
          />

          <!-- Card 8 - Right Aligned -->
          <BaseCard
            variant="light"
            align="right"
            :title="t('pages.home.cards.right-aligned.title')"
            :subtitle="t('pages.home.cards.right-aligned.subtitle')"
            :paragraph="t('pages.home.cards.right-aligned.paragraph')"
          />

          <!-- Card 9 - Complete Example -->
          <BaseCard
            variant="dark-hover"
            align="left"
            :title="t('pages.home.cards.complete.title')"
            :subtitle="t('pages.home.cards.complete.subtitle')"
            :paragraph="t('pages.home.cards.complete.paragraph')"
          >
            <template #card-header>
              <div class="w-12 h-12 bg-app-accent/20 rounded-lg flex items-center justify-center">
                <Icon class="size-6 text-app-accent" name="lucide:zap" />
              </div>
            </template>
            <template #card-footer>
              <BaseButton variant="outline">
                {{ t('pages.home.cards.complete.button') }}
              </BaseButton>
            </template>
          </BaseCard>

          <!-- Card 10 - Full Custom Content -->
          <BaseCard variant="dark" :full-custom-content="true">
            <div class="text-center space-y-4">
              <div class="w-16 h-16 bg-app-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Icon class="size-8 text-app-accent" name="lucide:heart" />
              </div>
              <h3 class="ty-app-title">
                {{ t('pages.home.cards.full-custom.title') }}
              </h3>
              <p class="ty-app-paragraph text-app-muted">
                {{ t('pages.home.cards.full-custom.paragraph') }}
              </p>
              <div class="flex gap-2 justify-center pt-4">
                <BaseButton variant="primary">
                  <Icon class="size-5 mr-2" name="lucide:thumbs-up" />
                  {{ t('pages.home.cards.full-custom.like-button') }}
                </BaseButton>
                <BaseButton variant="secondary">
                  <Icon class="size-5 mr-2" name="lucide:share-2" />
                  {{ t('pages.home.cards.full-custom.share-button') }}
                </BaseButton>
              </div>
            </div>
          </BaseCard>

          <!-- Card 11 - Multiple Buttons -->
          <BaseCard
            variant="light-hover"
            :title="t('pages.home.cards.multi-action.title')"
            :subtitle="t('pages.home.cards.multi-action.subtitle')"
            :paragraph="t('pages.home.cards.multi-action.paragraph')"
          >
            <template #card-footer>
              <div class="flex gap-2">
                <BaseButton variant="primary">
                  {{ t('pages.home.cards.multi-action.save-button') }}
                </BaseButton>
                <BaseButton variant="outline">
                  {{ t('pages.home.cards.multi-action.cancel-button') }}
                </BaseButton>
              </div>
            </template>
          </BaseCard>

          <!-- Card 12 - Loading State -->
          <BaseCard
            variant="dark"
            :title="t('pages.home.cards.loading-state.title')"
            :subtitle="t('pages.home.cards.loading-state.subtitle')"
            :paragraph="t('pages.home.cards.loading-state.paragraph')"
          >
            <template #card-footer>
              <BaseButton variant="primary" :is-loading="true">
                {{ t('pages.home.cards.loading-state.button') }}
              </BaseButton>
            </template>
          </BaseCard>
        </div>
      </section>

      <!-- Inputs Section -->
      <section class="space-y-8">
        <h2 class="ty-app-title-xl text-app-accent mb-8">
          Input Fields
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <!-- Text Input -->
          <div class="space-y-2">
            <label class="ty-app-label text-app-contrast block">Text Input</label>
            <input
              class="w-full px-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-contrast ty-app-paragraph focus:border-app-accent focus:outline-none transition-colors"
              placeholder="Enter text..."
              type="text"
            />
          </div>

          <!-- Email Input -->
          <div class="space-y-2">
            <label class="ty-app-label text-app-contrast block">Email Input</label>
            <input
              class="w-full px-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-contrast ty-app-paragraph focus:border-app-accent focus:outline-none transition-colors"
              placeholder="email@example.com"
              type="email"
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label class="ty-app-label text-app-contrast block">Password Input</label>
            <input
              class="w-full px-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-contrast ty-app-paragraph focus:border-app-accent focus:outline-none transition-colors"
              placeholder="••••••••"
              type="password"
            />
          </div>

          <!-- Number Input -->
          <div class="space-y-2">
            <label class="ty-app-label text-app-contrast block">Number Input</label>
            <input
              class="w-full px-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-contrast ty-app-paragraph focus:border-app-accent focus:outline-none transition-colors"
              placeholder="123"
              type="number"
            />
          </div>

          <!-- Select -->
          <div class="space-y-2">
            <label class="ty-app-label text-app-contrast block">Select</label>
            <select class="w-full px-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-contrast ty-app-paragraph focus:border-app-accent focus:outline-none transition-colors">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <!-- Textarea -->
          <div class="space-y-2 md:col-span-2">
            <label class="ty-app-label text-app-contrast block">Textarea</label>
            <textarea
              class="w-full px-4 py-3 bg-app-surface border border-app-border rounded-lg text-app-contrast ty-app-paragraph focus:border-app-accent focus:outline-none transition-colors resize-none"
              placeholder="Enter your message..."
              rows="4"
            ></textarea>
          </div>

          <!-- Checkbox -->
          <div class="space-y-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                class="w-5 h-5 bg-app-surface border border-app-border rounded text-app-accent focus:ring-app-accent focus:ring-2"
                type="checkbox"
              />
              <span class="ty-app-paragraph text-app-contrast">Checkbox Option</span>
            </label>
          </div>

          <!-- Radio -->
          <div class="space-y-2">
            <label class="ty-app-label text-app-contrast block mb-3">Radio Buttons</label>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  class="w-5 h-5 bg-app-surface border border-app-border text-app-accent focus:ring-app-accent focus:ring-2"
                  name="radio-group"
                  type="radio"
                />
                <span class="ty-app-paragraph text-app-contrast">Radio 1</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  class="w-5 h-5 bg-app-surface border border-app-border text-app-accent focus:ring-app-accent focus:ring-2"
                  name="radio-group"
                  type="radio"
                />
                <span class="ty-app-paragraph text-app-contrast">Radio 2</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Buttons Section -->
      <section class="space-y-8 pb-16">
        <h2 class="ty-app-title-xl text-app-accent mb-8">
          {{ t('pages.home.buttons.section-title') }}
        </h2>

        <div class="space-y-8">
          <!-- Primary Buttons -->
          <div class="space-y-4">
            <h3 class="ty-app-subtitle text-app-contrast">
              {{ t('pages.home.buttons.primary.title') }}
            </h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary">
                {{ t('pages.home.buttons.primary.button') }}
              </BaseButton>
              <BaseButton variant="primary" :is-disabled="true">
                {{ t('pages.home.buttons.primary.disabled') }}
              </BaseButton>
              <BaseButton variant="primary" :is-loading="true">
                {{ t('pages.home.buttons.primary.loading') }}
              </BaseButton>
              <BaseButton variant="primary" type="submit">
                {{ t('pages.home.buttons.primary.submit') }}
              </BaseButton>
            </div>
          </div>

          <!-- Secondary Buttons -->
          <div class="space-y-4">
            <h3 class="ty-app-subtitle text-app-contrast">
              {{ t('pages.home.buttons.secondary.title') }}
            </h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="secondary">
                {{ t('pages.home.buttons.secondary.button') }}
              </BaseButton>
              <BaseButton variant="secondary" :is-disabled="true">
                {{ t('pages.home.buttons.secondary.disabled') }}
              </BaseButton>
              <BaseButton variant="secondary" :is-loading="true">
                {{ t('pages.home.buttons.secondary.loading') }}
              </BaseButton>
            </div>
          </div>

          <!-- Outline Buttons -->
          <div class="space-y-4">
            <h3 class="ty-app-subtitle text-app-contrast">
              {{ t('pages.home.buttons.outline.title') }}
            </h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="outline">
                {{ t('pages.home.buttons.outline.button') }}
              </BaseButton>
              <BaseButton variant="outline" :is-disabled="true">
                {{ t('pages.home.buttons.outline.disabled') }}
              </BaseButton>
              <BaseButton variant="outline" :is-loading="true">
                {{ t('pages.home.buttons.outline.loading') }}
              </BaseButton>
            </div>
          </div>

          <!-- Link Buttons -->
          <div class="space-y-4">
            <h3 class="ty-app-subtitle text-app-contrast">
              {{ t('pages.home.buttons.link.title') }}
            </h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary" type="link" to="https://github.com">
                {{ t('pages.home.buttons.link.primary') }}
              </BaseButton>
              <BaseButton variant="secondary" type="link" to="https://nuxt.com">
                {{ t('pages.home.buttons.link.secondary') }}
              </BaseButton>
              <BaseButton variant="outline" type="link" to="https://tailwindcss.com">
                {{ t('pages.home.buttons.link.outline') }}
              </BaseButton>
            </div>
          </div>

          <!-- Buttons with Icons -->
          <div class="space-y-4">
            <h3 class="ty-app-subtitle text-app-contrast">
              {{ t('pages.home.buttons.with-icons.title') }}
            </h3>
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton variant="primary">
                <Icon class="size-5 mr-2" name="lucide:send" />
                {{ t('pages.home.buttons.with-icons.send') }}
              </BaseButton>
              <BaseButton variant="secondary">
                <Icon class="size-5 mr-2" name="lucide:download" />
                {{ t('pages.home.buttons.with-icons.download') }}
              </BaseButton>
              <BaseButton variant="outline">
                <Icon class="size-5 mr-2" name="lucide:heart" />
                {{ t('pages.home.buttons.with-icons.like') }}
              </BaseButton>
            </div>
          </div>

          <!-- All States Demo -->
          <div class="space-y-4">
            <h3 class="ty-app-subtitle text-app-contrast">
              {{ t('pages.home.buttons.states.title') }}
            </h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary">
                {{ t('pages.home.buttons.states.normal') }}
              </BaseButton>
              <BaseButton variant="primary" :is-loading="true">
                {{ t('pages.home.buttons.states.loading') }}
              </BaseButton>
              <BaseButton variant="primary" :is-disabled="true">
                {{ t('pages.home.buttons.states.disabled') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
