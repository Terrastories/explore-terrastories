type TypeStory = {
  title: string,
  desc?: string,
  topic?: string,
  language?: string,
  points: any
}

export type TypeCommunity = {
  name: string,
  display_image?: string,
  stories: TypeStory[]
}
