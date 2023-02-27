import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import http from 'utils/http';

import Loading from 'components/Loading';
import Map from 'components/Map';
import Header from 'components/Header';
import StoryPanel from 'components/StoryPanel'

import type { TypeCommunity } from 'types';

type Props = {
  slug: string
}

export default function Community() {
  const [width, setWidth] = React.useState<number>(window.innerWidth);
  const [community, setCommunity] = React.useState<TypeCommunity>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();
  const isMobile = width <= 768

  const {
    slug
  } = useParams<Props>();

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  const getCommunity = React.useCallback(() => {
    http.get(`/api/communities/${slug}`)
    .then((resp) => setCommunity(resp.data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
  }, [slug])

  React.useEffect(() => {
    getCommunity();
    if (error) {
      return navigate("/not-found")
    }
  }, [getCommunity, error, navigate]);

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  })

  return (
    <React.Fragment>
      {loading && <Loading />}
      {community &&
        <React.Fragment>
          {isMobile &&
            <Header isMobile={isMobile} />
          }
          <Map
            isMobile={isMobile}
            points={community.points}
            config={community.mapConfig} />
          <StoryPanel
            isMobile={isMobile}
            communitySlug={community.slug}
            categories={community.categories}
            filters={community.filters}
            storiesCount={community.storiesCount} />
        </React.Fragment>
        }
    </React.Fragment>
  )
}