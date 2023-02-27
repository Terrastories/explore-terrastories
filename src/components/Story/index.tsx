import type { TypeStory } from 'types'

export default function Story(props: TypeStory) {
  return (
    <div>
      {props.title}
      {props.desc}
    </div>
  );
}
