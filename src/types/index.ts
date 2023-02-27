import type { LngLatBoundsLike } from 'mapbox-gl'
import { FeatureCollection } from 'geojson'

export type TypeMedia = {
  contentType: string,
  blob: string,
  url: string,
}

export type ActiveStorageImage = {
  blobId: string,
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
  placenameAudio: string,
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
  maxBounds: LngLatBoundsLike | undefined,
  zoom: number,
  pitch: number,
  bearing: number,
}

export type TypeCommunityDetails = {
  name: string,
  description?: string,
  displayImage?: string,
  sponsorLogos: ActiveStorageImage[],
}

export type TypeCommunity = {
  name: string,
  slug: string,
  description?: string,
  details: TypeCommunityDetails,
  displayImage?: string,
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
