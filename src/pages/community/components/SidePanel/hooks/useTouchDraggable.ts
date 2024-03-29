import { useEffect, useState } from "react"
import type { RefObject } from "react"

import { useSpring } from "@react-spring/web"

import useMobile from "hooks/useMobile"

export default function useMouseDraggable(
  panelResizeableRef: RefObject<HTMLDivElement>,
  isMobile: boolean
) {
  const pageTop = 90
  const drawerOpenHeight = window.innerHeight * .40

  const [touchStart, setTouchStart] = useState<number>(0)
  const [touchEnd, setTouchEnd] = useState<number>(0)

  const [mobileSprings, mApi] = useSpring(() => ({from: {height: isMobile ? `${drawerOpenHeight}px` : "100%"}}))

  const [dragging, setDragging] = useState<boolean>(false)

  const { restrictOverscrollBehavior } = useMobile()

  useEffect(() => {
    if (!panelResizeableRef.current) return
    if (!isMobile) return
    const dragTab = panelResizeableRef.current

    const handleTap = (e: TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientY)
      restrictOverscrollBehavior(true)
    }

    const handleDrag = (e: TouchEvent) => {
      setDragging(true)
      // stop any in-progress animations
      mApi.stop()

      if (e.targetTouches[0].clientY < pageTop) {
        setTouchEnd(pageTop)
      } else if (e.targetTouches[0].clientY > window.innerHeight) {
        setTouchEnd(window.innerHeight - pageTop)
      } else {
        setTouchEnd(e.targetTouches[0].clientY)
      }
    }

    const handleRelease = (e: TouchEvent) => {
      if (dragging) {
        const el = e.target as HTMLElement
        const parent = el.offsetParent as HTMLElement
        const draggedHeight = parent.offsetHeight

        // default height is drawer open
        let finalHeight = drawerOpenHeight

        // fully open panel for swipe up past drawer open height
        if ((draggedHeight > drawerOpenHeight) && touchStart > touchEnd) {
          finalHeight = window.innerHeight - pageTop
        }
        // fully close planel for swipe down past drawer open height
        else if ((draggedHeight < drawerOpenHeight) && touchStart < touchEnd) {
          finalHeight = 0
        }

        mApi.start({
          from: {height: draggedHeight + "px"},
          to: {height: finalHeight + "px"},
          onRest: () => {
            restrictOverscrollBehavior(false)
          }
        })
        setDragging(false)
      } else {
        // if not dragging, ensure overscroll behavior is re-added immediately
        restrictOverscrollBehavior(false)
      }
      setTouchStart(0)
      setTouchEnd(0)
    }

    dragTab.addEventListener("touchstart", handleTap)
    dragTab.addEventListener("touchmove", handleDrag)
    dragTab.addEventListener("touchend", handleRelease)

    return () => {
      dragTab.removeEventListener("touchstart", handleTap)
      dragTab.removeEventListener("touchmove", handleDrag)
      dragTab.removeEventListener("touchend", handleRelease)
    }
  }, [panelResizeableRef, dragging, mApi, drawerOpenHeight, isMobile, restrictOverscrollBehavior, touchEnd, touchStart])

  return { mobileSprings, dragging, touchEnd }
}