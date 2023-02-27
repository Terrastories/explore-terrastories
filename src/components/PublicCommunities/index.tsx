import React from 'react';
import http from 'utils/http';

import Loading from 'components/Loading';
import CommunityItem from 'components/CommunityItem';

export default function PublicCommunities() {
  const [communities, setCommunities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const getPublicCommunities = React.useCallback(() => {
    http.get(`/api/communities`)
      .then((resp) => setCommunities(resp.data.communities))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    getPublicCommunities();
  }, [getPublicCommunities]);

  return (
    <div>
      In PublicCommunities
      {loading && <Loading />}
      {error && <div>there was an error</div>}
      {communities && communities.map(({ name, slug }) => (
        <CommunityItem key={slug} name={name} slug={slug} />
      ))}
    </div>
  )
}
