import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Avatar from 'components/Avatar'
import CollapsibleContainer from 'components/CollapsibleContainer'
import Icon from 'components/Icon'

import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import type { TypeStory, TypePlace } from 'types'

const DetailCardContainer = styled.div`
position: relative;

background-color: #fff;
box-shadow: 0 1px 4px rgb(102 102 102 / 10%);

padding: 0.5rem 0.5rem 2rem;
margin-top: 1rem;

// Customize CollapsibleContent
// variable sizing for Speaker content
// when "collapsed" we want to show the avatars as small circles.
// when "expanded" we want to show them larger w/ name & role
#speakerList {
  display: flex;
}
input:not(:checked) ~ .content > #speakerList {
  img {
    width: 2rem;
    height: 2rem;
  }
  > * {
    max-width: 10%;
  }
}
input:checked ~ .content > #speakerList {
  > * {
    width: 25%;
  }
}

.placesGrid {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5rem;
  font-size: 0.9rem;
}

.iconGroup {
  display: flex;
  align-items: center;
}

div {
  p {
    padding: 0.2rem;
    padding-top: 0.5rem;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
}
`
const Heading = styled.div`
h1 {
  font-size: 20px;
  margin: 0;
  padding: 0.5rem;
}
`

const CloseButton = styled.button`
position: absolute;
top: -10px;
right: -10px;
border: none;
border-radius: 50%;
background: rgb(255 255 255);
cursor: pointer;
padding: 0;
height: 20px;
width: 20px;

&:hover {
  background: rgb(205 205 205);
}
`

export default function DetailCard() {
  const { t } = useTranslation()
  const { closePlaceChip, selectedPlace, selectedStory, setSelectedStory,  } = useCommunity()
  const { updateStoryPoints, stashedPoints, setStashedPoints } = useMapConfig()

  function handleClosePlaceDetail() {
    closePlaceChip().then((points) => updateStoryPoints(points))
  }

  function handleCloseStoryDetail() {
    setSelectedStory(undefined)
    if (stashedPoints) {
      updateStoryPoints(stashedPoints)
      setStashedPoints(undefined)
    }
  }

  if (selectedStory) {
    const {
      title,
      topic,
      language,
      places,
      speakers,
    } = selectedStory as TypeStory
    return (
      <DetailCardContainer>
        <CloseButton aria-labelledby={t('close')} onClick={handleCloseStoryDetail}><Icon icon={'close'} alt={t('close')} /></CloseButton>
        <Heading>
          <div>
          {language &&
            <span className={'badge'}>
              <Icon icon={'language'} alt={'language'} />
              {language}
            </span>}
          {topic && <span className={'badge'}>{topic}</span>}
          </div>
          <h1 className={'storyHeading'}>
            {selectedPlace &&
              <>
                <span role='link' aria-labelledby={t('close')} onClick={handleCloseStoryDetail}>{selectedPlace.name}</span>
                {" > "}
              </>}
            {title}
          </h1>
        </Heading>
        <div>

          { places &&
            <div className='placesGrid'>
              {places.map((p) => (
                <div key={p.id} className={'iconGroup'}>
                  <Icon icon={'pin'} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              ))}
              </div>}
          </div>

          <CollapsibleContainer contentHeight="2rem">
            <div id="speakerList" className="content">
              { speakers && speakers.map((s) => (
                <Avatar key={s.id} badge={t('speaker')} {...s} />
              ))}
            </div>
          </CollapsibleContainer>
      </DetailCardContainer>
    )
  }

  if (selectedPlace) {
    const {
      name,
      description,
      region,
      typeOfPlace,
    } = selectedPlace as TypePlace
    return (
      <DetailCardContainer>
        <CloseButton onClick={handleClosePlaceDetail} aria-labelledby={t('close')}><Icon icon={'close'} alt={t('close')} /></CloseButton>
        <Heading>
          <h1>{name}</h1>
        </Heading>
        {region && <span className="badge">{region}</span>}
        {typeOfPlace && <span className="badge">{typeOfPlace}</span>}
        {description && <CollapsibleContainer contentHeight="100%">{description}</CollapsibleContainer>}
      </DetailCardContainer>
    )
  }

  return(<></>)
}
