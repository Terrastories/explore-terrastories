import React from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"
import maplibregl from "maplibre-gl"

import { normalizeMapConfig, resolveMapStyle } from "utils/mapConfig"

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
  const staticMapRef = React.useRef<maplibregl.Map | null>(null)
  const {
    name,
    staticMapUrl,
    description,
    mapConfig
  } = props

  const normalizedMapConfig = React.useMemo(() => normalizeMapConfig(mapConfig), [mapConfig])
  const resolvedStyle = React.useMemo(() => resolveMapStyle(normalizedMapConfig), [normalizedMapConfig])

  React.useEffect(() => {
    // if a static map is available, use that instead
    if (staticMapUrl) return

    if (staticMapContainerRef.current != null) { // don't try to render to a non-existent container
      if (staticMapRef.current) return // only render map once

      if (resolvedStyle.accessToken) {
        (maplibregl as unknown as {accessToken?: string}).accessToken = resolvedStyle.accessToken
      } else {
        delete (maplibregl as unknown as {accessToken?: string}).accessToken
      }

      staticMapRef.current = new maplibregl.Map({
        container: staticMapContainerRef.current,
        style: resolvedStyle.style,
        zoom: normalizedMapConfig.zoom,
        bearing: normalizedMapConfig.bearing,
        pitch: normalizedMapConfig.pitch,
        center: normalizedMapConfig.center,
        maxBounds: normalizedMapConfig.maxBounds,
        attributionControl: false,
        interactive: false,
      })

      const setProjection = (staticMapRef.current as unknown as {setProjection?: (projection: string) => void}).setProjection
      if (normalizedMapConfig.mapProjection && setProjection) {
        setProjection(normalizedMapConfig.mapProjection)
      }
    }

  }, [staticMapUrl, staticMapRef, resolvedStyle, normalizedMapConfig])

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
