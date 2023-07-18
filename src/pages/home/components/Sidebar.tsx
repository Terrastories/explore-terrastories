import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Input from 'components/Input'

import useMobile from 'hooks/useMobile'

const StyledSidebar = styled.div`
> .box {
  margin: 1rem 0;

  p {
    margin-bottom: 0.5rem;
    white-space: pre-line;
  }

  h4 {
    margin-top: 0;
  }
}

.fixedSearch {
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 0;
  border: 0;
  border-radius: none;
  z-index: 1;
  font-size: 16px;
  height: 3rem;
  box-shadow: 0 0 8px 0 #dfdfdf;
}

@media screen and (min-width: 768px) {
  min-width: 250px;
  height: fit-content;
  position: sticky;
  top: calc(100px + 1rem);
  margin-top: 2rem;

  > .box {
    padding: 10px;
    background-color: #f6f6f6;
    border-radius: 6px;
  }

}
`

type SidebarProps = {
  searchQuery: string | null,
  handleSearch: (v: string) => void
}

export default function Sidebar({searchQuery, handleSearch}:SidebarProps) {
  const { t } = useTranslation(['home'])
  const [query, setQuery] = useState(searchQuery)

  const { isMobile } = useMobile()

  useEffect(() => {
    if (query === null) return
    const timer = setTimeout(() => handleSearch(query), 500)

    return () => clearTimeout(timer)
  }, [query, handleSearch])

  return (
    <StyledSidebar>
      {
        !isMobile &&
        <div className='box'>
          <h4>{t('search.label')}</h4>
          <p>{t('search.cta')}</p>
          <Input
            placeholder={t('search.placeholder')}
            type="text"
            defaultValue={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
        </div>}
      <div className='box'>
        <p>{t('sidebar.about')}</p>
      </div>
      {isMobile &&
        <Input
          className='fixedSearch'
          placeholder={t('search.placeholder')}
          type="text"
          defaultValue={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />}
    </StyledSidebar>
  )
}