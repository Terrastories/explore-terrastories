import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import EmptyList from 'components/EmptyList'
import Icon from 'components/Icon'
import Loading from 'components/Loading'

import Sort from './components/Sort'
import StoryListItem from './components/StoryListItem'

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

#loadMoreStoriesObserver {
  height: 1px;
  background-color: pink;
}

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
  const observerRef = React.useRef(null)

  const { loading, stories, selectedPlace, fetchPaginatedStories, listView, toggleListView } = useCommunity()

  const hasStories = stories.length > 0

  // Pagination Observer
  //
  // Available when StoryList is not loading. This will
  // attempt to fetch the next "page" of stories whenever
  // the observer is 100% in view.
  React.useEffect(() => {
    if (loading) return
    if (!observerRef.current) return

    const el = observerRef.current

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) fetchPaginatedStories()
      },
      {threshold: [1]}
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    }
  }, [loading, observerRef, fetchPaginatedStories])

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
      {!loading && !selectedPlace && !hasStories &&
        <EmptyList message={t('translation:errors.empty', {resources: t('translation:stories')})} />}
      {stories.map((story) => (
        <StoryListItem
          key={story.id}
          story={story}
          grid={!listView} />
        ))}
      {loading ?
        <Loading /> :
        <span ref={observerRef}></span>}
    </StoryListContainer>
    </>
  )
}
