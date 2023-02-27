import { Link } from "react-router-dom";

type Props = {
  name: String,
  slug: String
}

export default function CommunityItem(props: Props) {
  return (
    <div>
      <Link to={`/community/${props.slug}`}>{props.name}</Link>
    </div>
  );
}
