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
.storyHeading {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

.storyDetail {
  overflow-y: scroll;
  overflow-wrap: break-word;
}

.storyDetail > section {
  margin: 0.5rem auto;
  padding: 1rem;

  background-color: #fff;
  box-shadow: 0 1px 4px rgba(102,102,102, 0.1);
}

.storyDetail section.heading {
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
    <StoryDetailContainer>
      <span aria-labelledby={'Go back'} role={'link'} tabIndex={0} onClick={handleCloseStoryDetail}>Go back</span>
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

      <div className={'storyDetail'}>
        <section>
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
      </div>
    </StoryDetailContainer>
  )
}
