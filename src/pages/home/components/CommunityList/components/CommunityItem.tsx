import React from 'react'
import styled from 'styled-components'

import { Link } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import type { Projection } from 'mapbox-gl'

import { TypeCommunity } from 'types'

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
  const staticMapRef = React.useRef<mapboxgl.Map | null>(null)
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
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWxpeWEiLCJhIjoiY2lzZDVhbjM2MDAwcTJ1cGY4YTN6YmY4cSJ9.NxK9jMmYZsA32ol_IZGs5g'
      staticMapRef.current = new mapboxgl.Map({
        container: staticMapContainerRef.current,
        style: process.env.REACT_APP_MAPBOX_STYLE || 'mapbox://styles/terrastories/clfmoky3y000q01jqkp2oz56e',
        zoom: mapConfig.zoom,
        bearing: mapConfig.bearing,
        pitch: mapConfig.pitch,
        center: mapConfig.center,
        maxBounds: mapConfig.maxBounds,
        projection: {name: mapConfig.mapProjection} as Projection,
        interactive: false // ensure map is static
      })
    }

  }, [staticMapUrl, staticMapRef, mapConfig])
  return (
    <Link to={`community/${props.slug}`} className="communityItem">
      {staticMapUrl && <img src={staticMapUrl} alt={name} className='staticMapBox' />}
      {!staticMapUrl &&
        <div ref={staticMapContainerRef} style={{height: '250px'}} className='staticMapBox'></div>}
      <ItemBox>
        <h3>{name}</h3>
        <div className="noColorChange">{description}</div>
      </ItemBox>
    </Link>
  );
}
