import React from 'react'

import { useCommunity } from 'contexts/CommunityContext'

import StoryDetail from './StoryDetail'
import StoryFilters from './StoryFilters'
import DetailCard from './DetailCard'
import StoryList from './StoryList'

import { FilterOption } from 'types'

type PanelProps = {
  categories: string[],
  filters: FilterOption[],
  storiesCount: number,
}

export default function StoryPanel(props :PanelProps) {
  const { categories, filters } = props
  const { selectedStory, selectedPlace } = useCommunity()

  return (
    <>
      {selectedPlace || selectedStory
        ? <DetailCard />
        : <StoryFilters
          categories={categories}
          filters={filters} />}
      {selectedStory
        ? <StoryDetail />
        : <StoryList />}
    </>
  )
}
