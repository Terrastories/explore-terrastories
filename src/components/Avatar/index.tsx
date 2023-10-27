import { ReactNode } from "react"
import styled from "styled-components"

import PersonIcon from "./assets/person.svg"

const RoundImage = styled.img`
border-radius: 50%;
object-fit: cover;
height: 50px;
width: 50px;
vertical-align: top;
background-color: #ccc;
flex-shrink: 0;
`

const AvatarCard = styled.div`
display: flex;
gap: 1rem;
`

type AvatarProps = {
  name: string,
  photoUrl: string,
  showDetails: boolean,
  children?: ReactNode,
}

export default function Avatar(props: AvatarProps) {
  const {
    name,
    photoUrl,
    showDetails,
    children,
  } = props

  const imgSrc = photoUrl ? photoUrl : PersonIcon

  return (
    <AvatarCard>
      <RoundImage src={imgSrc} alt={name} title={name} />
      {showDetails && <div>
        <div className='name'>{name}</div>
        {children}
      </div>}
    </AvatarCard>
  )
}
