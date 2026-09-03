export default function usePageTransition() {
  const pageSkipTransition = useState<boolean>('page-transition-skip', () => false)

  const pageTransition = computed(() => (
    pageSkipTransition.value
      ? { name: 'page', mode: 'out-in' as const, css: false }
      : undefined
  ))

  return {
    pageSkipTransition,
    pageTransition,
  }
}
