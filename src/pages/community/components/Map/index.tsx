import React from 'react'

import type { GeoJSONSource, Projection, MapLayerMouseEvent } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { useMapConfig } from 'contexts/MapContext'
import { useCommunity } from 'contexts/CommunityContext'
import useMobile from 'hooks/useMobile'

import Brand from './components/Brand'
import HomeButton from './components/HomeButton'
import Minimap from './components/Minimap'

import usePopup from './hooks/usePopup'
import usePointerCursor from './hooks/usePointerCursor'

import { addMapGeoPoints, addMapImage, loadInitialMapData } from './utils/mapbox'

import './styles.css'

export default function Map() {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<mapboxgl.Map | null>(null)

  const { points, updateStoryPoints, bounds, ...config } = useMapConfig()
  const { selectedPlace, fetchPlace } = useCommunity()

  const isMobile = useMobile()

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
      if (mapRef.current) return; // Only initialize the map once!

      // Set token globally
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'

      // Initialize Map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: process.env.REACT_APP_MAPBOX_STYLE || 'mapbox://styles/terrastories/clfmoky3y000q01jqkp2oz56e',
        zoom: config.zoom,
        bearing: config.bearing,
        pitch: config.pitch,
        center: config.center,
        maxBounds: config.maxBounds,
        projection: {name: config.mapProjection} as Projection
      })

      // Load and add images (can happen before map is loaded)
      addMapImage({mapRef, url: '/place-marker.png', name: 'ts-marker'})
      addMapImage({mapRef, url: '/place-marker-cluster.png', name: 'ts-marker-cluster'})

      // Add Layers
      mapRef.current.once('load', () => {
        loadInitialMapData({mapRef, points, ...config})
        addMapGeoPoints({mapRef})
      })

      // Add MiniMap
      if (!config.useLocalServer && !isMobile) {
        mapRef.current.addControl(new Minimap({
          containerClass: "tsMiniMap",
          style: process.env.REACT_APP_MAPBOX_STYLE || 'mapbox://styles/terrastories/clfmoky3y000q01jqkp2oz56e'
        }), "top-right");
      }

      mapRef.current.addControl(new Brand({containerClass: "tsBrand"}), "top-right");

      // Add Home Control
      const homeButtonControl = new HomeButton({reset: resetMap})
      mapRef.current.addControl(homeButtonControl, 'top-right')

      // Add Navigation Control
      const nav = new mapboxgl.NavigationControl({});
      mapRef.current.addControl(nav, 'top-right')
    }
  }, [mapContainerRef, resetMap, points, mapRef, config, isMobile])

  usePopup(mapRef, 'terrastories-points-layer')
  usePointerCursor(mapRef, ['terrastories-points-layer', 'clusters'])

  // Cluster or Place Marker Events
  React.useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    function handleClusterExpansion(e: MapLayerMouseEvent) {
      if (!e.features) return
      const feature = e.features[0]

      if (feature.properties && feature.properties.cluster_id) {
        const clusterId = feature.properties.cluster_id
        const source = map.getSource(feature.source) as GeoJSONSource

        source.getClusterExpansionZoom(clusterId, (error, zoom) => {
          if (!error && feature.geometry.type === 'Point')
            map.easeTo({center: feature.geometry.coordinates as [number, number], zoom: zoom, duration: 2000})
        })
      }
    }

    function handlePointClick(e: MapLayerMouseEvent) {
      if (!e.features) return

      const feature = e.features[0]
      if (!feature.id) return

      if (selectedPlace && selectedPlace.id === feature.id ) return
      fetchPlace(feature.id).then((points) => updateStoryPoints(points))
    }

    map.on('click', 'clusters', handleClusterExpansion)
    map.on('click', 'terrastories-points-layer', handlePointClick)

    return () => {
      map.off('click', 'clusters', handleClusterExpansion)
      map.off('click', 'terrastories-points-layer', handlePointClick)
    }
  }, [selectedPlace, fetchPlace, updateStoryPoints])

  // points updated
  React.useEffect(() => {
    if (points.features.length === 0) return

    if (!mapRef.current) return
    if (!mapRef.current.loaded()) return

    const map = mapRef.current
    const source = map.getSource('terrastories-points') as GeoJSONSource
    if (!source) return
    source.setData(points)
  }, [points])

  // bounds updated
  React.useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    if (bounds) {
      map.fitBounds(bounds, {padding: 50, duration: 2000.0, maxZoom: 12})
    }
  }, [bounds])

  return (
    <div ref={mapContainerRef} className={isMobile ? 'enableMapHeader' : ''} style={{
      position: 'fixed',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
    }}>
    </div>
  )
}
