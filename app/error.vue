<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}>()

const is404 = props.error.statusCode === 404

const handleBackHome = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div
    class="min-h-dvh bg-bg text-ink flex items-center justify-center p-8 md:p-12 lg:p-16 sb-transition"
  >
    <main class="w-full max-w-350 mx-auto">
      <section
        class="flex flex-col items-center text-center gap-6 py-20"
      >
        <!-- Badge status -->
        <p
          class="sb-label text-primary bg-surface border border-border rounded-lg px-4 py-2 sb-transition"
        >
          {{ is404 ? 'Page not found' : 'Something went wrong' }}
        </p>

        <!-- Big code -->
        <h1 class="sb-display text-primary mb-2 sb-transition">
          {{ is404 ? '404' : 'Error' }}
        </h1>

        <!-- Title / message -->
        <div class="space-y-3 max-w-xl">
          <p class="sb-lead text-ink sb-transition">
            {{ is404 ? 'The page you are looking for does not exist.' : (props.error.statusMessage || props.error.message || 'An unexpected error occurred.') }}
          </p>

          <!-- DEBUG: Show full error in dev -->
          <details v-if="!is404" class="text-left mt-4">
            <summary class="sb-label text-ink-muted cursor-pointer hover:text-ink sb-transition">
              Technical Details (debug)
            </summary>
            <pre class="sb-small text-ink-muted bg-surface border border-border rounded-lg p-3 mt-2 overflow-auto sb-small sb-transition">{{ JSON.stringify(props.error, null, 2) }}</pre>
          </details>

          <p class="sb-body text-ink-muted sb-transition">
            Check the URL for mistakes, or go back to the homepage and continue exploring.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-10 mt-4 sb-transition">
          <button
            class="sb-body-strong px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary-hover sb-transition"
            type="button"
            @click="handleBackHome"
          >
            Back to Home
          </button>

          <NuxtLink
            class="sb-body-strong text-ink-muted underline underline-offset-4 hover:text-ink sb-transition"
            to="/"
          >
            Explore More
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
