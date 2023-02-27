import React from 'react'
import { useParams } from 'react-router-dom'

import { getCommunity } from 'api/communityApi'

import { MapContextProvider }  from 'contexts/MapContext'
import { CommunityProvider }  from 'contexts/CommunityContext'

import Loading from 'components/Loading'
import Map from './components/Map'
import SidePanel from './components/SidePanel'

import type { TypeCommunity } from 'types'

type UrlParamProps = {
  slug: string
}

export default function Community() {
  const [community, setCommunity] = React.useState<TypeCommunity>()

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const { slug } = useParams<UrlParamProps>();

  React.useEffect(() => {
    if (!slug) return

    getCommunity(slug)
    .then((resp) => { setCommunity(resp.data) })
    .catch(err => setError(err))
    .finally(() => setLoading(false));
  }, [slug]);

  return (
    <React.Fragment>
      {loading && <Loading />}
      {error && <div>{error}</div>}
      {community &&
        <MapContextProvider initialPoints={community.points} initialMapConfig={community.mapConfig} >
          <CommunityProvider>
            <Map />
            <SidePanel community={community} />
          </CommunityProvider>
        </MapContextProvider>
        }
    </React.Fragment>
  )
}
