import { useRef, useMemo, useCallback, useEffect, MutableRefObject } from 'react'
import ReactDOM from 'react-dom/client'

import type { Map } from 'mapbox-gl'
import { Popup as MBPopup } from 'mapbox-gl'

import Popup from '../components/Popup'
import {MarkerMouseEvent} from '../components/Marker'

import type { TypePlace } from 'types'

const usePopup = (mapRef: MutableRefObject<Map | null>) => {
  const activePointRef = useRef<number | string | null>(null)
  const popup = useMemo(
    () => new MBPopup(
      {offset: [10, -30], closeButton: false, closeOnClick: false, className: "tsPopup"}
    ),
    []
  );

  const closePopup = useCallback(() => {
    popup.remove()
  }, [popup])

  const openPopup = useCallback((e: MarkerMouseEvent) => {
    if (!mapRef.current) return
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
    el.setAttribute('tabindex', '0')
    // ensures there is no added margins
    el.style.display = 'inline-grid'

    popupNode.render(
      <Popup {...feature} handleClose={closePopup} />
    )

    popup.setLngLat(lngLat).setDOMContent(el).addTo(map)
  }, [popup, mapRef, closePopup])

  useEffect(() => {
    function resetActiveRef() {
      activePointRef.current = null
    }

    popup.on('close', resetActiveRef)

    return () => {
      popup.off('close', resetActiveRef)
    }
  }, [popup])

  return { popup, openPopup, closePopup }
}

export default usePopup
