import React from 'react'
import styled from 'styled-components'

import { useCommunity } from 'contexts/CommunityContext'

import Icon from 'components/Icon'

import Sort from './Sort'
import StoryFilters from './StoryFilters'
import StoryList from './StoryList'

import { FilterOption, CategoryOption } from 'types'

type PanelProps = {
  categories: CategoryOption[],
  filters: FilterOption[],
  storiesCount: number,
}

const StoryListControl = styled.div`
display: flex;
justify-content: flex-end;
align-items: flex-end;
margin: 1rem 0;

.controlsGroup {
  display: flex;
  white-space: nowrap;
  opacity: 1;
}
`
const IconButton = styled.button`
margin: 0;
padding: 0;
border: none;
max-height: 24px;
max-width: 24px;
`


export default function StoryPanel(props :PanelProps) {
  const {
    categories,
    filters,
    storiesCount,
  } = props
  const { stories, listView, toggleListView } = useCommunity()

  return (
    <>
      <StoryFilters
        categories={categories}
        filters={filters} />
      <StoryListControl>
        <div className={`controlsGroup`}>
          <Sort />
          <IconButton type='button' onClick={toggleListView}>
            { listView ?
              <Icon icon='grid' alt={'switch to grid view'} /> :
              <Icon icon='list' alt={'switch to list view'} /> }
          </IconButton>
        </div>
      </StoryListControl>
      <div>There are {stories.length} of {storiesCount} to explore.</div>
      <StoryList />
    </>
  )
}
