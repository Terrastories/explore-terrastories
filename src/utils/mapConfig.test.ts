import { describe, expect, it } from "vitest"

import { DEFAULT_MAP_CONFIG, normalizeMapConfig, resolveMapStyle } from "./mapConfig"

describe("resolveMapStyle", () => {
  it("uses theme style token and URL when provided", () => {
    const normalized = normalizeMapConfig({
      ...DEFAULT_MAP_CONFIG,
      mapboxStyleUrl: "mapbox://styles/example/community",
      mapboxStyleAccessToken: "pk.theme-style-token",
      mapboxStyle: "https://fallback-style"
    })

    const result = resolveMapStyle(normalized)

    expect(result.style).toBe("mapbox://styles/example/community")
    expect(result.accessToken).toBe("pk.theme-style-token")
    expect(result.usesExternalStyle).toBe(true)
    expect(result.isMapboxStyle).toBe(true)
  })

  it("falls back to base mapbox credentials when theme style is absent", () => {
    const normalized = normalizeMapConfig({
      ...DEFAULT_MAP_CONFIG,
      mapboxAccessToken: "pk.base-token",
      mapboxStyle: "mapbox://styles/example/base"
    })

    const result = resolveMapStyle(normalized)

    expect(result.style).toBe("mapbox://styles/example/base")
    expect(result.accessToken).toBe("pk.base-token")
    expect(result.usesExternalStyle).toBe(true)
    expect(result.isMapboxStyle).toBe(true)
  })

  it("uses base mapbox token for style URL when style-specific token is absent", () => {
    const normalized = normalizeMapConfig({
      ...DEFAULT_MAP_CONFIG,
      mapboxStyleUrl: "mapbox://styles/example/community",
      mapboxAccessToken: "pk.base-token"
    })

    const result = resolveMapStyle(normalized)

    expect(result.style).toBe("mapbox://styles/example/community")
    expect(result.accessToken).toBe("pk.base-token")
    expect(result.usesExternalStyle).toBe(true)
    expect(result.isMapboxStyle).toBe(true)
  })

  it("defaults to protomaps style when no mapbox styles are configured", () => {
    const normalized = normalizeMapConfig(DEFAULT_MAP_CONFIG)
    const result = resolveMapStyle(normalized)

    expect(typeof result.style).toBe("object")
    expect(result.accessToken).toBeUndefined()
    expect(result.usesExternalStyle).toBe(false)
    expect(result.isMapboxStyle).toBe(false)
  })
})
