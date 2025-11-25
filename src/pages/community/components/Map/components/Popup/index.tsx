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

const Wrapper = styled.div`
  position: relative;
  width: clamp(220px, 70vw, 260px);
  max-width: 280px;
  background: white;
  color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
`

const Heading = styled.div`
position: relative;
display: flex;
align-items: center;
padding: 0.55rem 0.65rem 0.55rem 0.75rem;
background-color: #33aa8b;
color: white;

--plyr-color-main: #d97629;
--plyr-control-spacing: 0;
--plyr-audio-controls-background: #33aa8b;
--plyr-audio-control-background-hover: #33aa8b;
--plyr-audio-control-color: #fff;
--plyr-audio-control-color-hover: #a6a6a6;

h1 {
  font-size: 20px;
  margin: 0;
  padding: 0.25rem 0.4rem 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 56px; /* room for actions */
}

.actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plyr {
  display: inline-block;
  min-width: 18px;
  vertical-align: middle;
  width: 26px;
  height: 26px;
}

svg.icon--pressed {
  fill: #d97629;
}
`

const Content = styled.div`
padding: 8px;
display: grid;
gap: 6px;
`

const StyledImage = styled.img`
max-height: 200px;
width: 100%;
display: block;
object-fit: cover;
cursor: pointer;
`

const CloseButton = styled.button`
border: none;
color: white;
background: rgba(0,0,0,0.18);
cursor: pointer;
padding: 0;
height: 26px;
width: 26px;
border-radius: 6px;
display: grid;
place-items: center;
box-shadow: 0 1px 4px rgba(0,0,0,0.18);

&:hover {
  background: rgba(0,0,0,0.28);
}

svg {
  fill: #d7d7d7;
  height: 16px;
  width: 16px;
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
    <Wrapper>
      <Heading>
        <h1>
          {name}
        </h1>
        <div className="actions">
          <CloseButton onClick={props.handleClose} aria-labelledby={t("close")}>
            <Icon icon="close" alt={t("close")} />
          </CloseButton>
          {placenameAudio &&
            <Media
              blob={`${name}-audio`}
              url={placenameAudio}
              contentType='audio'
              playIconUrl={speakerIcon}
              audioControls={["play"]} />}
        </div>
      </Heading>
      {popupImage &&
        <StyledImage src={popupImage} alt={name} onClick={() => setShowModal(true)} />}
      <Content>
        <BadgeRow>
          {region && <span className="badge">{region}</span>}
          {typeOfPlace && <span className="badge">{typeOfPlace}</span>}
        </BadgeRow>
      </Content>
      {showModal && photo && name && createPortal(
        <Lightbox
          imageSource={photo}
          name={name}
          description={description}
          onClose={() => setShowModal(false)} />,
        document.body
      )}
    </Wrapper>
  )
}
