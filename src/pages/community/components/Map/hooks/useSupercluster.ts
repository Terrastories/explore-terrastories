import { useEffect, useState } from 'react'
import type { MutableRefObject } from 'react'
import Supercluster from 'supercluster'

import type { Map } from 'mapbox-gl'

import type { GeoJsonProperties, BBox, Feature, Point } from 'geojson'

interface SuperClusterOptions<P, C> {
  mapRef: MutableRefObject<Map | null>,
  points: Array<Feature<Point, any>>,
  options?: Supercluster.Options<P, C>
}

export default function useSupercluster<
  P extends GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJsonProperties = Supercluster.AnyProps,
>({mapRef, points, options}: SuperClusterOptions<P, C>) {
  const supercluster = new Supercluster().load(points)
  const [clusters, setClusters] = useState<Array<Supercluster.ClusterFeature<any> | Supercluster.PointFeature<any>>>([])

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    const updatePointsAndClusters = () => {
      setClusters(supercluster.getClusters(map.getBounds().toArray().flat() as BBox, map.getZoom()))
    }

    map.on('load', updatePointsAndClusters)
    map.on('moveend', updatePointsAndClusters)

    return () => {
      map.off('load', updatePointsAndClusters)
      map.off('moveend', updatePointsAndClusters)
    }
  }, [supercluster, points, mapRef])

  return { supercluster, clusters }
}
