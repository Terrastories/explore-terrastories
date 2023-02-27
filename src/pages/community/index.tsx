import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import http from 'utils/http';

import Loading from 'components/Loading';
import Story from 'components/Story';

import { TypeCommunity } from './types';

type Props = {
  slug: string
}

export default function Community() {
  const [community, setCommunity] = React.useState<TypeCommunity>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  const {
    slug
  } = useParams<Props>();

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

  return(
    <div>
      {loading && <Loading />}
      {error && <div>there was an error</div>}
      {community &&
        <div>
          Hey {community.name}
          {community.stories && community.stories.map((story) => <Story key={story.title} {...story} />)}
        </div>
        }
    </div>
  )
}