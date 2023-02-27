import React from 'react'
import styled from 'styled-components'

import Story from 'components/Story'
import Loading from 'components/Loading'
import Sort from 'components/Sort'

import { useCommunity } from 'contexts/CommunityContext'

import { ReactComponent as GridIcon } from './assets/grid_view.svg'
import { ReactComponent as ListIcon } from './assets/list_view.svg'

import './styles.css'

type StoryListItems = {
  totalStories: number,
}

const IconButton = styled.button`
margin: 0;
padding: 0;
border: none;
height: 24px;
width: 24px;
`

export default function StoryList({totalStories}: StoryListItems) {
  const { loading, stories, listView, toggleListView } = useCommunity()

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
      <div>There are {stories.length} of {totalStories} to explore.</div>
      <div className={`storyListContainer ${listView ? 'list' : 'grid'}`}>
        {loading && <Loading />}
        {!loading && stories.map((story) => (
          <Story
            key={story.id}
            story={story} />
        ))}
      </div>
    </>
  )
}
