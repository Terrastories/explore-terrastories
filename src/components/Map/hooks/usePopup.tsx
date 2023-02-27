import { useRef, useMemo, useEffect, MutableRefObject } from 'react'
import ReactDOM from 'react-dom/client'

import type { Map, MapLayerMouseEvent } from 'mapbox-gl'
import { Popup as MBPopup } from 'mapbox-gl'

import Popup from '../components/Popup'

const usePopup = (mapRef: MutableRefObject<Map | null>, layerId: string) => {
  const activePointRef = useRef<number | string | null>(null)
  const popup = useMemo(() => new MBPopup({closeButton: false, offset: 15, closeOnClick: false, className: "tsPopup"}),[]);

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    function closePopup() {
      popup.remove()
    }

    function openPopup(e: MapLayerMouseEvent) {
      if (!e.features) return
      const feature = e.features[0]
      if (activePointRef.current === feature.id && popup.isOpen()) return

      if (feature.id) activePointRef.current = feature.id

      if (feature.geometry.type === 'Point') {
        const el = document.createElement("div")
        el.setAttribute('tabindex', '0')
        const popupNode = ReactDOM.createRoot(el)
        const lngLat = feature.geometry.coordinates as [number, number]

        popupNode.render(
          <Popup {...feature.properties} handleClose={closePopup} />
          )
        popup.setLngLat(lngLat).setDOMContent(el).addTo(map);
        map.easeTo({center: lngLat, offset: [0, 200], duration: 2000})
      }
    }
    function resetActiveRef() {
      activePointRef.current = null
    }

    map.on('click', layerId, openPopup)
    popup.on('close', resetActiveRef)

    return () => {
      map.off('click', layerId, openPopup)
      popup.off('close', resetActiveRef)
    }
  }, [popup, mapRef, layerId])

  return { popup }
}

export default usePopup
