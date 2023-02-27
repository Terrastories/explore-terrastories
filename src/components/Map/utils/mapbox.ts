import React from 'react';
import { FeatureCollection } from 'geojson'
import type { MapData } from 'types'

type MapImageOptions = {
  mapRef: React.MutableRefObject<any>,
  url: string,
  name: string
}

export function addMapImage({mapRef, url, name}: MapImageOptions) {
  mapRef.current.loadImage(url, (error: string, image: any) => {
    if (error) return
    if (!mapRef.current.hasImage(name)) mapRef.current.addImage(name, image)
  })
}

type LoadMapOptions = {
  mapRef: React.MutableRefObject<any>,
  localMapServer?: boolean,
  points: FeatureCollection
}

export function loadInitialMapData({
  mapRef,
  points,
  localMapServer = false,
  ...config
}: MapData & LoadMapOptions) {
  if (!mapRef.current) return

  mapRef.current.addSource(
    'terrastories-points',
    {
      type: 'geojson',
      data: points,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    }
  )

  if (!localMapServer && config.mapbox3dEnabled) {
    mapRef.current.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    })

    mapRef.current.setTerrain({'source': 'mapbox-dem'})

    mapRef.current.addLayer({
      'id': 'sky',
      'type': 'sky',
      'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
      }
    })
  }

  if (!localMapServer && config.mapProjection === "globe") {
    mapRef.current.setFog({
      'horizon-blend': 0.02,
      'star-intensity': 0.15,
      'color': '#ffffff',
      'high-color': '#008cff',
      'space-color': '#000000'
    })
  }
}

type GeoPointsOptions = {
  mapRef: React.MutableRefObject<any>,
  points?: FeatureCollection,
}

export function addMapGeoPoints({
  mapRef
}: GeoPointsOptions) {
  mapRef.current.addLayer({
    id: 'terrastories-points-layer',
    source: 'terrastories-points',
    filter: ['!', ['has', 'point_count']],
    type: 'symbol',
    layout: {
      'icon-image': 'ts-marker',
      'icon-padding': 0,
      'icon-allow-overlap': true,
      'icon-size': 0.75
    }
  })

  mapRef.current.addLayer({
    id: 'clusters',
    source: 'terrastories-points',
    filter: ['has', 'point_count'], // multiple points, cluster
    type: 'symbol',
    layout: {
      'icon-image': 'ts-marker-cluster',
      'icon-padding': 0,
      'icon-allow-overlap': true,
      'icon-size': [ // make cluster size reflect number of points within
        'interpolate',
        ['linear'],
        ['get', 'point_count'],
        // when number of points in cluster is 2, size will be 0.7 * single point
        2,
        0.7,
        // when number of points in cluster is 10 or more, size will be 0.8 * single point
        10,
        0.8
      ]
    }
  })

  mapRef.current.addLayer({
    id: 'clustercount',
    source: 'terrastories-points',
    filter: ['has', 'point_count'], // multiple points, cluster
    type: 'symbol',
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
      'text-offset': [0.2, 0.1]
      },
    paint: {
      'text-color': '#ffffff',
    }
  })
}
