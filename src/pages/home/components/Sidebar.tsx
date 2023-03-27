import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['home'])
  const [query, setQuery] = useState(searchQuery)

  useEffect(() => {
    if (query === null) return
    const timer = setTimeout(() => handleSearch(query), 500)

    return () => clearTimeout(timer)
  }, [query, handleSearch])

  return (
    <StyledSidebar>
      <p>{t('sidebar.intro')}</p>
      <p>{t('sidebar.about')}</p>
      <h4>{t('search.label')}</h4>
      <p>{t('search.cta')}</p>
      <Input
        placeholder={t('search.placeholder')}
        type="text"
        defaultValue={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      />
    </StyledSidebar>
  )
}