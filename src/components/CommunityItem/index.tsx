import { Link } from 'react-router-dom'

import { TypeCommunity } from 'types'

export default function CommunityItem(props: TypeCommunity) {
  const {
    name,
    display_image,
    description,
  } = props

  return (
    <Link to={`/community/${props.slug}`} className="communityItem">
      {display_image && <img src={display_image} alt={name} />}
      <h3>{name}</h3>
      <div className="noColorChange">{description}</div>
    </Link>
  );
}
