import React from 'react'

import type { Projection } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { useMapConfig } from 'contexts/MapContext'
import { useCommunity } from 'contexts/CommunityContext'
import useMobile from 'hooks/useMobile'

import Brand from './components/Brand'
import HomeButton from './components/HomeButton'
import Marker from './components/Marker'
import Minimap from './components/Minimap'

import useSupercluster from './hooks/useSupercluster'
import usePopup from './hooks/usePopup'

import { ReactComponent as MarkerSVG } from './assets/marker.svg'
import { ReactComponent as ClusterSVG } from './assets/cluster.svg'

import { loadInitialMapData } from './utils/mapbox'
import type { MapData } from 'types'

import './styles.css'

export default function Map({config}: {config: MapData}) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<mapboxgl.Map | null>(null)

  const { points, updateStoryPoints, bounds } = useMapConfig()
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

      // Add Layers
      mapRef.current.once('load', () => {
        loadInitialMapData({mapRef, points, ...config})
      })

      // Add MiniMap
      if (!config.useLocalServer && !isMobile) {
        mapRef.current.addControl(new Minimap({
          containerClass: "tsMiniMap",
          style: process.env.REACT_APP_MAPBOX_STYLE || 'mapbox://styles/terrastories/clfmoky3y000q01jqkp2oz56e'
        }), "top-right");
      }

      // Add Brand Logo
      mapRef.current.addControl(new Brand({containerClass: "tsBrand"}), "top-right");

      // Add Home Control
      const homeButtonControl = new HomeButton({reset: resetMap})
      mapRef.current.addControl(homeButtonControl, 'top-right')

      // Add Navigation Control
      const nav = new mapboxgl.NavigationControl({});
      mapRef.current.addControl(nav, 'top-right')
    }
  }, [mapContainerRef, resetMap, points, mapRef, config, isMobile])

  // Initialize Popup
  const { openPopup } = usePopup(mapRef)

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
    fetchPlace(e.properties.id).then((points) => updateStoryPoints(points))
  }, [selectedPlace, fetchPlace, updateStoryPoints])

  // Create Markers from Clusters
  const markers = React.useMemo(
    () =>
      clusters.map((cluster) => {
        const map = mapRef.current as mapboxgl.Map
        const [lng, lat] = cluster.geometry.coordinates
        const el = document.createElement('div')
        el.classList.add('tsMarker')
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

  // Map Bounds Changed
  React.useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    if (bounds) {
      map.fitBounds(bounds.bounds, {center: bounds.center, padding: 50, duration: 2000.0, maxZoom: 12})
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
      {markers}
    </div>
  )
}
