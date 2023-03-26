import { Link } from 'react-router-dom'

import { TypeCommunity } from 'types'

export default function CommunityItem(props: TypeCommunity) {
  const {
    name,
    displayImage,
    description,
  } = props

  return (
    <Link to={`community/${props.slug}`} className="communityItem">
      {displayImage && <img src={displayImage} alt={name} />}
      <div>
        <h3>{name}</h3>
        <div className="noColorChange">{description}</div>
      </div>
    </Link>
  );
}
