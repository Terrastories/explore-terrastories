import styled from 'styled-components'

import Media from 'components/Media'

import { useCommunity } from 'contexts/CommunityContext'

import type { TypeStory } from 'types'

const StoryDetailContainer = styled.div`
overflow-x: hidden;
overflow-y: auto;
margin-bottom: auto;

& > section {
  margin: 0.5rem auto;
  padding: 1rem;

  background-color: #fff;
  box-shadow: 0 1px 4px rgba(102,102,102, 0.1);
  overflow-wrap: break-word;
  white-space: pre-wrap;
}
`

export default function StoryDetail() {
  const { selectedStory } = useCommunity()

  const {
    desc,
    media,
  } = selectedStory as TypeStory

  return (
    <StoryDetailContainer>
      { desc &&
        <section>{desc}</section>}

      { media && media.map((m) => (
        <section key={m.blob}>
          <Media {...m} />
        </section>
      ))}
    </StoryDetailContainer>
  )
}
