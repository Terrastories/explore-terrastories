import React from 'react'
import styled from 'styled-components'

import Story from 'components/Story'
import Loading from 'components/Loading'

import Sort from 'components/Sort'

import { ReactComponent as GridIcon } from './assets/grid_view.svg'
import { ReactComponent as ListIcon } from './assets/list_view.svg'

import { TypeStory } from 'types'
import './styles.css'

type StoryListItems = {
  stories: TypeStory[],
  loading: boolean,
  showStories: boolean,
  totalStories: number,
  filteredStoriesCount: number,
  sorts: {[value: string]: any},
  defaultSort: string,
  handleSortOnlyChange: (sort: string) => void,
  handleStorySelection: (storyId: string) => void,
}

const IconButton = styled.button`
margin: 0;
padding: 0;
border: none;
height: 24px;
width: 24px;
`

export default function StoryList(props: StoryListItems) {
  let {
    stories,
    defaultSort,
    sorts,
    loading,
    showStories,
    totalStories,
    filteredStoriesCount,
    handleSortOnlyChange,
    handleStorySelection,
  } = props

  const [listView, setListView] = React.useState<boolean>(true)

  const toggleListView = () => {
    setListView(!listView)
  }

  const handleSortChange = (sort: string) => {
    handleSortOnlyChange(sort)
  }

  const handleStoryClick = (e: React.MouseEvent) => {
    const clickedStory = e.currentTarget.getAttribute('data-story-id')
    if (!clickedStory) return
    handleStorySelection(clickedStory)
  }

  return (
    <>
      <div className={'storyListControls'}>
        <div className={`controlsGroup`}>
          <Sort />
          <IconButton type='button' onClick={toggleListView}>
            { listView ?
              <GridIcon className={'icon'} /> :
              <ListIcon className={'icon'} /> }
          </IconButton>
        </div>
      </div>
      <div>There are {filteredStoriesCount} of {totalStories} to explore.</div>
      <div className={`storyListContainer ${listView ? 'list' : 'grid'}`}>
        {loading && <Loading />}
        {!loading && stories.map((story) => (
          <Story
            key={story.id}
            story={story}
            handleStoryClick={handleStoryClick} />
        ))}
      </div>
    </>
  )
}
