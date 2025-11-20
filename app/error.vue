<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const is404 = props.error.statusCode === 404

const handleBackHome = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div
    class="min-h-screen bg-app-main text-app-contrast flex items-center justify-center p-8 md:p-12 lg:p-16"
  >
    <main class="w-full max-w-[1400px] mx-auto">
      <section
        class="flex flex-col items-center text-center gap-6 py-20"
      >
        <!-- Badge status -->
        <p
          class="ty-app-label text-app-accent bg-app-surface border border-app-border rounded-lg px-4 py-2 transition-colors"
        >
          {{ is404 ? 'Page not found' : 'Something went wrong' }}
        </p>

        <!-- Big code -->
        <h1 class="ty-app-hero text-app-accent drop-shadow mb-2 transition-colors">
          {{ is404 ? '404' : 'Error' }}
        </h1>

        <!-- Title / message -->
        <div class="space-y-3 max-w-xl">
          <p class="ty-app-subtitle text-app-contrast">
            {{ is404 ? 'The page you are looking for does not exist.' : (props.error.statusMessage || props.error.message || 'An unexpected error occurred.') }}
          </p>

          <p class="ty-app-paragraph text-app-muted">
            Check the URL for mistakes, or go back to the homepage and continue exploring.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
          <button
            class="ty-app-btn-label px-6 py-3 bg-app-accent text-white rounded-lg hover:bg-app-accent-hover transition-colors"
            type="button"
            @click="handleBackHome"
          >
            Back to Home
          </button>

          <NuxtLink
            class="ty-app-btn-label text-app-muted underline underline-offset-4 hover:text-app-contrast transition-colors"
            to="/"
          >
            Explore More
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
