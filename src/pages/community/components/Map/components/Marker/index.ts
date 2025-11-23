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
  feature?: object,
  children?: React.ReactNode
}

function Marker({
  feature = {},
  ...props
}: MarkerProps) {
  // Reconstruct props object for compatibility with existing code
  const allProps = { ...props, feature }
  const { map } = allProps
  const thisRef = React.useRef({props: allProps})
  thisRef.current.props = allProps

  const marker: any = useMemo(() => {
    const hasChildren = React.Children.count(allProps.children)

    const MarkerClass = allProps.mapLib?.Marker ?? allProps.mapLib?.default?.Marker ?? allProps.mapLib

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
    } = allProps

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
    ).setLngLat(allProps.point)

    mk.getElement().addEventListener("click", (e: MouseEvent) => {
      thisRef.current.props.onClick?.({
        type: "click",
        target: map,
        originalEvent: e,
        properties: allProps.feature,
        markerTarget: mk
      })
    })

    mk.getElement().addEventListener("mouseenter", (e: MouseEvent) => {
      thisRef.current.props.onMouseEnter?.({
        type: "mouseenter",
        target: map,
        originalEvent: e,
        properties: allProps.feature,
        markerTarget: mk
      })
    })

    return mk
  }, [map, allProps])

  useEffect(() => {
    marker.addTo(map)

    return () => { marker.remove() }
  }, [map, marker])

  if (allProps.offset && (marker.getOffset() === allProps.offset)) {
    marker.setOffset(allProps.offset)
  }

  if (marker.getPopup() !== allProps.popup) {
    marker.setPopup(allProps.popup)
  }

  return createPortal(allProps.children, marker.getElement())
}

export default React.memo(Marker)
