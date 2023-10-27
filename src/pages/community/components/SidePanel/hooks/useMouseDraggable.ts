import { useEffect, useState } from "react"
import type { RefObject } from "react"

import { useSpring } from "@react-spring/web"

export default function useMouseDraggable(
  panelRef: RefObject<HTMLDivElement>,
  panelResizeableRef: RefObject<HTMLDivElement>,
  isMobile: boolean
) {
  const [open, setOpen] = useState<boolean>(true)
  const [browserSprings, bApi] = useSpring(() => ({from: {x: 0}}))

  // Responsive Mouse Events (Mobile, Y drag)
  useEffect(() => {
    if (!panelRef.current) return
    if (!panelResizeableRef.current) return
    if (!isMobile) return

    const panelElement = panelRef.current
    const dragTab = panelResizeableRef.current

    let height = panelElement.offsetHeight
    let y = 0

    const handleDrag = (e: MouseEvent) => {
      const dist = e.clientY - y
      height = height - dist
      y = e.clientY

      panelElement.style.height = `${height}px`
    }

    const handleMouseDown = (e: MouseEvent) => {
      y = e.clientY
      document.addEventListener("mousemove", handleDrag)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleDrag)
    }

    dragTab.addEventListener("mousedown", handleMouseDown)

    return () => {
      dragTab.removeEventListener("mousedown", handleMouseDown)
    }
  }, [isMobile, panelRef, panelResizeableRef])

  // Responsive Mouse Events (Browser, X drag)
  // TODO(LM) Currently this is only a click event to show/hid
  // we may eventually want to drag open and snap close
  // but for now, we'll keep the same functionality as main TS
  useEffect(() => {
    if (!panelRef.current) return
    if (!panelResizeableRef.current) return
    if (isMobile) return

    const panelElement = panelRef.current
    const dragTab = panelResizeableRef.current

    const handleClick = () => {
      bApi.start({
        from: {x: open ? 0 : -panelElement.offsetWidth},
        to: {x: open ? -panelElement.offsetWidth : 0}
      })
      setOpen(!open)
    }

    dragTab.addEventListener("click", handleClick)

    return () => {
      dragTab.removeEventListener("click", handleClick)
    }
  }, [isMobile, panelRef, panelResizeableRef, open, setOpen, bApi])

  return { browserSprings, open }
}
