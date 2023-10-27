import React, {ReactNode} from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import useModal from "hooks/useModal"

import Icon from "components/Icon"

const ContentModal = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 100%;
background-color: rgb(0 0 0 / 80%);

.content {
  position: relative;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
}

button#closeButton {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  color: white;
  background: rgb(0 0 0 / 70%);
  cursor: pointer;
  padding: 0;
  height: 24px;
  width: 24px;

  &:hover {
    background: rgba(0,0,0,0.25);
  }

  svg {
    fill: #d7d7d7;
    height: 24px;
    width: 24px;
  }
}
`

type ModalProps = {
  onClose: () => void,
  children: ReactNode
}

export default function Modal(props: ModalProps) {
  const { t } = useTranslation()
  const { onClose, children } = props
  const { modalRef, contentRef } = useModal(onClose)

  return (
    <ContentModal ref={modalRef} tabIndex={-1}>
      <div className="content" ref={contentRef}>
        {children}
        <button onClick={onClose} id='closeButton' aria-labelledby={t("close")}><Icon icon="close" alt={t("close")} /></button>
      </div>
    </ContentModal>
  )
}
