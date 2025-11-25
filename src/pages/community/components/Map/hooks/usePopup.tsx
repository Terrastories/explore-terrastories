import React, { useRef, useCallback, useEffect, MutableRefObject } from "react"
import ReactDOM from "react-dom/client"

import Popup from "../components/Popup"
import {MarkerMouseEvent} from "../components/Marker"

import type { TypePlace } from "types"

const usePopup = (mapRef: MutableRefObject<any>, mapLibRef: MutableRefObject<any>) => {
  const activePointRef = useRef<number | string | null>(null)
  const popupRef = useRef<any>(null)
  const [popupReady, setPopupReady] = React.useState(false)

  // Create popup instance using the same library that created the map
  // Dependencies must include mapLibRef.current to detect when async map initialization completes
  React.useEffect(() => {
    const mapLib = mapLibRef.current
    if (!mapLib) {
      return
    }

    const PopupCtor = (mapLib as any).Popup ?? mapLib.Popup

    // Create the popup instance directly and store in ref
    popupRef.current = new PopupCtor(
      {offset: [10, -30], closeButton: false, closeOnClick: false, className: "tsPopup"}
    )
    setPopupReady(true)

    return () => {
      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }
      setPopupReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLibRef.current])

  const popup = popupReady ? popupRef.current : null

  const closePopup = useCallback(() => {
    if (popup) popup.remove()
  }, [popup])

  const openPopup = useCallback((e: MarkerMouseEvent) => {
    if (!mapRef.current || !popup) return
    const map = mapRef.current
    const feature = e.properties as TypePlace

    // If map is moving, don't call again
    if (map.isMoving()) return
    // Ensure former Popup is closed if active ref is set but doesn't match new
    // mouse event
    if ((activePointRef.current !== feature.id) && popup.isOpen()) popup.remove()
    // If the Popup is already open, don't do anything else.
    if (popup.isOpen()) return

    // Set active point ref
    activePointRef.current = feature.id

    const lngLat = e.markerTarget.getLngLat()
    const el = document.createElement("div")
    const popupNode = ReactDOM.createRoot(el)
    el.setAttribute("tabindex", "0")
    // ensures there is no added margins
    el.style.display = "inline-grid"

    popupNode.render(
      <Popup {...feature} handleClose={closePopup} />
    )

    popup.setLngLat(lngLat).setDOMContent(el).addTo(map)
  }, [popup, mapRef, closePopup])

  useEffect(() => {
    if (!popup) return

    function resetActiveRef() {
      activePointRef.current = null
    }

    popup.on("close", resetActiveRef)

    return () => {
      popup.off("close", resetActiveRef)
    }
  }, [popup])

  return { popup, openPopup, closePopup }
}

export default usePopup
