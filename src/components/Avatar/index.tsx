import styled from 'styled-components'

import PersonIcon from './assets/person.svg'

const RoundImage = styled.img`
border-radius: 50%;
object-fit: cover;
height: 50px;
width: 50px;
vertical-align: top;
background-color: #ccc;
`

const AvatarCard = styled.div`
display: inline-block;
max-width: 30%;
text-align: center;
`

type AvatarProps = {
  name: string,
  photoUrl: string,
  badge?: string
}

export default function Avatar(props: AvatarProps) {
  const {
    name,
    photoUrl,
    badge,
  } = props

  const imgSrc = photoUrl ? photoUrl : PersonIcon

  return (
    <AvatarCard>
      <RoundImage src={imgSrc} alt={name} />
      <div>{name}</div>
      { badge &&
        <span className={'badge'}>{badge}</span>}
    </AvatarCard>
  )
}
