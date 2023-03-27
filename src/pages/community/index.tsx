import React from 'react'
import { Await, defer, useLoaderData, useAsyncValue } from 'react-router-dom'
import type { LoaderFunctionArgs } from 'react-router-dom'

import { getCommunity } from 'api/communityApi'

import { MapContextProvider, useMapConfig }  from 'contexts/MapContext'
import { CommunityProvider, useCommunity }  from 'contexts/CommunityContext'

import Loading from 'components/Loading'
import Map from './components/Map'
import SidePanel from './components/SidePanel'

import type { TypeCommunity } from 'types'

type UrlParamProps = {
  slug: string
}

type CommunityThing = {
  community: Promise<TypeCommunity>
}

export async function communityLoader({request, params}: LoaderFunctionArgs) {
  let typedParamns = params as UrlParamProps

  return defer({community: getCommunity(typedParamns.slug).then((resp) => resp.data)})
}

function Provider() {
  const { updateStoryPoints, setMapConfig, setStashedPoints } = useMapConfig()
  const { resetSelections, slug } = useCommunity()

  const communityRef = React.useRef(slug)

  const community = useAsyncValue() as TypeCommunity

  React.useEffect(() => {
    if (communityRef.current !== community.slug ) {
      communityRef.current = community.slug

      resetSelections()
      setMapConfig(community.mapConfig)
      setStashedPoints(undefined)
      updateStoryPoints(community.points)
    }
  }, [communityRef, community, updateStoryPoints, setMapConfig, setStashedPoints, resetSelections])

  return (
    <React.Fragment>
      <Map />
      <SidePanel community={community} />
    </React.Fragment>
  )
}

export default function Community() {
  const data = useLoaderData() as CommunityThing

  return (
      <React.Suspense fallback={<Loading/>}>
        <Await
          resolve={data.community}
          errorElement={<div>Oops</div>}>
            {(community) => (

              <CommunityProvider slug={community.slug}>
                <MapContextProvider initialPoints={community.points} initialMapConfig={community.mapConfig}>
                  <Provider />
                </MapContextProvider>
              </CommunityProvider>
            )}
        </Await>
      </React.Suspense>
  )
}
