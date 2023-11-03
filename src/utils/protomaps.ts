import type { StyleSpecification, SourceSpecification } from "maplibre-gl"
import layers from "protomaps-themes-base"

export function getMapLibreStyle(theme:string = "light", enable3D:boolean = false): StyleSpecification {
  const style = {
    version: 8,
    sources: {},
    layers: []
  } as StyleSpecification

  let sources = {
    protomaps: {
      type: "vector",
      url: `https://api.protomaps.com/tiles/v3.json?key=${import.meta.env.VITE_PROTOMAPS_API_KEY}`,
      attribution: "<a href='https://protomaps.com'>Protomaps</a> © <a href='https://openstreetmap.org'>OpenStreetMap</a>"
    } as SourceSpecification
  }
  let styleLayers = layers("protomaps", theme)

  if (enable3D) {
    sources = {
      ...sources,
      ...terrain3dsources()
    }

    styleLayers = [
      ...styleLayers,
      {
        id: "hills",
        type: "hillshade",
        source: "hillshading",
        layout: {"visibility": "none"}, // start with visibility turned off
        paint: {"hillshade-shadow-color": "#473B24"}
      }
    ]
  }

  style.sources = sources
  style.layers = styleLayers
  style.glyphs = "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf"

  return style
}

// Defines raster-dem terrain source.
// We are using Terrain Tiles provided by AWS Open Registry
// Since both sources use the same
function terrain3dsources() {
  return {
    terrain: {
      type: "raster-dem",
      tiles: [ "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png" ],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 18,
      minzoom: 1,
      attribution: "<a href='https://www.mapzen.com/'>Mapzen</a> an <a>Urban Computing Foundation</a> project"
    } as SourceSpecification,
    hillshading: {
      type: "raster-dem",
      tiles: [ "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png" ],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 18,
      minzoom: 1,
    } as SourceSpecification,
  }
}
