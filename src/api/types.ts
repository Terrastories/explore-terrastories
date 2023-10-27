import type { NextPageMeta } from "types"

type PaginationMeta = {
  total: number,
  hasNextPage: boolean,
  nextPageMeta: NextPageMeta
}

export interface APIResponse<D> {
  data: D
}

export interface PaginatedAPIResponse<D> extends APIResponse<D> {
  meta: PaginationMeta
}
