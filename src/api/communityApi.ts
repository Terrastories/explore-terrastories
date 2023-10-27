import http from "./axios"

import type { APIResponse } from "./types"
import type { TypeCommunity } from "types"

export function getCommunities(search: string | null): Promise<APIResponse<TypeCommunity[]>> {
  const searchParams:{search?: string} = {}
  if (search) { searchParams["search"] = search }

  return http.get("/communities", {params: searchParams})
}

export function getCommunity(slug: string): Promise<APIResponse<TypeCommunity>> {
  return http.get("/communities/:slug", {embeddedParams: {slug}})
}
