import type { TypeStory } from 'types'

import './styles.css'

type Props = {
  story: TypeStory,
  handleCloseStoryDetail: () => void,
}

export default function StoryDetail(props: Props) {
  const {
    story,
    handleCloseStoryDetail,
  } = props

  return (
    <div>
      <span aria-labelledby={'Go back'} role={'link'} tabIndex={0} onClick={handleCloseStoryDetail}>Go back</span>
      <div className={'storyDetail'}>
        <h2>{story.title}</h2>
        <p>{story.desc}</p>
        <div>{story.language}</div>
      </div>
    </div>
  );
}
