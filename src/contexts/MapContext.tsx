import { createContext, useContext, useState, ReactNode } from 'react'

import type { LngLatBoundsLike } from 'mapbox-gl'
import type { GeoJsonProperties, Feature, Point } from 'geojson'
import bbox from '@turf/bbox'

interface MapConfig {
  points: Array<Feature<Point, GeoJsonProperties>>
  stashedPoints: Array<Feature<Point, GeoJsonProperties>> | undefined
  setStashedPoints: (points: Array<Feature<Point, GeoJsonProperties>> | undefined) => void
  updateStoryPoints: (newPoints: Array<Feature<Point, GeoJsonProperties>>) => void
  bounds?: LngLatBoundsLike
}

const MapContext = createContext<MapConfig>({
  // Map Layers
  points: [],
  stashedPoints: undefined,
  setStashedPoints: (p) => { return p },
  updateStoryPoints: (p) => { return p }
})

export const MapContextProvider = ({ children, initialPoints }: {children: ReactNode, initialPoints: Array<Feature<Point, GeoJsonProperties>>}) => {
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

  return (
    <MapContext.Provider
      value={{
        points,
        updateStoryPoints,
        stashedPoints,
        setStashedPoints,
        bounds
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMapConfig = () => {
  return useContext(MapContext)
}
