import { createContext, useContext, useState, ReactNode } from 'react'

import type { LngLatBoundsLike } from 'mapbox-gl'
import type { GeoJsonProperties, Feature, Point } from 'geojson'
import bbox from '@turf/bbox'

import type { MapData } from 'types'

interface MapConfig {
  points: Array<Feature<Point, GeoJsonProperties>>
  setMapConfig: (c: MapData) => void
  stashedPoints: Array<Feature<Point, GeoJsonProperties>> | undefined
  setStashedPoints: (points: Array<Feature<Point, GeoJsonProperties>> | undefined) => void
  updateStoryPoints: (newPoints: Array<Feature<Point, GeoJsonProperties>>) => void
  bounds?: LngLatBoundsLike
}

const MapContext = createContext<MapConfig & MapData>({
  // Map Layers
  points: [],
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

export const MapContextProvider = ({ children, initialPoints, initialMapConfig }: {children: ReactNode, initialPoints: Array<Feature<Point, GeoJsonProperties>>, initialMapConfig: MapData}) => {
  const [points, setPoints] = useState<Array<Feature<Point, GeoJsonProperties>>>(initialPoints)
  const [stashedPoints, setStashedPoints] = useState<Array<Feature<Point, GeoJsonProperties>>>()

  const [bounds, setBounds] = useState<LngLatBoundsLike>()

  function updateStoryPoints(newPoints: Array<Feature<Point, GeoJsonProperties>>) {
    setPoints(newPoints)
    const bounds = {
      type: 'FeatureCollection',
      features: newPoints
    }
    setBounds(bbox(bounds) as LngLatBoundsLike)
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
