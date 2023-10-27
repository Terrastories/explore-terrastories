import { useEffect, useRef } from "react"

// Hook: useModal()
// Requires and accepts a close handler (how to close the modal)
//
// Returns a modalRef to be used on the outermost element of your modal
// Returns a contentRef to be used on the container specifically for your
//  content. This is so we can detect "outside" clicks from the content to
//  trigger a close event.
const useModal = (closeHandler: () => void) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!modalRef.current) return

    const modal = modalRef.current
    const focusableContent = modal.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
    )
    const firstFocusableElement = focusableContent[0]
    const lastFocusableElement = focusableContent[focusableContent.length - 1]

    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !contentRef.current.contains(event.target as HTMLElement)) {
        closeHandler()
      }
    }

    function handleEscClose(event: KeyboardEvent) {
      if (event.key === "Escape" || event.which === 27) {
        closeHandler()
      }
    }

    function handleKeyboardAccessibleEvents(event: KeyboardEvent) {
      const isTabPressed = event.key === "Tab" || event.which === 9

      if (!isTabPressed) return

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          event.preventDefault()
        }
      }
    }

    modal.addEventListener("keydown", handleEscClose)
    modal.addEventListener("keydown", handleKeyboardAccessibleEvents)
    modal.addEventListener("mousedown", handleClickOutside)

    // Focus modal so event listeners work!
    modal.focus()
    return () => {
      modal.removeEventListener("keydown", handleEscClose)
      modal.removeEventListener("keydown", handleKeyboardAccessibleEvents)
      modal.removeEventListener("mousedown", handleClickOutside)
    }
  }, [closeHandler])

  return {modalRef, contentRef}
}

export default useModal
