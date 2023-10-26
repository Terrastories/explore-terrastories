import type { LngLatBoundsLike } from 'mapbox-gl'
import { Feature, Point } from 'geojson'

export type TypeMedia = {
  contentType: string,
  blob: string,
  url: string,
}

export type ActiveStorageImage = {
  blobId: string,
  url: string,
}

export type TypePlace = {
  id: number,
  name: string,
  description: string,
  typeOfPlace: string,
  region: string,
  placenameAudio: string,
  photoUrl: string
  center?: Feature<Point>,
}

export type TypeSpeaker = {
  id: number,
  name: string,
  photoUrl: string,
  speakerCommunity: string,
  birthdate: Date,
  birthplace: TypePlace,
}

export type TypeStory = {
  id: number,
  title: string,
  desc?: string,
  topic?: string,
  language?: string,
  points: Array<Feature<Point, any>>,
  media: TypeMedia[],
  mediaContentTypes?: string[],
  mediaPreviewUrl?: string,
  speakers: TypeSpeaker[],
  interviewer?: TypeSpeaker,
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
  staticMapUrl?: string,
  storiesCount: number,
  categories: string[],
  filters: FilterOption[],
  points: Array<Feature<Point, any>>,
  mapConfig: MapData
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

export type PaginationMeta = {
  limit?: number,
  offset?: number | null,
  sort_by?: string,
  sort_dir?: string,
  [key: string]: any,
}
