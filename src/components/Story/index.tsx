import type { TypeStory } from 'types'

import './styles.css'

type Props = {
  story: TypeStory,
}

export default function Story(props: Props) {
  return (
    <div className={'storyListItem'}>
      <h2>{props.story.title}</h2>
      <p>{props.story.desc}</p>
      <div>{props.story.language}</div>
    </div>
  );
}
