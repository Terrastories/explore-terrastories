import { useEffect, useState } from 'react'

export default function useMobile() {
  const [width, setWidth] = useState<number>(window.innerWidth)
  const isMobile = width <= 768

  useEffect(() => {
    function handleWindowSizeChange() {
      // NOTE(LM): do not resize window if window is resized due
      // to entering fullscreen mode.
      if (document.fullscreenEnabled) return

      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowSizeChange)

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const toggleOverscroll = () => {
    document.documentElement.classList.toggle('disableOverflowSwipe')
    document.body.classList.toggle('disableOverflowSwipe')
  }

  return { isMobile, toggleOverscroll }
}
