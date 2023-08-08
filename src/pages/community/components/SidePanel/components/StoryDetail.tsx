import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Media from 'components/Media'
import Avatar from 'components/Avatar'

import { useCommunity } from 'contexts/CommunityContext'

import type { TypeStory } from 'types'

const SpeakersList = styled.section<{$itemCount: number}>`
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  position: sticky;
  top: -2px;

  &[stuck] {
    padding: 0.25rem 1rem 1rem;
    flex-wrap: nowrap;
    gap: 0;

    // Avatar Card
    > * {
      display: flex;
      flex: 1;
      max-width: ${props => (props.$itemCount > 5 ? 15 : 25)}px;
      flex-wrap: nowrap;
      align-items: center;
      gap: 2px;

      // Avatar Image
      > img {
        height: 30px;
        max-width: 30px;
        min-width: 30px;
      }

      // Name
      > div {
        visibility: collapse;
        text-wrap: nowrap;
      }

      // Hide Badge
      > span {
        display: none;
      }

      &:hover {
        flex: 15;
        max-width: max-content;

        > img {
          border: 1px solid orange;
        }

        > div {
          visibility: visible;
          text-wrap: nowrap;
        }
      }
    }
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
  const { t } = useTranslation()
  const { selectedStory } = useCommunity()

  const {
    desc,
    speakers,
    media,
  } = selectedStory as TypeStory

  const speakerCount = speakers.length

  useEffect(() => {
    const el = document.querySelector('#speakerList')

    if (el === null) return

    const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
      {threshold: [1]}
    );

    observer.observe(el);
  }, [])

  return (
    <StoryDetailContainer>
      <SpeakersList id="speakerList" $itemCount={speakerCount}>
        { speakers && speakers.map((s) => (
          <Avatar key={s.id} badge={t('speaker')} {...s} />
        ))}
      </SpeakersList>
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
