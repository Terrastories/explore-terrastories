export type TypeStory = {
  title: string,
  desc?: string,
  topic?: string,
  language?: string,
  points: any
}

export type TypeCommunity = {
  name: string,
  display_image?: string,
  center_long: number,
  center_lat: number,
  zoom: number,
  storiesCount: number,
  points: object
}
