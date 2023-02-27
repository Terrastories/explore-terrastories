import React from 'react'

import mapboxgl, { GeoJSONSource, Projection, LngLatBoundsLike } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import bbox from '@turf/bbox'

import { FeatureCollection } from 'geojson'
import type { MapData } from 'types'

import { addMapGeoPoints, addMapImage, loadInitialMapData } from './utils/mapbox'

import HomeButton from './components/HomeButton'
import Minimap from './components/Minimap'

import usePopup from './hooks/usePopup'
import './styles.css'

export default function Map({isMobile, points, config}:{isMobile: boolean, points: FeatureCollection, config: MapData}) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<mapboxgl.Map | null>(null)

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

  React.useEffect(() => {
    if (mapContainerRef.current != null) { // Don't try load the map if there is no container
      if (mapRef.current) return; // Only initialize the map once!

      // Set token globally
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'

      // Initialize Map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: config.zoom,
        bearing: config.bearing,
        pitch: config.pitch,
        center: config.center,
        maxBounds: config.bounds,
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
        mapRef.current.addControl(new Minimap({containerClass: "tsMiniMap"}), "top-right");
      }

      // Add Home Control
      const homeButtonControl = new HomeButton({reset: resetMap})
      mapRef.current.addControl(homeButtonControl, 'top-right')

      // Add Navigation Control
      const nav = new mapboxgl.NavigationControl({});
      mapRef.current.addControl(nav, 'top-right')
    }
  }, [mapContainerRef, resetMap, points, mapRef, config, isMobile])

  const { popup } = usePopup(mapRef, 'terrastories-points-layer')

  React.useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Mouse Cursors
    map.on('mouseenter', 'terrastories-points-layer', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'terrastories-points-layer', () => {
      map.getCanvas().style.cursor = ''
    })
    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = ''
    })
  })

  // frame updated
  React.useEffect(() => {
    if (popup.isOpen()) popup.remove()
    if (points.features.length === 0) return

    if (!mapRef.current) return
    if (!mapRef.current.loaded()) return

    const map = mapRef.current
    const source = map.getSource('terrastories-points') as GeoJSONSource
    if (!source) return
    source.setData(points)
  }, [points, popup])

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
