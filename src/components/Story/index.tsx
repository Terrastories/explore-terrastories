import type { TypeStory } from 'types'

import './styles.css'

type Props = {
  story: TypeStory,
  handleStoryClick: (e: React.MouseEvent) => void,
}

export default function Story(props: Props) {
  const {
    story,
    handleStoryClick,
  } = props

  return (
    <div className={'storyListItem'} onClick={handleStoryClick} data-story-id={story.id}>
      <h2>{story.title}</h2>
      <p className={'clamp'}>{story.desc}</p>
      <div>{story.language}</div>
    </div>
  );
}
