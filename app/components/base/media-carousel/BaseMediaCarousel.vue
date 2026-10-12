<script setup lang="ts">
interface MediaItem {
  type: 'photo' | 'video'
  url: string
  alternativeText?: string
  caption?: string
  previewUrl?: string
  width?: number
  height?: number
}

interface BaseMediaCarouselProps {
  items: MediaItem[]
}

// Dependencies
const { t } = useI18n()

// Input / Output
const props = defineProps<BaseMediaCarouselProps>()

// State
const isPlaying = ref(true)
const currentIndex = ref(0)
const videoRef = ref<HTMLVideoElement | null>(null)

const currentItem = computed(() => props.items[currentIndex.value])

// Events
const onGoToPrevious = () => {
  currentIndex.value = currentIndex.value === 0 ? props.items.length - 1 : currentIndex.value - 1
  resetAutoplay()
}

const onGoToNext = () => {
  currentIndex.value = currentIndex.value === props.items.length - 1 ? 0 : currentIndex.value + 1
  resetAutoplay()
}

const onGoToIndex = (index: number) => {
  currentIndex.value = index
  resetAutoplay()
}

const onToggleAutoplay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    resetAutoplay()
  }
  else if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Auto-play
let intervalId: NodeJS.Timeout | null = null

const resetAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (isPlaying.value) {
    startAutoplay()
  }
}

const startAutoplay = () => {
  if (!import.meta.client || props.items.length <= 1) {
    return
  }

  intervalId = setInterval(() => {
    // Skip auto-advance only if current item is a video AND it's playing (not paused)
    if (currentItem.value?.type === 'video' && videoRef.value && !videoRef.value.paused) {
      return
    }
    onGoToNext()
  }, 5000)
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div v-if="currentItem" class="relative w-full">
    <!-- Main Media -->
    <div
      class="relative rounded-lg overflow-hidden shadow-md border border-border sb-transition"
      :class="currentItem.type === 'photo' ? 'aspect-video md:aspect-21/9 bg-ink-muted/10' : 'h-125 md:h-150 bg-surface-2 flex items-center justify-center'"
    >
      <!-- Image -->
      <NuxtImg
        v-if="currentItem.type === 'photo'"
        :alt="currentItem.alternativeText || t('ui.carousel.media-alt', { n: currentIndex + 1 })"
        class="w-full h-full object-cover"
        loading="lazy"
        provider="none"
        :src="currentItem.url"
      />

      <!-- Video -->
      <video
        v-else-if="currentItem.type === 'video'"
        :key="currentItem.url"
        ref="videoRef"
        :aria-label="currentItem.alternativeText || t('ui.carousel.media-alt', { n: currentIndex + 1 })"
        class="w-full max-h-full"
        controls
        :poster="currentItem.previewUrl || undefined"
        preload="metadata"
      >
        <source :src="currentItem.url" type="video/mp4" />
        {{ t('ui.carousel.video-unsupported') }}
      </video>

      <!-- Navigation Arrows (only if more than 1 item) -->
      <template v-if="props.items.length > 1">
        <!-- Previous -->
        <div class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2">
          <BaseIconButton
            :aria-label="currentItem.type === 'photo' ? t('ui.carousel.previous-photo') : t('ui.carousel.previous-video')"
            icon="lucide:chevron-left"
            @click="onGoToPrevious"
          />
        </div>

        <!-- Next -->
        <div class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2">
          <BaseIconButton
            :aria-label="currentItem.type === 'photo' ? t('ui.carousel.next-photo') : t('ui.carousel.next-video')"
            icon="lucide:chevron-right"
            @click="onGoToNext"
          />
        </div>
      </template>

      <!-- Autoplay control (only if more than 1 item) -->
      <div
        v-if="props.items.length > 1"
        class="absolute bottom-4 left-4"
      >
        <BaseIconButton
          :aria-label="isPlaying ? t('ui.carousel.pause') : t('ui.carousel.play')"
          :icon="isPlaying ? 'lucide:pause' : 'lucide:play'"
          @click="onToggleAutoplay"
        />
      </div>

      <!-- Counter (only if more than 1 item) -->
      <div
        v-if="props.items.length > 1"
        class="absolute bottom-4 right-4"
      >
        <BaseChip
          :text="`${currentIndex + 1} / ${props.items.length}`"
          variant="secondary"
        />
      </div>
    </div>

    <!-- Thumbnails (only if more than 1 item) -->
    <div
      v-if="props.items.length > 1"
      class="mt-4 flex gap-2 md:gap-3 overflow-x-auto pb-2"
    >
      <button
        v-for="(item, index) in props.items"
        :key="index"
        class="relative shrink-0 size-16 md:size-20 rounded-sm overflow-hidden border-2 sb-transition sb-focus"
        :class="{
          'border-primary': currentIndex === index,
          'border-border hover:border-ink/30': currentIndex !== index,
        }"
        type="button"
        @click="onGoToIndex(index)"
      >
        <!-- Photo Thumbnail -->
        <NuxtImg
          v-if="item.type === 'photo'"
          :alt="item.alternativeText || t('ui.carousel.thumbnail-alt', { n: index + 1 })"
          class="w-full h-full object-cover sb-transition"
          loading="lazy"
          provider="none"
          :src="item.url"
        />

        <!-- Video Thumbnail with Play Icon -->
        <div v-else-if="item.type === 'video'" class="relative w-full h-full">
          <NuxtImg
            v-if="item.previewUrl"
            :alt="item.alternativeText || t('ui.carousel.video-thumbnail-alt', { n: index + 1 })"
            class="w-full h-full object-cover sb-transition"
            loading="lazy"
            provider="none"
            :src="item.previewUrl"
          />
          <div v-else class="w-full h-full bg-ink-muted/20 flex items-center justify-center sb-transition">
            <Icon class="size-6 text-ink-muted sb-transition" name="lucide:video" />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
