<script setup lang="ts">
const { pageTransition } = usePageTransition()
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>
