import { useEffect, MutableRefObject } from 'react'

import type { Map, MapLayerMouseEvent} from 'mapbox-gl'

const usePointerCursor = (mapRef: MutableRefObject<Map | null>, layerIds: string[]) => {
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    function showCursorPointer(e: MapLayerMouseEvent) {
      map.getCanvas().style.cursor = 'pointer'
    }

    function hideCursorPointer() {
      map.getCanvas().style.cursor = ''
    }

    map.on('mouseenter', layerIds, showCursorPointer)
    map.on('mouseleave', layerIds, hideCursorPointer)

    return () => {
      map.off('mouseenter', layerIds, showCursorPointer)
      map.off('mouseleave', layerIds, hideCursorPointer)
    }
  }, [mapRef, layerIds])
}

export default usePointerCursor
