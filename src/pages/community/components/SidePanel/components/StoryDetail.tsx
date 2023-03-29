import styled from 'styled-components'

import Media from 'components/Media'
import Avatar from 'components/Avatar'

import { useCommunity } from 'contexts/CommunityContext'

import type { TypeStory } from 'types'

const SpeakersList = styled.section`
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > * {
    width: 30%;
  }
`

const StoryDetailContainer = styled.div`
overflow-x: hidden;
overflow-y: auto;
margin-bottom: auto;

& > section {
  margin: 0.5rem auto;
  padding: 1rem;

  background-color: #fff;
  box-shadow: 0 1px 4px rgba(102,102,102, 0.1);
}
`

export default function StoryDetail() {
  const { selectedStory } = useCommunity()

  const {
    desc,
    speakers,
    media,
  } = selectedStory as TypeStory

  return (
    <>
    <SpeakersList>
      { speakers && speakers.map((s) => (
        <Avatar key={s.id} badge={'Speaker'} {...s} />
      ))}
    </SpeakersList>
    <StoryDetailContainer>
      { desc &&
        <section>{desc}</section>}

      { media && media.map((m) => (
        <section key={m.blob}>
          <Media {...m} />
        </section>
      ))}
    </StoryDetailContainer>
    </>
  )
}
