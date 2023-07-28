import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import EmptyList from 'components/EmptyList'
import Icon from 'components/Icon'
import Loading from 'components/Loading'

import Sort from './Sort'
import Story from './Story'

import { useCommunity } from 'contexts/CommunityContext'

const IconButton = styled.button`
margin: 0;
padding: 0;
border: none;
max-height: 24px;
max-width: 24px;
`

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

const StoryListContainer = styled.div`
margin-bottom: auto;
overflow-x: hidden;
overflow-y: auto;

&.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.25rem;
}

&.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 0.25rem;
}
`

export default function StoryList() {
  const { t } = useTranslation(['community', 'translation'])
  const { loading, stories, listView, toggleListView } = useCommunity()

  const hasStories = stories.length > 0
  return (
    <>
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
    <StoryListContainer className={listView ? 'list' : 'grid'}>
      {loading && <Loading />}
      {!loading && !hasStories &&
        <EmptyList message={t('translation:errors.empty', {resources: t('translation:stories')})} />}
      {!loading && stories.map((story) => (
        <Story
          key={story.id}
          story={story} />
      ))}
    </StoryListContainer>
    </>
  )
}
