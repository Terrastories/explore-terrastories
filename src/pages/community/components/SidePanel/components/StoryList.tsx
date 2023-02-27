import React from 'react'
import styled from 'styled-components'

import Loading from 'components/Loading'

import Story from './Story'

import { useCommunity } from 'contexts/CommunityContext'

const StoryListContainer = styled.div`
overflow-x: hidden;
overflow-y: scroll;

&.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

&.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
`

export default function StoryList() {
  const { loading, stories, listView } = useCommunity()

  return (
    <StoryListContainer className={listView ? 'list' : 'grid'}>
      {loading && <Loading />}
      {!loading && stories.map((story) => (
        <Story
          key={story.id}
          story={story} />
      ))}
    </StoryListContainer>
  )
}
