import { afterEach, describe, expect, it, vi } from "vitest"

import {
  appendAccessToken,
  createMapboxTransformRequest,
  normalizeMapboxGlyphsUrl,
  normalizeMapboxSourceUrl,
  normalizeMapboxSpriteUrl,
  normalizeMapboxStyleUrl,
  prepareMapboxStyle,
} from "./mapbox"

describe("mapbox url helpers", () => {
  it("normalizes mapbox:// style urls to https", () => {
    expect(normalizeMapboxStyleUrl("mapbox://styles/demo/style"))
      .toBe("https://api.mapbox.com/styles/v1/demo/style")
  })

  it("normalizes sprite urls", () => {
    expect(normalizeMapboxSpriteUrl("mapbox://sprites/demo/style"))
      .toBe("https://api.mapbox.com/styles/v1/demo/style/sprite")
  })

  it("encodes glyph urls", () => {
    expect(normalizeMapboxGlyphsUrl("mapbox://fonts/demo/Open Sans/{range}.pbf"))
      .toBe("https://api.mapbox.com/fonts/v1/demo/Open%20Sans/{range}.pbf")
  })

  it("normalizes source urls and appends secure", () => {
    expect(normalizeMapboxSourceUrl("mapbox://mapbox.mapbox-streets-v8"))
      .toBe("https://api.mapbox.com/v4/mapbox.mapbox-streets-v8.json?secure=true")
  })
})

describe("createMapboxTransformRequest", () => {
  it("appends tokens for mapbox domains", () => {
    const transformer = createMapboxTransformRequest("pk.test-token")
    expect(transformer).toBeDefined()
    const transformed = transformer?.("https://api.mapbox.com/styles/v1/demo/style")
    expect(transformed?.url).toBe("https://api.mapbox.com/styles/v1/demo/style?access_token=pk.test-token")
    const ignored = transformer?.("https://example.com/style.json")
    expect(ignored).toBeUndefined()
  })
})

describe("prepareMapboxStyle", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("rewrites internal references and appends tokens", async () => {
    const mockStyle = {
      version: 8,
      name: "Demo",
      sprite: "mapbox://sprites/demo/style",
      glyphs: "mapbox://fonts/demo/{fontstack}/{range}.pbf",
      sources: {
        base: {
          type: "vector",
          url: "mapbox://mapbox.mapbox-streets-v8"
        }
      },
      layers: []
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStyle),
      status: 200,
      statusText: "OK"
    })

    vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock as any)

    const prepared = await prepareMapboxStyle("mapbox://styles/demo/style", "pk.test-token")

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.mapbox.com/styles/v1/demo/style?access_token=pk.test-token",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    expect(prepared.sprite).toBe("https://api.mapbox.com/styles/v1/demo/style/sprite?access_token=pk.test-token")
    expect(prepared.glyphs).toBe("https://api.mapbox.com/fonts/v1/demo/{fontstack}/{range}.pbf?access_token=pk.test-token")
    const baseSource = prepared.sources.base as { url?: string }
    expect(baseSource.url).toBe("https://api.mapbox.com/v4/mapbox.mapbox-streets-v8.json?secure=true&access_token=pk.test-token")
  })
})

describe("appendAccessToken", () => {
  it("avoids duplicating existing access tokens", () => {
    const url = "https://api.mapbox.com/styles/v1/demo/style?access_token=pk.test-token"
    expect(appendAccessToken(url, "pk.test-token")).toBe(url)
  })
})
