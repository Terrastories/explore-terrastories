import styled from 'styled-components'
import logo from 'logo.svg'

const StyledHeader = styled.header`
height: 100px;
text-align: center;

.logo {
  height: 100%;
  width: 200px;
  vertical-align: middle;
}
`

export default function Header() {
  return(
    <StyledHeader>
      <img src={logo} className="logo" alt="Terrastories" title="Terrastories" />
    </StyledHeader>
  )
}