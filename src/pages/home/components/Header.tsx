import styled from 'styled-components'
import logo from 'logo.svg'
import { useTranslation } from 'react-i18next'

import LanguagePicker from 'components/LanguagePicker'

const StyledHeader = styled.header`
position: sticky;
top: 0;
height: 100px;
display: flex;
flex-wrap: nowrap;
gap: 1rem;
align-items: center;
justify-content: space-between;
background-color: white;
box-shadow: 0 0 8px 2px #dfdfdf;
padding: 0 3rem;
z-index: 1;
`

const Heading = styled.div`
height: 100px;
display: flex;
flex-wrap: nowrap;
gap: 1rem;
align-items: center;

span {
  font-family: 'OpenSansCondensed-Bold';
  font-size: 1.5rem;
}

span.bar {
  width: 2px;
  height: 30px;
  background-color: #136a7e;
}

.logo {
  height: 100%;
  width: 200px;
  vertical-align: middle;
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