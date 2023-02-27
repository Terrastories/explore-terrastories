import React from 'react'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import "./styles.css"

type MapData = {
  mapbox_style?: string,
  mapbox_3d?: boolean,
  map_projection?: string,
  center_lat: number,
  center_long: number,
  sw_boundary_lat?: number,
  sw_boundary_long?: number,
  ne_boundary_lat?: number,
  ne_boundary_long?: number,
  zoom: number,
  pitch?: number,
  bearing?: number,
}

export default function Map({isMobile, community}:{isMobile: boolean, community: MapData}) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<mapboxgl.Map | null>(null)

  React.useEffect(() => {
    if (mapContainerRef.current != null) {
      if (map.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        accessToken: "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [community.center_long, community.center_lat],
        zoom: community.zoom,
      })
      const nav = new mapboxgl.NavigationControl({});
      map.current.addControl(nav, 'top-right');
    }
  }, [mapContainerRef, map, community])

  return (
    <div ref={mapContainerRef} className={isMobile ? "enableMapHeader" : ""} style={{
      position: "fixed",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
    }}>
    </div>
  )
}
