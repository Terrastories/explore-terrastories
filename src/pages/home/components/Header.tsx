import styled from 'styled-components'
import logo from 'logo.svg'
import { useTranslation } from 'react-i18next'

import LanguagePicker from 'components/LanguagePicker'

const StyledHeader = styled.header`
position: sticky;
top: 0;
box-shadow: 0 0 8px 2px #dfdfdf;
background-color: white;
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;
z-index: 1;

padding: 1rem 3rem;

@media screen and (min-width: 768px) {
  height: 100px;
  padding: 0 3rem;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}
`

const Heading = styled.div`
display: flex;
align-items: center;
flex-direction: column;

.logo {
  height: 100%;
  width: 200px;
  vertical-align: middle;
}

span {
  font-family: 'OpenSansCondensed-Bold';
  font-size: 1.5rem;
}

span.bar {
  display: none;
}

@media screen and (min-width: 768px) {
  height: 100px;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 1rem;

  span.bar {
    display: block;
    width: 2px;
    height: 30px;
    background-color: #136a7e;
  }

  .logo {
    height: 100%;
    width: 200px;
    vertical-align: middle;
  }
}
`

export default function Header() {
  const { t } = useTranslation()
  return(
    <StyledHeader>
      <Heading>
        <img src={logo} className="logo" alt="Terrastories" title="Terrastories" />
        <span className="bar"></span>
        <span>{t('explore')} {t('communities')}</span>
      </Heading>
      <LanguagePicker />
    </StyledHeader>
  )
}