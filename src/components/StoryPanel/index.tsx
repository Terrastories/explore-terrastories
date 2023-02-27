import React from 'react'

import StoryFilters from 'components/StoryFilters'
import StoryList from 'components/StoryList'

import { FilterOption, CategoryOption } from 'types'

type PanelProps = {
  categories: CategoryOption[],
  filters: FilterOption[],
  storiesCount: number,
}

export default function StoryPanel(props :PanelProps) {
  const {
    categories,
    filters,
    storiesCount,
  } = props

  return (
    <>
      <StoryFilters
        categories={categories}
        filters={filters} />
      <StoryList
        totalStories={storiesCount} />
    </>
  )
}
