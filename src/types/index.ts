import type { LngLatBoundsLike } from 'mapbox-gl'
import { FeatureCollection } from 'geojson'

export type TypeStory = {
  title: string,
  desc?: string,
  topic?: string,
  language?: string,
  points: any
}

export type MapData = {
  useLocalServer: boolean,
  mapboxStyle?: string,
  mapbox3dEnabled: boolean,
  mapProjection: string,
  centerLat: number,
  centerLong: number,
  swBoundaryLat?: number,
  swBoundaryLong?: number,
  neBoundaryLat?: number,
  neBoundaryLong?: number,
  center: [number, number],
  bounds: LngLatBoundsLike,
  zoom: number,
  pitch: number,
  bearing: number,
}

export type TypeCommunity = {
  name: string,
  display_image?: string,
  center_long: number,
  center_lat: number,
  zoom: number,
  storiesCount: number,
  points: FeatureCollection,
  mapConfig: MapData
}
