import React from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"
import maplibregl from "maplibre-gl"

import { getMapLibreStyle } from "utils/protomaps"

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

  React.useEffect(() => {
    // if a static map is available, use that instead
    if (staticMapUrl) return

    if (staticMapContainerRef.current != null) { // don't try to render to a non-existent container
      if (staticMapRef.current) return // only render map once

      staticMapRef.current = new maplibregl.Map({
        container: staticMapContainerRef.current,
        style: getMapLibreStyle(),
        zoom: mapConfig.zoom,
        bearing: mapConfig.bearing,
        pitch: mapConfig.pitch,
        center: mapConfig.center,
        maxBounds: mapConfig.maxBounds,
        interactive: false // ensure map is static
      })
    }

  }, [staticMapUrl, staticMapRef, mapConfig])
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
