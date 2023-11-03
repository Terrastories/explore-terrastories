import React from "react"

import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { getMapLibreStyle } from "utils/protomaps"

import { useMapConfig } from "contexts/MapContext"
import { useCommunity } from "contexts/CommunityContext"
import useMobile from "hooks/useMobile"

import Brand from "./components/Brand"
import HomeButton from "./components/HomeButton"
import Marker from "./components/Marker"
import Minimap from "./components/Minimap"

import useSupercluster from "./hooks/useSupercluster"
import usePopup from "./hooks/usePopup"

import MarkerSVG from "./assets/marker.svg?react"
import ClusterSVG from "./assets/cluster.svg?react"

import type { MapData } from "types"
import type { MapEventType } from "maplibre-gl"

import "./styles.css"

export default function Map({config}: {config: MapData}) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<maplibregl.Map | null>(null)

  const { points, updateStoryPoints, bounds, centerPoint } = useMapConfig()
  const { selectedPlace, fetchPlace, closePlaceChip } = useCommunity()

  const { isMobile } = useMobile()

  const resetMap = React.useCallback((trigger = "") => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: config.center,
        zoom: config.zoom,
        pitch: config.pitch,
        bearing: config.bearing
      }, {trigger: trigger})
    }
  }, [config])

  // Map Initialization
  React.useEffect(() => {
    if (mapContainerRef.current != null) { // Don't try load the map if there is no container
      if (mapRef.current) return // Only initialize the map once!

      // Initialize Map
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getMapLibreStyle("contrast", config.mapbox3dEnabled),
        zoom: config.zoom,
        bearing: config.bearing,
        pitch: config.pitch,
        center: config.center,
        maxBounds: config.maxBounds,
        maplibreLogo: true,
        logoPosition: "bottom-right",
      })

      // Add MiniMap
      if (!isMobile) {
        mapRef.current.addControl(new Minimap({
          containerClass: "tsMiniMap",
          style: getMapLibreStyle()
        }), "top-right")
      }

      // Add Brand Logo
      mapRef.current.addControl(new Brand({containerClass: "tsBrand"}), "top-right")

      // Add Home Control
      const homeButtonControl = new HomeButton({reset: resetMap})
      mapRef.current.addControl(homeButtonControl, "top-right")

      // Add Navigation Control
      const nav = new maplibregl.NavigationControl({visualizePitch: true})
      mapRef.current.addControl(nav, "top-right")

      // Add Terrain Control
      if (config.mapbox3dEnabled) {
        const terrain = new maplibregl.TerrainControl({
          source: "terrain",
          exaggeration: 1
        })
        mapRef.current.addControl(terrain)
      }
    }
  }, [mapContainerRef, resetMap, mapRef, config, isMobile])


  // Add Terrain Layer Handler
  React.useEffect(() => {
    // Don't do anything if Map doesn't exist yet
    if (!mapRef.current) return
    const map = mapRef.current

    const handleTerrainVisibility = (e: MapEventType) => {
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
      clusters.map((cluster) => {
        const map = mapRef.current as maplibregl.Map
        const [lng, lat] = cluster.geometry.coordinates
        const el = document.createElement("div")
        el.classList.add("tsMarker")
        if (cluster.properties.cluster) {
          return(
            <Marker element={el} feature={{...cluster.properties}} onClick={handleClusterExpansion} key={cluster.id} map={map} point={[lng, lat]}>
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
    if (selectedPlace === undefined && popup.isOpen()) closePopup()
  }, [selectedPlace, popup, closePopup])

  // Closing a popup when selectedPlace is active should reset the map.
  React.useEffect(() => {
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
      if (config.zoom !== map.getZoom())
        map.zoomTo(config.zoom, {duration: 2000.0})
    }
  }, [bounds, config])

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
