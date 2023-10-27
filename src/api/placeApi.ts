import http from "./axios"

import type { APIResponse } from "./types"
import type { TypePlace } from "types"

export function getPlace(slug: string, placeId = {}): Promise<APIResponse<TypePlace>> {
  return http.get("/communities/:slug/places/:placeId", {
    embeddedParams: {slug, placeId}
  })
}
