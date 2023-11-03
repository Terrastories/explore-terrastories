import type { StyleSpecification, SourceSpecification } from "maplibre-gl"
import layers from "protomaps-themes-base"

export function getMapLibreStyle(theme:string = "light"): StyleSpecification {
  const style = {
    version: 8,
    sources: {},
    layers: []
  } as StyleSpecification

  style.sources = {
    protomaps: {
      type: "vector",
      url: `https://api.protomaps.com/tiles/v3.json?key=${import.meta.env.VITE_PROTOMAPS_API_KEY}`,
      attribution: "<a href='https://protomaps.com'>Protomaps</a> © <a href='https://openstreetmap.org'>OpenStreetMap</a>"
    } as SourceSpecification
  }
  style.layers = layers("protomaps", theme)
  style.glyphs = "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf"

  return style
}