import React, { startTransition } from 'react'
import { Await, useLoaderData, useSearchParams } from 'react-router-dom'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getCommunities } from 'api/communityApi'

import Loading from 'components/Loading'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CommunityList from './components/CommunityList'

import { TypeCommunity } from 'types'

export async function homeLoader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("query");

  return {communities: getCommunities(searchTerm).then((resp) => resp.data)}
}
type CommunitiesThing = {
  communities: Promise<TypeCommunity[]>
}

const MainContent = styled.div`
margin: 0 3rem;
display: grid;
gap: 3rem;
grid-template-columns: 1fr 4fr;
`

function Home() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useSearchParams()

  const data = useLoaderData() as CommunitiesThing

  // useCallback to avoid rerender loop
  const handleSearch = React.useCallback((value: string) => {
    startTransition(() => {
      if (value === '') {
        setSearchQuery({})
      } else {
       setSearchQuery({query: value})
      }
    })
  }, [setSearchQuery])

  // Translate title (default is English)
  React.useEffect(() => {
    document.title = t('explore') + ' Terrastories';
  }, [t])

  return (
    <main className='homeMain'>
      <Header />
      <MainContent>
        <React.Suspense fallback={<Loading />}>
          <Sidebar
            searchQuery={searchQuery.get('query')}
            handleSearch={handleSearch}
          />
          <div>
            <React.Suspense fallback={<Loading />}>
              <Await
                resolve={data.communities}
                errorElement={<div>{t('errors.generic')}</div>}>
                  {(communities) => (
                    <CommunityList communities={communities} />
                  )}
              </Await>
            </React.Suspense>
          </div>
        </React.Suspense>
      </MainContent>
    </main>
  );
}

export default Home;
