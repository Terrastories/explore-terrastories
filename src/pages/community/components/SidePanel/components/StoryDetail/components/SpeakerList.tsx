import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import styled from 'styled-components'

import Avatar from 'components/Avatar'
import Icon from 'components/Icon'

import type { TypeSpeaker } from 'types'

const SpeakerListContainer = styled.section`
h4 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}
#speakerList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;

  .avatar {
    display: flex;
  }

  .details {
    flex-basis: 100%;
  }

  .name {
    font-weight: 600;
  }

  &.expanded {
    gap: 0.5rem;
  }

  .badge {
    border-radius: unset;
    padding: 0 4px;
    color: rgb(0 0 0 / 60%);
  }

  &:hover {
    cursor: pointer;
  }

  .dob {
    color: rgb(0 0 0 / 60%);
    font-size: 14px;

    svg {
      flex-shrink: 0;
      margin-top: -2px;
      vertical-align: middle;
      height: 16px;
      width: 16px;
      fill: rgb(0 0 0 / 60%);
    }
  }
}
`

export default function SpeakerList({speakers}: {speakers: TypeSpeaker[]}) {
  const { t, i18n } = useTranslation()

  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails((prev)=>!prev)
  }

  const birthInfo = (speaker: TypeSpeaker): string | undefined => {
    const { birthdate, birthplace} = speaker

    switch (true) {
      case ((!!birthdate && !!birthplace)):
        return 'info'
      case ((!!birthdate)):
        return 'date'
      case ((!!birthplace)):
        return 'location'
      default:
        return undefined
    }
  }

  const formatBirthDate = (birthdate: Date|undefined) => {
    if (!birthdate) return
    return new Date(birthdate).toLocaleDateString(i18n.resolvedLanguage, {dateStyle: 'medium', timeZone: 'UTC'})
  }

  return(
    <SpeakerListContainer>
      <h4>{t('speakers')}</h4>
      <div id="speakerList" onClick={toggleShowDetails} className={showDetails ? 'expanded' : undefined}>
        {speakers.map((s) => (
          <Avatar key={s.id} {...s} showDetails={showDetails}>
            {birthInfo(s) &&
              <div className='dob'>
                <Trans i18nKey='birth' context={birthInfo(s)}>
                {{date: formatBirthDate(s.birthdate)}}
                <Icon icon='pin' alt='pin' />
                {{location: s.birthplace?.name}}
              </Trans>
              </div>}
            {s.speakerCommunity && <span className='badge'>{s.speakerCommunity}</span>}
          </Avatar>
        ))}
      </div>
    </SpeakerListContainer>
  )
}