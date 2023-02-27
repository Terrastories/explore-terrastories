import { Link } from 'react-router-dom'
import styled from 'styled-components'

import useMobile from 'hooks/useMobile'

import logo from 'logo.svg'

const StyledLogo = styled.img`
  height: 100%;
  max-width: 60%;
`
const StyledHeader = styled.div`
  width: 100%;
  text-align: center;

  &.mobile {
    position: fixed;
    top: 0;
    height: 50px;
    padding: 0.5rem;
  }
`

export default function Header() {
  const isMobile = useMobile()

  return(
    <StyledHeader role='header' className={isMobile ? "mobile" : ""}>
      <Link to={'/'}>
        <StyledLogo src={logo} alt="Terrastories" />
      </Link>
    </StyledHeader>
  )
}
