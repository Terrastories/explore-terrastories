import React, { useMemo, useEffect } from "react"

import {createPortal} from "react-dom"
import maplibregl, {Map as MapLibreMap, Marker as MapLibreMarker, MapLibreEvent } from "maplibre-gl"

import type { Alignment, PointLike, PositionAnchor } from "maplibre-gl"

export interface MarkerMouseEvent extends MapLibreEvent<MouseEvent> {
  originalEvent: MouseEvent
  properties: object
  markerTarget: MapLibreMarker
}

type MarkerProps = {
  element?: HTMLElement,
  offset?: PointLike,
  anchor?: PositionAnchor,
  color?: string,
  scale?: number,
  draggable?: boolean,
  clickTolerance?: number,
  rotation?: number,
  rotationAlignment?: Alignment,
  pitchAlignment?: Alignment,
  occludedOpacity?: number,
  popup?: maplibregl.Popup,

  onClick?: (e: MarkerMouseEvent) => void,
  onMouseEnter?: (e: MarkerMouseEvent) => void,

  map: MapLibreMap,
  point: [number, number],
  feature: object,
  children?: React.ReactNode
}

const defaultProps: Partial<MarkerProps> = {
  feature: {}
}

function Marker(props: MarkerProps) {
  const { map } = props
  const thisRef = React.useRef({props})
  thisRef.current.props = props

  const marker: MapLibreMarker = useMemo(() => {
    const hasChildren = React.Children.count(props.children)

    const mk = new maplibregl.Marker(
      {
        element: (hasChildren ? document.createElement("div") : undefined),
        anchor: "center",
        ...props,
      }
    ).setLngLat(props.point)

    mk.getElement().addEventListener("click", (e: MouseEvent) => {
      thisRef.current.props.onClick?.({
        type: "click",
        target: map,
        originalEvent: e,
        properties: props.feature,
        markerTarget: mk
      })
    })

    mk.getElement().addEventListener("mouseenter", (e: MouseEvent) => {
      thisRef.current.props.onMouseEnter?.({
        type: "mouseenter",
        target: map,
        originalEvent: e,
        properties: props.feature,
        markerTarget: mk
      })
    })

    return mk
  }, [map, props])

  useEffect(() => {
    marker.addTo(map)

    return () => { marker.remove() }
  }, [map, marker])

  if (props.offset && (marker.getOffset() === props.offset)) {
    marker.setOffset(props.offset)
  }

  if (marker.getPopup() !== props.popup) {
    marker.setPopup(props.popup)
  }

  return createPortal(props.children, marker.getElement())
}

Marker.defaultProps = defaultProps

export default React.memo(Marker)
