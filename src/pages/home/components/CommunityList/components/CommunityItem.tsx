import React from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"

import { normalizeMapConfig, resolveMapStyle } from "utils/mapConfig"
import { createMapboxTransformRequest } from "utils/mapbox"

import { useStyleResource } from "hooks/useStyleResource"

import { TypeCommunity } from "types"

const ItemBox = styled.div`
h3 {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: bold;
  font-size: 1.25rem;
}
div {
  color: #313232;
}
`

export default function CommunityItem(props: TypeCommunity) {
  const staticMapContainerRef = React.useRef<HTMLDivElement>(null)
  const staticMapRef = React.useRef<any>(null)
  const {
    name,
    staticMapUrl,
    description,
    mapConfig
  } = props

  const normalizedMapConfig = React.useMemo(() => normalizeMapConfig(mapConfig), [mapConfig])
  const resolvedStyle = React.useMemo(() => resolveMapStyle(normalizedMapConfig), [normalizedMapConfig])
  const { style: preparedStyle, usesExternalStyle, isReady: isStyleReady } = useStyleResource(resolvedStyle, normalizedMapConfig)

  const transformRequest = React.useMemo(() => {
    if (!resolvedStyle.isMapboxStyle || !resolvedStyle.accessToken) return undefined
    if (!usesExternalStyle) return undefined
    return createMapboxTransformRequest(resolvedStyle.accessToken)
  }, [resolvedStyle, usesExternalStyle])

  React.useEffect(() => {
    // if a static map is available, use that instead
    if (staticMapUrl) return
    if (staticMapContainerRef.current == null || !isStyleReady || !preparedStyle) return
    if (staticMapRef.current) return // only render map once

    let cancelled = false

    ;(async () => {
      await import("maplibre-gl/dist/maplibre-gl.css")
      const module = await import("maplibre-gl")
      const lib = (module as any).default ?? module
      if (cancelled) return

      // Try to get Map constructor from different possible locations
      const mapCtor = lib.Map || (lib as any).Map || lib
      staticMapRef.current = new mapCtor({
        container: staticMapContainerRef.current,
        style: preparedStyle,
        zoom: normalizedMapConfig.zoom,
        bearing: normalizedMapConfig.bearing,
        pitch: normalizedMapConfig.pitch,
        center: normalizedMapConfig.center,
        maxBounds: normalizedMapConfig.maxBounds,
        attributionControl: false,
        interactive: false,
        transformRequest,
      })

      const setProjection = (staticMapRef.current as unknown as {setProjection?: (projection: string) => void}).setProjection
      if (normalizedMapConfig.mapProjection && setProjection) {
        setProjection(normalizedMapConfig.mapProjection)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [staticMapUrl, staticMapRef, normalizedMapConfig, isStyleReady, preparedStyle, transformRequest])

  return (
    <Link to={`community/${props.slug}`} className="communityItem">
      {staticMapUrl && <img src={staticMapUrl} alt={name} className='staticMapBox' />}
      {!staticMapUrl &&
        <div ref={staticMapContainerRef} style={{height: "250px"}} className='staticMapBox'></div>}
      <ItemBox>
        <h3>{name}</h3>
        <div className="clamp noColorChange">{description}</div>
      </ItemBox>
    </Link>
  )
}
