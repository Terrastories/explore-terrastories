import styled from 'styled-components'
import logo from 'logo.svg'
import { useTranslation } from 'react-i18next'

const StyledHeader = styled.header`
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
      <img src={logo} className="logo" alt="Terrastories" title="Terrastories" />
      <span className="bar"></span>
      <span>{t('explore')}</span>
    </StyledHeader>
  )
}