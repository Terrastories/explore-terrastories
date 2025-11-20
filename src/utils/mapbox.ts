import type { RequestTransformFunction, SourceSpecification, StyleSpecification } from "maplibre-gl"

import { getMapLibreStyle } from "./protomaps"

const MAPBOX_PROTOCOL = "mapbox://"
const MAPBOX_API_BASE = "https://api.mapbox.com"

const enum MapboxPath {
  Styles = "styles/",
  Sprites = "sprites/",
  Fonts = "fonts/",
}

const hasAccessToken = (url: string) => /[?&]access_token=/.test(url)

export const appendAccessToken = (url: string, token: string) => {
  if (!token || hasAccessToken(url)) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}access_token=${token}`
}

const splitPathAndQuery = (url: string) => {
  const [path, query] = url.split("?")
  return { path, query: query ? `?${query}` : "" }
}

export const normalizeMapboxStyleUrl = (styleUrl: string) => {
  if (!styleUrl.startsWith(MAPBOX_PROTOCOL)) return styleUrl

  const withoutProtocol = styleUrl.replace(`${MAPBOX_PROTOCOL}${MapboxPath.Styles}`, "")
  const { path, query } = splitPathAndQuery(withoutProtocol)
  return `${MAPBOX_API_BASE}/styles/v1/${path}${query}`
}

export const normalizeMapboxSpriteUrl = (spriteUrl: string) => {
  if (!spriteUrl.startsWith(MAPBOX_PROTOCOL)) return spriteUrl

  const withoutProtocol = spriteUrl.replace(`${MAPBOX_PROTOCOL}${MapboxPath.Sprites}`, "")
  const { path, query } = splitPathAndQuery(withoutProtocol)
  return `${MAPBOX_API_BASE}/styles/v1/${path}/sprite${query}`
}

export const normalizeMapboxGlyphsUrl = (glyphsUrl: string) => {
  if (!glyphsUrl.startsWith(MAPBOX_PROTOCOL)) return glyphsUrl

  const withoutProtocol = glyphsUrl.replace(`${MAPBOX_PROTOCOL}${MapboxPath.Fonts}`, "")
  const { path, query } = splitPathAndQuery(withoutProtocol)
  const encodedPath = path
    .split("/")
    .map((segment) => segment.includes("{") ? segment : encodeURIComponent(segment))
    .join("/")

  return `${MAPBOX_API_BASE}/fonts/v1/${encodedPath}${query}`
}

export const normalizeMapboxSourceUrl = (sourceUrl: string) => {
  if (!sourceUrl.startsWith(MAPBOX_PROTOCOL)) return sourceUrl

  const withoutProtocol = sourceUrl.replace(MAPBOX_PROTOCOL, "")
  const { path, query } = splitPathAndQuery(withoutProtocol)
  const queryParams = new URLSearchParams(query)
  if (!queryParams.has("secure")) {
    queryParams.set("secure", "true")
  }

  const basePath = path.endsWith(".json") ? path : `${path}.json`
  const queryString = queryParams.toString()
  return `${MAPBOX_API_BASE}/v4/${basePath}${queryString ? `?${queryString}` : ""}`
}

export const createMapboxTransformRequest = (token?: string): RequestTransformFunction | undefined => {
  if (!token) return undefined

  return (url: string) => {
    if (!url.includes("api.mapbox.com")) return

    const normalizedUrl = appendAccessToken(url, token)
    return { url: normalizedUrl }
  }
}

const sourceHasUrl = (source: SourceSpecification): source is SourceSpecification & { url: string } => {
  return typeof (source as { url?: unknown }).url === "string"
}

export const prepareMapboxStyle = async (styleUrl: string, token: string): Promise<StyleSpecification> => {
  const normalizedStyleUrl = appendAccessToken(normalizeMapboxStyleUrl(styleUrl), token)
  const response = await fetch(normalizedStyleUrl)

  if (!response.ok) {
    throw new Error(`Failed to load Mapbox style: ${response.status} ${response.statusText}`)
  }

  const styleSpec = await response.json() as StyleSpecification

  if (typeof styleSpec.sprite === "string") {
    const spriteUrl = normalizeMapboxSpriteUrl(styleSpec.sprite)
    styleSpec.sprite = appendAccessToken(spriteUrl, token)
  }

  if (typeof styleSpec.glyphs === "string") {
    const glyphsUrl = normalizeMapboxGlyphsUrl(styleSpec.glyphs)
    styleSpec.glyphs = appendAccessToken(glyphsUrl, token)
  }

  if (styleSpec.sources) {
    Object.values(styleSpec.sources).forEach((source) => {
      if (source && sourceHasUrl(source)) {
        if (source.url.startsWith(MAPBOX_PROTOCOL) || source.url.includes("api.mapbox.com")) {
          const normalizedSource = source.url.startsWith(MAPBOX_PROTOCOL)
            ? normalizeMapboxSourceUrl(source.url)
            : source.url

          source.url = appendAccessToken(normalizedSource, token)
        }
      }
    })
  }

  return styleSpec
}

export const getFallbackStyle = (pmBasemapStyle: string, mapbox3dEnabled: boolean) => {
  return getMapLibreStyle(pmBasemapStyle, mapbox3dEnabled)
}
