import { Link } from 'react-router-dom'
import styled from 'styled-components'

import useMobile from 'hooks/useMobile'

import './styles.css'
import logo from 'logo.svg'

const StyledLogo = styled.img`
  height: 100%;
  max-width: 60%;
`

export default function Header() {
  const isMobile = useMobile()

  return(
    <div className={`header ${isMobile ? "mobile" : ""}`}>
      <Link to={'/'}>
        <StyledLogo src={logo} alt="Terrastories" />
      </Link>
    </div>
  )
}
