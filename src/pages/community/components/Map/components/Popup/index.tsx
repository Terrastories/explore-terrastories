import React from "react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import Media from "components/Media"
import Lightbox from "components/Lightbox"
import Icon from "components/Icon"

import speakerIcon from "./assets/plyrSpeakerIcon.svg"

type FeatureProps = {
  name?: string,
  description?: string,
  placenameAudio?: string,
  photo?: string,
  thumbnail?: string,
  region?: string,
  typeOfPlace?: string,
}

type PopupProps = FeatureProps & {
  handleClose: () => void
}

const PopupCard = styled.div`
  position: relative;
  width: 260px;
  max-width: 260px;
  background: white;
  color: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  font-size: 14px;
`

const Heading = styled.header`
display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.65rem 0.75rem;
background-color: #33aa8b;
color: white;

--plyr-color-main: #d97629;
--plyr-control-spacing: 0;
--plyr-audio-controls-background: #33aa8b;
--plyr-audio-control-background-hover: #33aa8b;
--plyr-audio-control-color: #fff;
--plyr-audio-control-color-hover: #a6a6a6;

h1 {
  font-size: 18px;
  margin: 0;
  flex: 1;
  line-height: 1.3;
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
padding: 0.75rem 0.85rem 0.9rem;
display: grid;
gap: 0.5rem;
`

const StyledImage = styled.img`
max-height: 200px;
width: 100%;
display: block;
object-fit: cover;
cursor: pointer;
`

const CloseButton = styled.button`
position: absolute;
top: 6px;
right: 6px;
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

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .badge {
    margin: 0;
  }
`

export default function Popup(props: PopupProps) {
  const { t } = useTranslation()
  const {
    name,
    description,
    placenameAudio,
    photo,
    thumbnail,
    region,
    typeOfPlace,
  } = props

  const [showModal, setShowModal] = useState<boolean>(false)

  const popupImage = thumbnail || photo

  return (
    <PopupCard>
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
            audioControls={["play"]} />}
      </Heading>
      {popupImage &&
        <StyledImage src={popupImage} alt={name} onClick={() => setShowModal(true)} />}
      <Content>
        {description && <div>{description}</div>}
        <BadgeRow>
          {region && <span className="badge">{region}</span>}
          {typeOfPlace && <span className="badge">{typeOfPlace}</span>}
        </BadgeRow>
      </Content>
      <CloseButton onClick={props.handleClose} aria-labelledby={t("close")}>
        <Icon icon="close" alt={t("close")} />
      </CloseButton>
      {showModal && photo && name && createPortal(
        <Lightbox
          imageSource={photo}
          name={name}
          description={description}
          onClose={() => setShowModal(false)} />,
        document.body
      )}
    </PopupCard>
  )
}
