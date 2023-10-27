import React, { createContext, useContext, useState, ReactNode } from "react"

import type { LngLatLike, LngLatBoundsLike } from "mapbox-gl"
import type { GeoJsonProperties, Feature, Point } from "geojson"

import bbox from "@turf/bbox"
import center from "@turf/center"
import {featureCollection} from "@turf/helpers"

type MapBounds = {
  bounds: LngLatBoundsLike,
  center: LngLatLike
}

interface MapConfig {
  points: Array<Feature<Point, GeoJsonProperties>>
  stashedPoints: Array<Feature<Point, GeoJsonProperties>> | undefined
  setStashedPoints: (points: Array<Feature<Point, GeoJsonProperties>> | undefined) => void
  updateStoryPoints: (newPoints: Array<Feature<Point, GeoJsonProperties>>, updateBounds?: boolean) => void
  bounds?: MapBounds
  moveCenter: (point: Feature<Point, GeoJsonProperties>) => void
  centerPoint?: LngLatLike
}

const MapContext = createContext<MapConfig>({
  // Map Layers
  points: [],
  stashedPoints: undefined,
  setStashedPoints: (p) => { return p },
  updateStoryPoints: (p) => { return p },
  moveCenter: () => { return }
})

export const MapContextProvider = ({ children, initialPoints }: {children: ReactNode, initialPoints: Array<Feature<Point, GeoJsonProperties>>}) => {
  const [points, setPoints] = useState<Array<Feature<Point, GeoJsonProperties>>>(initialPoints)
  const [stashedPoints, setStashedPoints] = useState<Array<Feature<Point, GeoJsonProperties>>>()

  const [bounds, setBounds] = useState<MapBounds>()

  const [centerPoint, setCenterPoint] = useState<LngLatLike>()

  function updateStoryPoints(newPoints: Array<Feature<Point, GeoJsonProperties>>, updateBounds: boolean = false) {
    setPoints(newPoints)
    if (updateBounds) {
      const bounds = featureCollection(newPoints)
      setBounds({
        bounds: bbox(bounds) as LngLatBoundsLike,
        center: center(bounds).geometry.coordinates as LngLatLike
      })
      setCenterPoint(undefined)
    } else {
      setBounds(undefined)
    }
  }

  function moveCenter(point: Feature<Point, GeoJsonProperties>) {
    setCenterPoint(point.geometry.coordinates as LngLatLike)
  }

  return (
    <MapContext.Provider
      value={{
        points,
        updateStoryPoints,
        stashedPoints,
        setStashedPoints,
        bounds,
        centerPoint,
        moveCenter,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMapConfig = () => {
  return useContext(MapContext)
}
