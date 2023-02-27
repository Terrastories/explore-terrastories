import React from 'react'
import http from 'utils/http'

import Loading from 'components/Loading'
import Input from 'components/Input'
import PublicCommunities from 'components/PublicCommunities'

import logo from 'logo.svg';
import { TypeCommunity } from 'types'

import './styles.css'

function Home() {
  const [communities, setCommunities] = React.useState<TypeCommunity[]>([]);
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(()=> {
    async function fetchData(query?: string) {
      let searchParams:{search?: string} = {}
      if (query) { searchParams["search"] = query }

      http.get(`/api/communities`, {params: searchParams})
      .then((resp) => {
        setCommunities(resp.data.communities)
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
      <header>
        <img src={logo} className="logo" alt="Terrastories" title="Terrastories" />
      </header>
      <main>
        <div className="sidebar">
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className="contentMain">
          {loading && <Loading />}
          {error && <div>there was an error</div>}
          <PublicCommunities communities={communities} />
        </div>
      </main>
    </>
  );
}

export default Home;
