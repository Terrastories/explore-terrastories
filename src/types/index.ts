import type { LngLatBoundsLike } from 'mapbox-gl'
import { FeatureCollection } from 'geojson'

export type TypeMedia = {
  contentType: string,
  blob: string,
  url: string,
}

export type TypeSpeaker = {
  id: number,
  name: string,
  photoUrl: string,
  speakerCommunity: string,
}

export type TypePlace = {
  id: number,
  name: string,
  description: string,
  typeOfPlace: string,
  region: string,
  nameAudioUrl: string,
  photoUrl: string,
}

export type TypeStory = {
  id: number,
  title: string,
  desc?: string,
  topic?: string,
  language?: string,
  points: any,
  media: TypeMedia[],
  speakers: TypeSpeaker[],
  places: TypePlace[],
  createdAt: string,
  updatedAt: string
}

export type MapData = {
  useLocalServer: boolean,
  mapboxAccessToken?: string,
  mapboxStyle?: string,
  mapbox3dEnabled: boolean,
  mapProjection: string,
  center: [number, number],
  bounds: LngLatBoundsLike,
  zoom: number,
  pitch: number,
  bearing: number,
}

export type TypeCommunity = {
  name: string,
  slug: string,
  display_image?: string,
  storiesCount: number,
  categories: CategoryOption[],
  filters: FilterOption[],
  points: FeatureCollection,
  mapConfig: MapData
}

export interface CategoryOption {
  label: string
  value: string
}

export interface FilterOption {
  label: string
  value: string
  category: string
}

export type BoundingBoxFrame = {
  bounds?: any,
  maxZoom?: number
}
