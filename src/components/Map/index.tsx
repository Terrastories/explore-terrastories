import React from 'react'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { FeatureCollection } from 'geojson'
import type { MapData } from 'types'

import { addMapGeoPoints, addMapImage, loadInitialMapData } from './utils/mapbox'

import HomeButton from './components/HomeButton'
import Minimap from './components/Minimap'

import './styles.css'

export default function Map({isMobile, points, config}:{isMobile: boolean, points: FeatureCollection, config: MapData}) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<mapboxgl.Map | null>(null)

  React.useEffect(() => {
    if (mapContainerRef.current != null) { // Don't try load the map if there is no container
      if (mapRef.current) return; // Only initialize the map once!

      // Set token globally
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'

      // Initialize Map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        zoom: config.zoom,
        bearing: config.bearing,
        pitch: config.pitch,
        center: config.center,
        maxBounds: config.bounds
      })

      // Load and add images (can happen before map is loaded)
      addMapImage({mapRef, url: '/place-marker.png', name: 'ts-marker'})
      addMapImage({mapRef, url: '/place-marker-cluster.png', name: 'ts-marker-cluster'})

      // Add Layers
      mapRef.current.on('load', () => {
        loadInitialMapData({mapRef, ...config})
        addMapGeoPoints({mapRef, points})
      })

      // Add MiniMap
      if (!config.useLocalServer && !isMobile) {
        mapRef.current.addControl(new Minimap({containerClass: "tsMiniMap"}), "top-right");
      }

      // Add Home Control
      const homeButtonControl = new HomeButton({...config})
      mapRef.current.addControl(homeButtonControl, 'top-right')

      // Add Navigation Control
      const nav = new mapboxgl.NavigationControl({});
      mapRef.current.addControl(nav, 'top-right')
    }
  }, [mapContainerRef, points, mapRef, config, isMobile])


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
