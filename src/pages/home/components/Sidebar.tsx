import styled from 'styled-components'

import Input from 'components/Input'

const StyledSidebar = styled.div`
flex: 0 0 0;
margin: 1rem;
min-width: 200px;

p {
  margin-bottom: 0.5rem;
}

@media screen and (min-width: 768px) {
  flex: 0 0 0;
  margin: 1rem 2rem 2rem;
  width: fit-content;
  max-width: 250px;
}
`

export default function Sidebar({handleSearch}:{handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <StyledSidebar>
      <p>
        Terrastories are audiovisual recordings of place-based storytelling.
      </p>
      <p>
        This application enables local communities to locate and map their oral storytelling traditions about places of significant meaning or value to them.
      </p>
      <p>
        Start exploring communities, or search for one below.
      </p>
      <Input
        placeholder="Search for a community"
        type="text"
        onChange={handleSearch}
      />
    </StyledSidebar>
  )
}