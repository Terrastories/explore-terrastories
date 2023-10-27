import React from "react"
import type { MapData } from "types"

type LoadMapOptions = {
  mapRef: React.MutableRefObject<any>,
  localMapServer?: boolean
}

export function loadTerrainAndFog({
  mapRef,
  localMapServer = false,
  ...config
}: MapData & LoadMapOptions) {
  if (!mapRef.current) return

  if (!localMapServer && config.mapbox3dEnabled) {
    mapRef.current.addSource("mapbox-dem", {
      "type": "raster-dem",
      "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
      "tileSize": 512,
      "maxzoom": 14
    })

    mapRef.current.setTerrain({"source": "mapbox-dem"})

    mapRef.current.addLayer({
      "id": "sky",
      "type": "sky",
      "paint": {
        "sky-type": "atmosphere",
        "sky-atmosphere-sun": [0.0, 0.0],
        "sky-atmosphere-sun-intensity": 15
      }
    })
  }

  if (!localMapServer && config.mapProjection === "globe") {
    mapRef.current.setFog({
      "horizon-blend": 0.02,
      "star-intensity": 0.15,
      "color": "#ffffff",
      "high-color": "#008cff",
      "space-color": "#000000"
    })
  }
}
