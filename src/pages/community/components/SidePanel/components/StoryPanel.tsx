import React from 'react'

import { useCommunity } from 'contexts/CommunityContext'

import StoryDetail from './StoryDetail'
import StoryFilters from './StoryFilters'
import DetailCard from './DetailCard'
import StoryList from './StoryList'

import ExploreIntro from './ExploreIntro'

import { FilterOption, TypeCommunityDetails } from 'types'

type PanelProps = {
  categories: string[],
  filters: FilterOption[],
  storiesCount: number,
  details: TypeCommunityDetails,
}

export default function StoryPanel(props :PanelProps) {
  const { showIntro, selectedStory, selectedPlace } = useCommunity()

  const panelDisplay = React.useMemo(() => {
    const { categories, filters, details } = props
    if (showIntro && !selectedPlace) {
      return(<ExploreIntro details={details} />)
    } else {
      return(<>
        {selectedPlace || selectedStory
          ? <DetailCard />
          : <StoryFilters
            categories={categories}
            filters={filters} />}
        {selectedStory
          ? <StoryDetail />
          : <StoryList />}
      </>)
    }
  }, [props, showIntro, selectedStory, selectedPlace])

  return (
    <>{panelDisplay}</>
  )
}
