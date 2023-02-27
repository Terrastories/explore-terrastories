import React from 'react'

import { getCommunities } from 'api/communityApi'

import Loading from 'components/Loading'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CommunityList from './components/CommunityList'

import { TypeCommunity } from 'types'

import './styles.css'

function Home() {
  const [communities, setCommunities] = React.useState<TypeCommunity[]>([]);
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(()=> {
    async function fetchData(query?: string) {
      getCommunities(query)
      .then((resp) => {
        setCommunities(resp.data)
        setError(null)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
    }

    const timeOut = setTimeout(() => fetchData(searchQuery), 500);
    return () => clearTimeout(timeOut)
  }, [searchQuery])

  return (
    <>
      <Header />
      <main className='homeMain'>
        <Sidebar
        handleSearch={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
        />
        <div className="contentMain">
          {loading && <Loading />}
          {error && <div>there was an error</div>}
          <CommunityList communities={communities} />
        </div>
      </main>
    </>
  );
}

export default Home;
