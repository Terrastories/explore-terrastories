import http from './axios'

import type { APIResponse } from './types'

export function getStories(slug: string, urlParams = {}): Promise<APIResponse> {
  return http.get(`/communities/:slug/stories`, {
    params: urlParams,
    embeddedParams: {slug}
  })
}

export function getStory(slug: string, storyId: string): Promise<APIResponse> {
  return http.get(`/communities/:slug/stories/:storyId`, {
    embeddedParams: {slug, storyId}
  })
}
