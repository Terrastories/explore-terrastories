import styled from 'styled-components'

import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import Icon from 'components/Icon'

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
  margin: 0;
  word-break: break-word;
}
`

const StoryMeta = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 0.5rem;

span {
  display: flex;
  align-items: center;
  font-size: 0.8rem;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;

  svg {
    flex-shrink: 0;
    height: 18px;
    width: 18px;
  }
}
`

const MediaTypesIndicators = styled.span`
svg {
  fill: #606060;
  vertical-align: middle;
  height: 18px;
  width: 18px;
  margin: 2px;
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
      <StoryMeta>
        <span>
          <Icon icon={'language'} alt={'language'} />
          {story.language}
        </span>
        {story.mediaContentTypes &&
          <MediaTypesIndicators>
            {story.mediaContentTypes.map((m) => (
              <Icon key={m} icon={m} alt={m} />
            ))}
          </MediaTypesIndicators>}
      </StoryMeta>
      <h2 className='clampTitle' title={story.title}>
        {story.title}
      </h2>
      <p className={'clamp'}>{story.desc}</p>
    </StoryListItem>
  )
}
