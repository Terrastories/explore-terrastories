import styled from 'styled-components'

import Input from 'components/Input'

const StyledSidebar = styled.div`
min-width: 200px;
height: fit-content;
position: sticky;
top: 1rem;

p {
  margin-bottom: 0.5rem;
}
`

type SidebarProps = {
  searchQuery: string | null,
  handleSearch: (v: string) => void
}

export default function Sidebar({searchQuery, handleSearch}:SidebarProps) {
  const [query, setQuery] = useState(searchQuery)

  useEffect(() => {
    if (query === null) return
    const timer = setTimeout(() => handleSearch(query), 500)

    return () => clearTimeout(timer)
  }, [query, handleSearch])

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
        defaultValue={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      />
    </StyledSidebar>
  )
}