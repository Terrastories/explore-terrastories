import http from "./axios"

import type { APIResponse } from "./types"
import type { PaginationMeta } from "types"

interface PaginatedData {
  hasNextPage: boolean,
  nextPageMeta: PaginationMeta,
  [key: string]: any
}

type PaginatedResponse = {
  data: PaginatedData
}

export function getStories(slug: string, urlParams = {}): Promise<PaginatedResponse> {
  return http.get("/communities/:slug/stories", {
    params: urlParams,
    embeddedParams: {slug}
  })
}

export function getStory(slug: string, storyId: string): Promise<APIResponse> {
  return http.get("/communities/:slug/stories/:storyId", {
    embeddedParams: {slug, storyId}
  })
}
