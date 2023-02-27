import styled from 'styled-components'

import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import type { TypeStory } from 'types'

type Props = {
  story: TypeStory
}

const StoryListItem = styled.div`
padding: 1rem;

background-color: #fff;
box-shadow: 0 1px 4px rgb(102 102 102 / 10%);

&:hover {
  cursor: pointer;
  box-shadow: 0 0 4px 2px rgb(102 102 102 / 20%);
}

h2 {
  font-size: 1.25rem;
}
`

export default function Story({story}: Props) {
  const { fetchStory } = useCommunity()
  const { setStashedPoints, updateStoryPoints, points } = useMapConfig()

  const handleStoryClick = (e: React.MouseEvent) => {
    const clickedStory = e.currentTarget.getAttribute('data-story-id')
    if (!clickedStory) return
    handleStorySelection(clickedStory)
  }

  function handleStorySelection(storyId: string) {
    fetchStory(storyId)
      .then((newPoints) => {
        if (newPoints) {
          setStashedPoints(points)
          updateStoryPoints(newPoints)
        }
      })
  }

  return (
    <StoryListItem onClick={handleStoryClick} data-story-id={story.id}>
      <h2>{story.title}</h2>
      <p className={'clamp'}>{story.desc}</p>
      <div>{story.language}</div>
    </StoryListItem>
  )
}
