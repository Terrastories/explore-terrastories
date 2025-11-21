import React, { useMemo, useEffect } from "react"

import {createPortal} from "react-dom"
import type { Alignment, PointLike, PositionAnchor } from "maplibre-gl"

export interface MarkerMouseEvent {
  type: string
  target: any
  originalEvent: MouseEvent
  properties: object
  markerTarget: any
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
  popup?: any,

  onClick?: (e: MarkerMouseEvent) => void,
  onMouseEnter?: (e: MarkerMouseEvent) => void,

  map: any,
  mapLib: any,
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

  const marker: any = useMemo(() => {
    const hasChildren = React.Children.count(props.children)

    const MarkerClass = props.mapLib?.Marker ?? props.mapLib?.default?.Marker ?? props.mapLib

    // Only pass marker-specific options to avoid leaking map/mapLib/feature/children.
    const {
      element,
      offset,
      anchor,
      color,
      scale,
      draggable,
      clickTolerance,
      rotation,
      rotationAlignment,
      pitchAlignment,
      occludedOpacity,
      popup,
    } = props

    const mk = new MarkerClass(
      {
        element: element ?? (hasChildren ? document.createElement("div") : undefined),
        anchor: anchor ?? "center",
        offset,
        color,
        scale,
        draggable,
        clickTolerance,
        rotation,
        rotationAlignment,
        pitchAlignment,
        occludedOpacity,
        popup,
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
