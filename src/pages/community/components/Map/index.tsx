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
import HomeButton from "./components/HomeButton"
import Marker from "./components/Marker"
import Minimap from "mapgl-minimap"

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
    if (mapContainerRef.current == null || !isStyleReady || !preparedStyle) return
    if (mapRef.current) return // Only initialize the map once!

    let cancelled = false
    terrainControlRef.current = null

    ;(async () => {
      const { lib, kind } = await loadMapLibrary(resolvedStyle.isMapboxStyle)
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

      const styleForMap = kind === "mapbox" && resolvedStyle.isMapboxStyle && typeof resolvedStyle.style === "string"
        ? appendAccessToken(normalizeMapboxStyleUrl(resolvedStyle.style), resolvedStyle.accessToken ?? "")
        : preparedStyle

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
      const homeButtonControl = new HomeButton({reset: resetMap})
      mapInstance.addControl(homeButtonControl, "top-right")
      const NavControl = (lib as any).NavigationControl ?? (lib as any).default?.NavigationControl
      if (NavControl) {
        const nav = new NavControl({visualizePitch: true})
        mapInstance.addControl(nav, "top-right")
      }
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      mapLibRef.current = null
      setMapReady(false)
    }
  }, [mapContainerRef, resetMap, normalizedConfig, isMobile, isStyleReady, preparedStyle, transformRequest, loadMapLibrary, resolvedStyle.isMapboxStyle])

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
  }, [normalizedConfig.mapbox3dEnabled, usesExternalStyle])
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
  }, [])

  // Initialize Popup
  const { popup, openPopup, closePopup } = usePopup(mapRef)

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
    [clusters, openPopup, mapRef, handleClusterExpansion, handlePointClick]
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
