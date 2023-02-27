import styled from 'styled-components'
import type { TypeStory } from 'types'

import Media from 'components/Media'
import Speaker from 'components/Speaker'

import { useMapConfig } from 'contexts/MapContext'
import { useCommunity } from 'contexts/CommunityContext'

import LanguageWorldIcon from './assets/language.svg'
import PinIcon from './assets/pin.svg'
import './styles.css'

const LocationPin = styled.img`
  height: 18px;
  width: 18px;
  margin-right: 0.25rem;
  vertical-align: middle;
  margin-top: -2px;
`

type Props = {
  story: TypeStory,
}

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
      <span aria-labelledby={'Go back'} role={'link'} tabIndex={0} onClick={handleCloseStoryDetail}>Go back</span>
      <h2 className={'storyHeading'}>{title}</h2>

      <div>
      {language &&
        <span className={'badge'}>
          <img src={LanguageWorldIcon} alt={'language'} />
          {language}
        </span>}
      {topic && <span className={'badge'}>{topic}</span>}
      </div>
      { places && places.map((p) => (
        <div key={p.id}>
          <LocationPin src={PinIcon} alt={p.name} />
          {p.name}
        </div>
      ))}

      <div className={'storyDetail'}>
        <section>
          { speakers && speakers.map((s) => (
            <Speaker key={s.id} {...s} />
          ))}
        </section>

        <section>{desc}</section>

        { media && media.map((m) => (
          <section key={m.blob}>
            <Media {...m} />
          </section>
        ))}
      </div>
    </>
  )
}
