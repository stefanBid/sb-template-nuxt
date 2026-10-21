/**
 * Single highlight for floating lists (listbox options, menu items) driven by both pointer and keyboard.
 * Hover moves DOM focus to the item, so typeahead and arrow keys continue from it, while `isPointer`
 * lets the item hide its keyboard focus ring until a key is pressed again.
 */
export default function usePointerHighlight() {
  // State
  const isPointer = ref(false)

  /**
   * Focus the hovered item without scrolling the list
   * @param e PointerEvent - pointermove on the item
   * @returns void
   */
  function onPointerMove(e: PointerEvent) {
    isPointer.value = true
    const el = e.currentTarget as HTMLElement
    if (document.activeElement !== el) {
      el.focus({ preventScroll: true })
    }
  }

  /**
   * Back to keyboard modality (a key press, or the list closing): the focus ring shows again
   * @returns void
   */
  function reset() {
    isPointer.value = false
  }

  return {
    isPointer,
    onPointerMove,
    reset,
  }
}
