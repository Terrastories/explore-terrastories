import styled from 'styled-components'

import Media from 'components/Media'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'

import { useMapConfig } from 'contexts/MapContext'
import { useCommunity } from 'contexts/CommunityContext'

import type { TypeStory } from 'types'

type Props = {
  story: TypeStory,
}

const StoryDetailContainer = styled.div`
overflow-x: hidden;
overflow-y: auto;

.speakersList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;

  & > * {
    width: 30%;
  }
}

.storyHeading {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

& > section {
  margin: 0.5rem auto;
  padding: 1rem;

  background-color: #fff;
  box-shadow: 0 1px 4px rgba(102,102,102, 0.1);
}

& section.heading {
  font-family: 'OpenSansCondensed-Bold';
}

.iconGroup {
  display: flex;
  align-items: center;
}
`

export default function StoryDetail({story}: Props) {
  const { setSelectedStory } = useCommunity()
  const { stashedPoints, setStashedPoints, updateStoryPoints } = useMapConfig()

  const {
    title,
    topic,
    language,
    desc,
    speakers,
    media,
    places,
  } = story

  function handleCloseStoryDetail() {
    setSelectedStory(undefined)
    if (stashedPoints) {
      updateStoryPoints(stashedPoints)
      setStashedPoints(undefined)
    }
  }

  return (
    <>
      <div>
        <h2 className={'storyHeading'}>{title}</h2>

        <div>
        {language &&
          <span className={'badge'}>
            <Icon icon={'language'} alt={'language'} />
            {language}
          </span>}
        {topic && <span className={'badge'}>{topic}</span>}
        </div>
        { places && places.map((p) => (
          <div key={p.id} className={'iconGroup'}>
            <Icon icon={'pin'} alt={p.name} />
            {p.name}
          </div>
        ))}
      </div>
      <StoryDetailContainer>
        <section className='speakersList'>
          { speakers && speakers.map((s) => (
            <Avatar key={s.id} badge={'Speaker'} {...s} />
          ))}
        </section>

        <section>{desc}</section>

        { media && media.map((m) => (
          <section key={m.blob}>
            <Media {...m} />
          </section>
        ))}
      </StoryDetailContainer>
      <span aria-labelledby={'Go back'} role={'link'} tabIndex={0} onClick={handleCloseStoryDetail}>Go back</span>
    </>
  )
}
