import styled from 'styled-components'

import { TypeSpeaker } from 'types'

import PersonIcon from './assets/person.svg'

const Avatar = styled.img`
border-radius: 50%;
object-fit: cover;
height: 50px;
width: 50px;
vertical-align: top;
margin-right: 0.5rem;
background-color: #ccc;
`

const SpeakerCard = styled.div`
display: inline-block;
width: 50%;
text-align: center;
`

export default function Speaker(props: TypeSpeaker) {
  const {
    name,
    photoUrl,
  } = props

  const imgSrc = photoUrl ? photoUrl : PersonIcon

  return (
    <SpeakerCard>
      <Avatar src={imgSrc} alt={name} />
      <div>{name}</div>
      <span className={'badge'}>Speaker</span>
    </SpeakerCard>
  )
}
