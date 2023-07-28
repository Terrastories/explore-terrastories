import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Loading from 'components/Loading'
import Icon from 'components/Icon'

import useModal from 'hooks/useModal'

const LightboxModal = styled.div`
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
}

img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;

  &.loading {
    display: none;
  }
}

.imgPlaceholder {
  width: 600px;
  height: 450px;
  background-color: rgb(44 44 44);
  display: flex;
  justify-content: center;
  align-items: center;
}

.caption {
  position: absolute;
  bottom: 0;
  left: 0;

  background-color: rgb(0 0 0 / 70%);
  color: white;
  padding: 0.5rem;
  line-height: 1.5;

  h2 {
    margin: 0;
  }
}

button {
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

type LightboxProps = {
  onClose: () => void,
  imageSource: string,
  name: string,
  description?: string
}

export default function Lightbox(props: LightboxProps) {
  const { t } = useTranslation()
  const { onClose, imageSource, name, description } = props
  const { modalRef, contentRef } = useModal(onClose)

  const [imgLoading, setImgLoading] = React.useState(true)

  return (
    <LightboxModal ref={modalRef} tabIndex={-1}>
      <div className="content" ref={contentRef}>
        <button onClick={onClose} aria-labelledby={t('close')}><Icon icon="close" alt={t('close')} /></button>
        <React.Suspense fallback={<Loading />}>
          {imgLoading && <div className='imgPlaceholder'><Loading /></div>}
          <img className={imgLoading ? 'loading' : ''} src={imageSource} alt={name} onLoad={() => setImgLoading(false)} />
          <div className="caption">
            <h2>{name}</h2>
            {description}
          </div>
        </React.Suspense>
      </div>
    </LightboxModal>
  )
}
