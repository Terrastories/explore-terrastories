import http from "./axios"

import type { APIResponse } from "./types"

export function getPlace(slug: string, placeId = {}): Promise<APIResponse> {
  return http.get("/communities/:slug/places/:placeId", {
    embeddedParams: {slug, placeId}
  })
}
