import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import type { TypeStory } from 'types'

import './styles.css'

type Props = {
  story: TypeStory
}

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
    <div className={'storyListItem'} onClick={handleStoryClick} data-story-id={story.id}>
      <h2>{story.title}</h2>
      <p className={'clamp'}>{story.desc}</p>
      <div>{story.language}</div>
    </div>
  )
}
