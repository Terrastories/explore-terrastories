import styled from 'styled-components'

import Icon from 'components/Icon'
import Media from 'components/Media'

import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import speakerIconUrl from '../speakerPhone.svg'

const PlaceDetailContainer = styled.div`
position: relative;

background-color: #fff;
box-shadow: 0 1px 4px rgb(102 102 102 / 10%);

padding: 0.5rem;
margin-top: 1rem;

p {
  padding: 0.2rem;
  padding-top: 0.5rem;
}
`
const Heading = styled.div`
display: flex;
align-items: center;

--plyr-color-main: #0f566b;
--plyr-control-spacing: 0;
--plyr-audio-control-background-hover: #fff;
--plyr-audio-control-color: #05323a;
--plyr-audio-control-color-hover: #09697e;

h1 {
  font-size: 20px;
  margin: 0;
  padding: 0.5rem;
}

.plyr {
  display: inline-block;
  min-width: 18px;
  vertical-align: middle;
  padding-left: 2px;
}

svg.icon--pressed {
  fill: #d97629;
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
export default function PlaceDetailCard() {
  const { closePlaceChip, selectedPlace } = useCommunity()
  const { updateStoryPoints } = useMapConfig()

  if (!selectedPlace) return <></>

  const {
    name,
    description,
    placenameAudio,
    region,
    typeOfPlace,
  } = selectedPlace

  function handleClosePlaceDetail() {
    closePlaceChip().then((points) => updateStoryPoints(points))
  }

  return (
    <PlaceDetailContainer>
      <CloseButton onClick={handleClosePlaceDetail}><Icon icon={'close'} alt='Dismiss' /></CloseButton>
      <Heading>
        <h1>{name}</h1>
        {placenameAudio &&
          <Media
            blob={`${name}-audio`}
            url={placenameAudio}
            contentType='audio'
            playIconUrl={speakerIconUrl}
            audioControls={['play']} />}
      </Heading>
      {region && <span className="badge">{region}</span>}
      {typeOfPlace && <span className="badge">{typeOfPlace}</span>}
      {description && <p>{description}</p>}
    </PlaceDetailContainer>
  )
}
