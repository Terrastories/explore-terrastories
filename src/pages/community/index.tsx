import React from "react"
import { Await, defer, useLoaderData, useAsyncValue } from "react-router-dom"
import type { LoaderFunctionArgs } from "react-router-dom"
import { useTranslation } from "react-i18next"

import NotFound from "components/NotFound"

import { getCommunity } from "api/communityApi"

import { MapContextProvider, useMapConfig }  from "contexts/MapContext"
import { CommunityProvider, useCommunity }  from "contexts/CommunityContext"

import Loading from "components/Loading"
import Map from "./components/Map"
import SidePanel from "./components/SidePanel"

import type { TypeCommunity } from "types"

type UrlParamProps = {
  slug: string
}

type CommunityThing = {
  community: Promise<TypeCommunity>
}

export async function communityLoader({request, params}: LoaderFunctionArgs) {
  const typedParamns = params as UrlParamProps

  return defer({community: getCommunity(typedParamns.slug).then((resp) => resp.data)})
}

function Provider() {
  const { t, i18n } = useTranslation()
  const { updateStoryPoints, setStashedPoints } = useMapConfig()
  const { resetSelections, slug } = useCommunity()

  const communityRef = React.useRef(slug)

  const community = useAsyncValue() as TypeCommunity

  const updateBrowserTitle = React.useCallback(() => {
    let title = t("explore") + " Terrastories"
    if (community.name)
      title += " | " + community.name
    document.title =  title
  }, [t, community])

  // Ensure browser title is updated on community first render
  React.useEffect(() => {
    updateBrowserTitle()
  }, [updateBrowserTitle])

  // Ensure browser title is updated every time langauge is changed
  React.useEffect(() => {
    i18n.on("languageChanged", updateBrowserTitle)
    return () => {
      i18n.off("languageChanged", updateBrowserTitle)
    }
  }, [i18n, updateBrowserTitle])

  React.useEffect(() => {
    if (communityRef.current !== community.slug ) {
      communityRef.current = community.slug

      resetSelections()
      setStashedPoints(undefined)
      updateStoryPoints(community.points)
    }
  }, [communityRef, community, updateStoryPoints, setStashedPoints, resetSelections])

  return (
    <React.Fragment>
      <Map key={community.slug} config={community.mapConfig} />
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
        errorElement={<NotFound />}>
        {(community) => (
          <CommunityProvider slug={community.slug}>
            <MapContextProvider initialPoints={community.points}>
              <Provider />
            </MapContextProvider>
          </CommunityProvider>
        )}
      </Await>
    </React.Suspense>
  )
}
