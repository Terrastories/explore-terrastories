import styled from 'styled-components'

import { useCommunity } from 'contexts/CommunityContext'

import useMobile from 'hooks/useMobile'

import logo from 'logo.svg'

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  column-gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  &.mobile {
    position: fixed;
    left: 0;
    top: 0;
    height: 50px;
    padding: 0.25rem 0rem;
    justify-content: center;
    margin-bottom: auto;
  }

  img {
    height: 100%;
    max-height: 80px;
  }

  img.headerLink, h1.headerLink {
    cursor: pointer;
    text-decoration: underline;
  }
  h1 {
    margin: 0;
    padding: 0;
  }
`

export default function Header({displayLogo, name}:{displayLogo?: string, name: string}) {
  const isMobile = useMobile()

  const { showIntro, toggleIntroPanel } = useCommunity()

  return(
    <StyledHeader role='header' className={isMobile ? "mobile" : ""}>
      {displayLogo &&
        <img onClick={() => !showIntro && toggleIntroPanel()} className={!showIntro ? 'headerLink' : ''} src={displayLogo || logo} alt={name} />}
      {!displayLogo &&
        <h1 onClick={() => !showIntro && toggleIntroPanel()} className={!showIntro ? 'headerLink' : ''}>{name}</h1>}
    </StyledHeader>
  )
}
