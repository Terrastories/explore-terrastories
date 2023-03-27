import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import EmptyList from 'components/EmptyList'

import { useCommunity } from 'contexts/CommunityContext'

import Icon from 'components/Icon'

import Sort from './Sort'
import StoryFilters from './StoryFilters'
import PlaceDetailCard from './PlaceDetailCard'
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
  const { t } = useTranslation(['community', 'common'])
  const {
    categories,
    filters,
    storiesCount,
  } = props
  const { selectedPlace, listView, toggleListView } = useCommunity()

  const hasStories = storiesCount > 0;

  return (
    <>
      {selectedPlace
        ? <PlaceDetailCard />
        : <StoryFilters
          categories={categories}
          filters={filters} />}
      <StoryListControl>
        <div className={`controlsGroup`}>
          <Sort />
          <IconButton type='button' onClick={toggleListView}>
            { listView ?
              <Icon icon='grid' alt={t('switch_to_grid')} /> :
              <Icon icon='list' alt={t('switch_to_list')} /> }
          </IconButton>
        </div>
      </StoryListControl>
      {hasStories && <StoryList />}
      {!hasStories &&
        <EmptyList message={t('common:errors.empty', {resources: t('common:stories')})} />}
    </>
  )
}
