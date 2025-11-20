import type { StyleSpecification } from "maplibre-gl"

import type { MapData } from "types"

import { getMapLibreStyle } from "./protomaps"

type Sanitizable = string | null | undefined

const sanitizeString = (value: Sanitizable) => {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const DEFAULT_MAP_CONFIG: MapData = {
  useLocalServer: false,
  mapbox3dEnabled: false,
  pmApiKey: "",
  pmBasemapStyle: "contrast",
  center: [0, 0],
  maxBounds: undefined,
  zoom: 0,
  pitch: 0,
  bearing: 0,
  mapProjection: "mercator",
}

export type NormalizedMapConfig = Omit<MapData, "mapboxAccessToken" | "mapboxStyle" | "mapboxStyleUrl" | "mapboxStyleAccessToken" | "mapProjection"> & {
  mapboxAccessToken?: string,
  mapboxStyle?: string,
  mapboxStyleUrl?: string,
  mapboxStyleAccessToken?: string,
  mapProjection?: string,
}

export const normalizeMapConfig = (config?: MapData | null): NormalizedMapConfig => {
  const merged = {
    ...DEFAULT_MAP_CONFIG,
    ...(config ?? {}),
  }

  return {
    ...merged,
    mapboxAccessToken: sanitizeString(config?.mapboxAccessToken) ?? sanitizeString(merged.mapboxAccessToken),
    mapboxStyle: sanitizeString(config?.mapboxStyle) ?? sanitizeString(merged.mapboxStyle),
    mapboxStyleUrl: sanitizeString(config?.mapboxStyleUrl) ?? sanitizeString(merged.mapboxStyleUrl),
    mapboxStyleAccessToken: sanitizeString(config?.mapboxStyleAccessToken) ?? sanitizeString(merged.mapboxStyleAccessToken),
    mapProjection: sanitizeString(config?.mapProjection) ?? sanitizeString(merged.mapProjection) ?? undefined,
  }
}

export type ResolvedMapStyle = {
  style: string | StyleSpecification,
  accessToken?: string,
  usesExternalStyle: boolean,
  isMapboxStyle: boolean,
}

export const resolveMapStyle = (config: NormalizedMapConfig): ResolvedMapStyle => {
  if (config.mapboxStyleUrl && config.mapboxStyleAccessToken) {
    return {
      style: config.mapboxStyleUrl ?? config.mapboxStyle ?? getMapLibreStyle(config.pmBasemapStyle, config.mapbox3dEnabled),
      accessToken: config.mapboxStyleAccessToken,
      usesExternalStyle: true,
      isMapboxStyle: true,
    }
  }

  if (config.mapboxAccessToken && config.mapboxStyle) {
    return {
      style: config.mapboxStyle,
      accessToken: config.mapboxAccessToken,
      usesExternalStyle: true,
      isMapboxStyle: true,
    }
  }

  return {
    style: getMapLibreStyle(config.pmBasemapStyle, config.mapbox3dEnabled),
    usesExternalStyle: false,
    isMapboxStyle: false,
  }
}
