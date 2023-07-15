import { useEffect, useState } from 'react'

export default function useMobile() {
  const [width, setWidth] = useState<number>(window.innerWidth)
  const isMobile = width <= 768

  useEffect(() => {
    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowSizeChange)

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  })

  const toggleOverscroll = () => {
    document.documentElement.classList.toggle('disableOverflowSwipe')
    document.body.classList.toggle('disableOverflowSwipe')
  }

  return { isMobile, toggleOverscroll }
}
