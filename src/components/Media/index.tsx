import React from 'react'
import {TypeMedia} from 'types'

import styled from 'styled-components'

import Plyr, { APITypes } from 'plyr-react'
import 'plyr-react/plyr.css'

const StyledImg = styled.img`
  width: 100%; // fill container
`

type AnyMedia = TypeMedia & {
  audioControls?: string[],
  playIconUrl?: string | undefined,
}

export default function Media(props: AnyMedia) {
  const {
    blob,
    url,
    contentType,
    audioControls,
    playIconUrl,
  } = props

  const plyrRef = React.useRef<APITypes>(null)

  if (contentType.indexOf('video') > -1) {
    return (
      <Plyr
        ref={plyrRef}
        id={blob}
        preload='none'
        source={
          {
            type: 'video',
            sources: [
              {
                src: url
              }
            ]
          }
        }
        options={
          {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
            settings: ['quality', 'speed', 'loop']
          }
        }
      />
    )
  }

  if (contentType.indexOf('audio') > -1) {
    return (
      <Plyr
          ref={plyrRef}
          id={blob}
          preload='none'
          source={
            {
              type: 'audio',
              sources: [
                {
                  src: url
                }
              ]
            }
          }
          options={
            {
              ...(audioControls && {controls: audioControls}),
              ...(playIconUrl && {iconUrl: playIconUrl})
            }
          }
        />
    )
  }

  if (contentType.indexOf('image') > -1) {
    return (
      <StyledImg src={url} alt='media' />
    )
  }

  return (
    <>Unable to render this media.</>
  )
}
