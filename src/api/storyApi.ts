import http from "./axios"

import type { APIResponse, PaginatedAPIResponse } from "./types"
import type { Feature, Point, GeoJsonProperties, TypeStory } from "types"

type PaginatedData = {
  stories: TypeStory[],
  points: Array<Feature<Point, GeoJsonProperties>>,
}

export function getStories(slug: string, urlParams = {}): Promise<PaginatedAPIResponse<PaginatedData>> {
  return http.get("/communities/:slug/stories", {
    params: urlParams,
    embeddedParams: {slug}
  })
}

export function getStory(slug: string, storyId: string): Promise<APIResponse<TypeStory>> {
  return http.get("/communities/:slug/stories/:storyId", {
    embeddedParams: {slug, storyId}
  })
}
