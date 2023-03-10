import { useState } from 'react'
import { createPortal } from 'react-dom';
import styled from 'styled-components'

import Media from 'components/Media'
import Lightbox from 'components/Lightbox'

import { ReactComponent as CloseIcon } from './assets/closeIcon.svg'
import speakerIcon from './assets/speakerIcon.svg'

type FeatureProps = {
  name?: string,
  description?: string,
  placenameAudio?: string,
  photo?: string,
  region?: string,
  typeOfPlace?: string,
}

type PopupProps = FeatureProps & {
  handleClose: () => void
}

const Heading = styled.div`
padding-top: 0.6rem;
background-color: #33aa8b;
color: white;

display: flex;
align-items: center;

--plyr-color-main: #d97629;
--plyr-control-spacing: 0;
--plyr-audio-controls-background: #33aa8b;
--plyr-audio-control-background-hover: #33aa8b;
--plyr-audio-control-color: #fff;
--plyr-audio-control-color-hover: #a6a6a6;

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

const Content = styled.div`
padding: 0 10px 10px;
`

const StyledImage = styled.img`
max-height: 200px;
object-fit: cover;
`

const CloseButton = styled.button`
position: absolute;
top: 0;
right: 0;
border: none;
color: white;
background: rgba(0,0,0,0.15);
cursor: pointer;
padding: 0;
height: 20px;
width: 20px;

&:hover {
  background: rgba(0,0,0,0.25);
}

svg {
  fill: #d7d7d7;
}
`

export default function Popup(props: PopupProps) {
  const {
    name,
    description,
    placenameAudio,
    photo,
    region,
    typeOfPlace,
  } = props

  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <Heading>
        <h1>
          {name}
        </h1>
        {placenameAudio &&
          <Media
            blob={`${name}-audio`}
            url={placenameAudio}
            contentType='audio'
            playIconUrl={speakerIcon}
            audioControls={['play']} />}
      </Heading>
      {photo &&
        <StyledImage src={photo} alt={name} onClick={() => setShowModal(true)} />}
      <Content>
        {region && <span className="badge">{region}</span>}
        {typeOfPlace && <span className="badge">{typeOfPlace}</span>}
      </Content>
      <CloseButton onClick={props.handleClose}>
        <CloseIcon />
      </CloseButton>
      {showModal && photo && name && createPortal(
        <Lightbox
          imageSource={photo}
          name={name}
          description={description}
          onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  )
}
