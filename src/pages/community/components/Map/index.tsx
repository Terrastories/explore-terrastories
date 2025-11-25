import React from "react"

import "maplibre-gl/dist/maplibre-gl.css"

import { getMapLibreStyle } from "utils/protomaps"
import { normalizeMapConfig, resolveMapStyle } from "utils/mapConfig"
import { createMapboxTransformRequest, normalizeMapboxStyleUrl, appendAccessToken } from "utils/mapbox"

import { useMapConfig } from "contexts/MapContext"
import { useCommunity } from "contexts/CommunityContext"
import useMobile from "hooks/useMobile"
import { useStyleResource } from "hooks/useStyleResource"

import Brand from "./components/Brand"
import Marker from "./components/Marker"
import Minimap from "mapgl-minimap"
import homeIcon from "./components/HomeButton/home-icon.svg"

import useSupercluster from "./hooks/useSupercluster"
import usePopup from "./hooks/usePopup"

import MarkerSVG from "./assets/marker.svg?react"
import ClusterSVG from "./assets/cluster.svg?react"

import type { MapData } from "types"

import "./styles.css"

export default function Map({config}: {config?: MapData}) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<any>(null)
  const terrainControlRef = React.useRef<any>(null)
  const mapLibRef = React.useRef<any>(null)
  const mapKindRef = React.useRef<"mapbox" | "maplibre" | null>(null)
  const [mapReady, setMapReady] = React.useState(false)

  const { points, updateStoryPoints, bounds, centerPoint } = useMapConfig()
  const { selectedPlace, fetchPlace, closePlaceChip } = useCommunity()

  const { isMobile } = useMobile()

  const normalizedConfig = React.useMemo(() => normalizeMapConfig(config), [config])
  const resolvedStyle = React.useMemo(() => resolveMapStyle(normalizedConfig), [normalizedConfig])
  const { style: preparedStyle, usesExternalStyle, isReady: isStyleReady } = useStyleResource(resolvedStyle, normalizedConfig)

  const transformRequest = React.useMemo(() => {
    if (!resolvedStyle.isMapboxStyle || !resolvedStyle.accessToken) return undefined
    if (!usesExternalStyle) return undefined
    return createMapboxTransformRequest(resolvedStyle.accessToken)
  }, [resolvedStyle, usesExternalStyle])

  // Mapbox GL v3 requires a token even for non-Mapbox styles. Avoid selecting it when the
  // credentials are missing (e.g., when useStyleResource fell back to Protomaps).
  const shouldUseMapboxLib = React.useMemo(
    () => resolvedStyle.isMapboxStyle && Boolean(resolvedStyle.accessToken),
    [resolvedStyle]
  )

  const canUseRawMapboxStyle = React.useMemo(() => {
    return shouldUseMapboxLib && typeof resolvedStyle.style === "string" && Boolean(resolvedStyle.accessToken)
  }, [shouldUseMapboxLib, resolvedStyle])

  // Choose which rendering library we want for the current style outcome.
  const desiredMapKind = React.useMemo<"mapbox" | "maplibre">(
    () => (shouldUseMapboxLib && usesExternalStyle ? "mapbox" : "maplibre"),
    [shouldUseMapboxLib, usesExternalStyle]
  )

  // Only allow initialization when we have a usable style for the chosen library.
  const hasUsableStyle = React.useMemo(() => {
    if (preparedStyle != null) return true
    return desiredMapKind === "mapbox" && canUseRawMapboxStyle
  }, [preparedStyle, desiredMapKind, canUseRawMapboxStyle])

  const loadMapLibrary = React.useCallback(async (useMapbox: boolean) => {
    if (useMapbox) {
      const module = await import("mapbox-gl")
      const mapboxgl = (module as any).default ?? module
      await import("mapbox-gl/dist/mapbox-gl.css")
      return { lib: mapboxgl, kind: "mapbox" as const }
    }

    const module = await import("maplibre-gl")
    const maplibre = (module as any).default ?? module
    return { lib: maplibre, kind: "maplibre" as const }
  }, [])

  const resetMap = React.useCallback((trigger = "") => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: normalizedConfig.center,
        zoom: normalizedConfig.zoom,
        pitch: normalizedConfig.pitch,
        bearing: normalizedConfig.bearing
      }, {trigger: trigger})
    }
  }, [normalizedConfig])
  // Map Initialization
  React.useEffect(() => {
    if (mapContainerRef.current == null || !hasUsableStyle) return
    if (mapRef.current && mapKindRef.current === desiredMapKind) return // Already initialized with the right library.

    let cancelled = false
    terrainControlRef.current = null

    ;(async () => {
      const { lib, kind } = await loadMapLibrary(desiredMapKind === "mapbox")
      if (cancelled) return

      if (kind === "mapbox" && resolvedStyle.accessToken) {
        (lib as any).accessToken = resolvedStyle.accessToken
      }

      const mapOptions: any = {
        container: mapContainerRef.current,
        style: preparedStyle,
        zoom: normalizedConfig.zoom,
        bearing: normalizedConfig.bearing,
        pitch: normalizedConfig.pitch,
        center: normalizedConfig.center,
        maxBounds: normalizedConfig.maxBounds,
        logoPosition: "bottom-right",
        validateStyle: false,
      }

      const styleForMap = (() => {
        // If useStyleResource has already prepared a style (including a fallback
        // Protomaps style when Mapbox fetch retries failed), use it directly.
        if (preparedStyle) return preparedStyle

        if (kind === "mapbox" && canUseRawMapboxStyle) {
          const rawStyleUrl = appendAccessToken(
            normalizeMapboxStyleUrl(resolvedStyle.style as string),
            resolvedStyle.accessToken as string
          )

          // No prepared style available (e.g., loader still in-flight); let Mapbox GL
          // fetch the raw style URL itself.
          return rawStyleUrl
        }

        return preparedStyle
      })()

      if (kind === "maplibre") {
        mapOptions.maplibreLogo = true
        mapOptions.transformRequest = transformRequest
      } else if (kind === "mapbox" && resolvedStyle.accessToken) {
        mapOptions.accessToken = resolvedStyle.accessToken
      }
      mapOptions.style = styleForMap

      const mapCtor = (lib as any).Map ?? lib
      const mapInstance = new mapCtor(mapOptions)
      mapRef.current = mapInstance
      mapLibRef.current = lib
      mapKindRef.current = kind
      setMapReady(true)

      const setProjection = (mapInstance as {setProjection?: (projection: string) => void}).setProjection
      if (kind === "maplibre" && normalizedConfig.mapProjection && setProjection) {
        if (mapInstance.once) {
          mapInstance.once("style.load", () => setProjection(normalizedConfig.mapProjection!))
        } else {
          setProjection(normalizedConfig.mapProjection)
        }
      }

      // Add MiniMap using the same library instance
      if (!isMobile && kind === "maplibre") {
        mapInstance.addControl(new Minimap(lib as any, {
          containerClass: "tsMiniMap",
          style: getMapLibreStyle(),
          toggleDisplay: true,
        }), "top-right")
      }

      mapInstance.addControl(new Brand({containerClass: "tsBrand"}), "top-right")
      const NavControl = (lib as any).NavigationControl ?? (lib as any).default?.NavigationControl
      if (NavControl) {
        const nav = new NavControl({visualizePitch: true})
        mapInstance.addControl(nav, "top-right")

        // Inject a home button at the top of the nav control stack
        const navContainer: HTMLElement | undefined = (nav as any)._container
        if (navContainer) {
          const homeBtn = document.createElement("button")
          homeBtn.type = "button"
          homeBtn.className = "maplibregl-ctrl-icon ts-home-btn"
          homeBtn.setAttribute("aria-label", "Map Home")
          homeBtn.style.backgroundImage = `url(${homeIcon})`
          homeBtn.style.backgroundSize = "18px 18px"
          homeBtn.addEventListener("click", () => resetMap())
          navContainer.insertBefore(homeBtn, navContainer.firstChild)
        }
      }
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      mapLibRef.current = null
      mapKindRef.current = null
      setMapReady(false)
    }
  }, [mapContainerRef, resetMap, normalizedConfig, isMobile, hasUsableStyle, preparedStyle, transformRequest, loadMapLibrary, resolvedStyle.isMapboxStyle, resolvedStyle.accessToken, resolvedStyle.style, usesExternalStyle, shouldUseMapboxLib, canUseRawMapboxStyle, desiredMapKind])

  // If the prepared style arrives later (e.g., after Mapbox fetch fails) or the
  // desired rendering library changes, rebuild the map or swap styles so the
  // fallback Protomaps style is actually applied.
  React.useEffect(() => {
    if (!mapRef.current) return

    const currentKind = mapKindRef.current
    const targetKind = desiredMapKind

    // Switch libraries if the style outcome requires it (e.g., Mapbox error -> Protomaps fallback).
    if (currentKind && currentKind !== targetKind) {
      mapRef.current.remove()
      mapRef.current = null
      mapLibRef.current = null
      terrainControlRef.current = null
      mapKindRef.current = null
      setMapReady(false)
      return
    }

    // If we now have a prepared style for the existing map, apply it so the map updates.
    if (preparedStyle && mapRef.current?.setStyle) {
      mapRef.current.setStyle(preparedStyle)
    }
  }, [preparedStyle, desiredMapKind])

  React.useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const shouldEnableTerrain = normalizedConfig.mapbox3dEnabled && !usesExternalStyle
    if (!shouldEnableTerrain) {
      if (terrainControlRef.current) {
        map.removeControl(terrainControlRef.current)
        terrainControlRef.current = null
      }
      return
    }

    const addTerrainControlIfAvailable = () => {
      if (terrainControlRef.current) return
      if (!map.getSource("terrain")) return

      const TerrainControl = mapLibRef.current?.TerrainControl
      if (!TerrainControl) return

      terrainControlRef.current = new TerrainControl({
        source: "terrain",
        exaggeration: 1
      })

      map.addControl(terrainControlRef.current)
    }

    if (map.isStyleLoaded()) {
      addTerrainControlIfAvailable()
    }

    map.on("styledata", addTerrainControlIfAvailable)

    return () => {
      map.off("styledata", addTerrainControlIfAvailable)
    }
  }, [normalizedConfig.mapbox3dEnabled, usesExternalStyle, mapReady])
  // Add Terrain Layer Handler
  React.useEffect(() => {
    // Don't do anything if Map doesn't exist yet
    if (!mapRef.current) return
    const map = mapRef.current

    const handleTerrainVisibility = (e: any) => {
      if (map.getLayer("hills")) {
        const hillshading = map.getLayoutProperty("hills", "visibility")

        if (e.terrain && hillshading === "none") {
          map.setLayoutProperty("hills", "visibility", "visible")
        } else {
          map.setLayoutProperty("hills", "visibility", "none")
        }
      }
    }
    map.on("terrain", handleTerrainVisibility)

    return () => {
      map.off("terrain", handleTerrainVisibility)
    }
  }, [mapReady])

  // Initialize Popup with the correct library instance
  const { popup, openPopup, closePopup } = usePopup(mapRef, mapLibRef)

  // Cluster and Point Handlers
  const { supercluster, clusters } = useSupercluster({mapRef, points})

  const handleClusterExpansion = React.useCallback((e: any) => {
    if (!mapRef.current) return
    const map = mapRef.current

    map.easeTo({
      zoom: supercluster.getClusterExpansionZoom(e.properties.cluster_id),
      center: e.markerTarget.getLngLat(),
      duration: 2000
    })

  }, [supercluster, mapRef])

  const handlePointClick = React.useCallback((e: any) => {
    if (selectedPlace && (selectedPlace.id === e.properties.id)) return
    fetchPlace(e.properties.id).then((points) => updateStoryPoints(points, true))
  }, [selectedPlace, fetchPlace, updateStoryPoints])

  // Create Markers from Clusters
  const markers = React.useMemo(
    () =>
      (mapReady && mapRef.current && mapLibRef.current ? clusters : []).map((cluster) => {
        const map = mapRef.current as any
        const [lng, lat] = cluster.geometry.coordinates
        const el = document.createElement("div")
        el.classList.add("tsMarker")
        if (cluster.properties.cluster) {
          return(
            <Marker element={el} feature={{...cluster.properties}} onClick={handleClusterExpansion} key={cluster.id} map={map} mapLib={mapLibRef.current} point={[lng, lat]}>
              <ClusterSVG />
              <span>{cluster.properties.point_count_abbreviated}</span>
            </Marker>
          )
        }
        return(
          <Marker
            element={el}
            onMouseEnter={openPopup}
            onClick={handlePointClick}
            key={cluster.id}
            map={map}
            mapLib={mapLibRef.current}
            point={[lng, lat]}
            offset={[10, -11]}
            feature={{id: cluster.id, ...cluster.properties}}
          >
            <MarkerSVG />
          </Marker>
        )
      }),
    [clusters, openPopup, mapRef, handleClusterExpansion, handlePointClick, mapReady, mapLibRef]
  )

  // Close popup if selectedPlace is changed to undefined and popup is open.
  React.useEffect(() => {
    if (selectedPlace === undefined && popup && popup.isOpen()) closePopup()
  }, [selectedPlace, popup, closePopup])

  // Closing a popup when selectedPlace is active should reset the map.
  React.useEffect(() => {
    if (!popup) return

    function resetMapMarkersOnPopupClose() {
      if (selectedPlace !== undefined) {
        closePlaceChip().then((pts) => updateStoryPoints(pts))
      }
    }
    popup.on("close", resetMapMarkersOnPopupClose)

    return () => {
      popup.off("close", resetMapMarkersOnPopupClose)
    }
  }, [popup, selectedPlace, closePlaceChip, updateStoryPoints])

  // Map Bounds Changed
  React.useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    if (bounds) {
      map.fitBounds(bounds.bounds, {center: bounds.center, padding: 50, duration: 2000.0, maxZoom: 12})
    } else {
      if (normalizedConfig.zoom !== map.getZoom())
        map.zoomTo(normalizedConfig.zoom, {duration: 2000.0})
    }
  }, [bounds, normalizedConfig])

  // Map Center Changed
  React.useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    if (centerPoint) {
      map.flyTo({center: centerPoint, duration: 3000.0})
    }
  }, [centerPoint])

  return (
    <div ref={mapContainerRef} className={isMobile ? "enableMapHeader" : ""} style={{
      position: "fixed",
      height: isMobile ? "calc(100% - 90px)" : "100%",
      width: "100%",
      left: 0,
      top: 0,
    }}>
      {markers}
    </div>
  )
}
