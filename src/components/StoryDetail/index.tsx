import styled from 'styled-components'
import type { TypeStory } from 'types'

import Media from 'components/Media'
import Speaker from 'components/Speaker'

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
  handleCloseStoryDetail: () => void,
}

export default function StoryDetail(props: Props) {
  const {
    handleCloseStoryDetail,
  } = props

  const {
    title,
    topic,
    language,
    desc,
    speakers,
    media,
    places,
  } = props.story

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
          <section>
            <Media key={m.blob} {...m} />
          </section>
        ))}
      </div>
    </>
  )
}
