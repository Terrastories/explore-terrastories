import { useEffect, useState } from 'react'

export default function useMobile() {
  const [width, setWidth] = useState<number>(window.innerWidth)
  const isMobile = width <= 768

  useEffect(() => {
    function handleWindowSizeChange() {
      // NOTE(LM): do not resize window if window is resized due
      // to entering fullscreen mode.
      if (document.fullscreenElement !== null) return

      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowSizeChange)

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const restrictOverscrollBehavior = (enabled: boolean) => {
    document.documentElement.classList.toggle('disableOverflowSwipe', enabled)
    document.body.classList.toggle('disableOverflowSwipe', enabled)
  }

  return { isMobile, restrictOverscrollBehavior }
}
