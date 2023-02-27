type Props = {
  title: string,
  desc?: string,
  displayImage?: string,
}

export default function Story(props: Props) {
  return (
    <div>
      {props.title}
      {props.desc}
      {props.displayImage &&
      <img src={props.displayImage} alt={props.title} />}
    </div>
  );
}
