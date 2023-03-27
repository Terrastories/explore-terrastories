import { createContext, useContext, useState, ReactNode } from 'react'

import type { LngLatBoundsLike } from 'mapbox-gl'
import type { FeatureCollection } from 'geojson'
import bbox from '@turf/bbox'

import type { MapData } from 'types'

interface MapConfig {
  points: FeatureCollection
  setMapConfig: (c: MapData) => void
  stashedPoints: FeatureCollection | undefined
  setStashedPoints: (points: FeatureCollection | undefined) => void
  updateStoryPoints: (newPoints: FeatureCollection) => void
  bounds?: LngLatBoundsLike
}

const MapContext = createContext<MapConfig & MapData>({
  // Map Layers
  points: {type: "FeatureCollection", features:[]},
  setMapConfig: (c: MapData) => {return},
  stashedPoints: undefined,
  setStashedPoints: (p) => { return p },
  updateStoryPoints: (p) => { return p },

  // Map Config Defaults
  useLocalServer: false,
  center: [0, 0],
  zoom: 0,
  pitch: 0,
  bearing: 0,
  maxBounds: undefined,
  mapbox3dEnabled: false,
  mapProjection: 'mercator'
})

export const MapContextProvider = ({ children, initialPoints, initialMapConfig }: {children: ReactNode, initialPoints: FeatureCollection, initialMapConfig: MapData}) => {
  const [points, setPoints] = useState<FeatureCollection>(initialPoints)
  const [stashedPoints, setStashedPoints] = useState<FeatureCollection>()

  const [bounds, setBounds] = useState<LngLatBoundsLike>()

  function updateStoryPoints(newPoints: FeatureCollection) {
    setPoints(newPoints)
    setBounds(bbox(newPoints) as LngLatBoundsLike)
  }

  const [mapConfig, setMapConfig] = useState<MapData>(initialMapConfig)

  return (
    <MapContext.Provider
      value={{
        points,
        setMapConfig,
        updateStoryPoints,
        stashedPoints,
        setStashedPoints,
        bounds,
        ...mapConfig
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMapConfig = () => {
  return useContext(MapContext)
}
