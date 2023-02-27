import React from 'react'
import { useParams } from 'react-router-dom'

import http from 'utils/http'

import Loading from 'components/Loading'
import Map from 'components/Map'
import Header from 'components/Header'
import StoryPanel from 'components/StoryPanel'

import type { TypeCommunity } from 'types'
import { FeatureCollection } from 'geojson'

type UrlParamProps = {
  slug: string
}

export default function Community() {
  const [width, setWidth] = React.useState<number>(window.innerWidth)

  const [community, setCommunity] = React.useState<TypeCommunity>()
  const [points, setPoints] = React.useState<FeatureCollection>({type: "FeatureCollection", features:[]})

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const isMobile = width <= 768

  const {
    slug
  } = useParams<UrlParamProps>();

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  const handleStoriesChange = React.useCallback((newPoints: FeatureCollection) => {
    setPoints(newPoints)
  },[])

  React.useEffect(() => {
    http.get(`/api/communities/${slug}`)
    .then((resp) => {
      setCommunity(resp.data)
      setPoints(resp.data.points)
    })
    .catch(err => setError(err))
    .finally(() => setLoading(false));
  }, [slug]);

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  })

  return (
    <React.Fragment>
      {loading && <Loading />}
      {error && <div>{error}</div>}
      {community &&
        <React.Fragment>
          {isMobile &&
            <Header isMobile={isMobile} />
          }
          <Map
            isMobile={isMobile}
            points={points}
            config={community.mapConfig} />
          <StoryPanel
            isMobile={isMobile}
            handleStoriesChange={handleStoriesChange}
            communitySlug={community.slug}
            communityDetails={community.details}
            categories={community.categories}
            filters={community.filters}
            points={points}
            storiesCount={community.storiesCount} />
        </React.Fragment>
        }
    </React.Fragment>
  )
}