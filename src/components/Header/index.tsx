import styled from 'styled-components'

import './styles.css'
import logo from 'logo.svg'

const StyledLogo = styled.img`
  height: 100%;
  max-width: 60%;
`

export default function Header({isMobile}:{isMobile?: boolean}) {
  return(
    <div className={`header ${isMobile ? "mobile" : ""}`}>
      <StyledLogo src={logo} alt="Terrastories" />
    </div>
  )
}
