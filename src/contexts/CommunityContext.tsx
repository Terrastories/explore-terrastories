import React, { createContext, useContext, useState, ReactNode } from "react"

import { getStories, getStory } from "api/storyApi"
import { getPlace } from "api/placeApi"

import type { Feature, Point } from "geojson"
import type { TypeStory, TypePlace, FilterOption, PaginationMeta } from "types"

type FilterState = {
  selectedFilter: string | undefined,
  selectedOptions: FilterOption[] | undefined,
}
type SelectedFilters = {
  [key: string]: any
}

type SortOpts = {
  sort_by: string,
  sort_dir: string
}

const sortOptions:{
  [value: string]: SortOpts
} = {
  "recent": {
    sort_by: "created_at",
    sort_dir: "desc",
  },
  "alpha": {
    sort_by: "title",
    sort_dir: "asc",
  },
  "zeta": {
    sort_by: "title",
    sort_dir: "desc",
  },
  "updated": {
    sort_by: "updated_at",
    sort_dir: "desc",
  },
}

interface CommunityCtx {
  closePlaceChip: () => Promise<Array<Feature<Point>>>
  fetchStories: (useFilterState?: boolean) => Promise<Array<Feature<Point>>>
  fetchPaginatedStories: () => void
  fetchStory: (storyId: string) => Promise<Array<Feature<Point>>>
  fetchPlace: (placeId: string | number) => Promise<Array<Feature<Point>>>
  handleFilter: (category: string | undefined) => void
  handleFilterOption: (options: FilterOption[]) => void
  listView: boolean
  loading: boolean
  resetSelections: () => void
  selectedFilter: string | undefined
  selectedOptions: FilterOption[] | undefined
  selectedPlace: TypePlace | undefined
  selectedStory: TypeStory | undefined
  setSelectedStory: (story: TypeStory | undefined) => void
  showIntro: boolean
  selectedSort: string | undefined
  slug: string
  sortOptions: {[value: string]: SortOpts}
  sortStories: (sort: string) => void
  stories: TypeStory[]
  toggleListView: () => void
  toggleIntroPanel: () => void
}

const CommunityContext = createContext<CommunityCtx>({
  slug: "",
  loading: false,
  stories: [],
  resetSelections: () => { return },

  // API Wrappers
  fetchStories: () => { return Promise.resolve([]) },
  fetchStory: (p) => { return Promise.resolve([]) },
  fetchPlace: (p) => { return Promise.resolve([]) },
  fetchPaginatedStories: () => { return },

  // Panel Helpers
  toggleIntroPanel: () => { return },
  showIntro: true,
  listView: true,
  toggleListView: () => { return },

  // Story Detail
  selectedStory: undefined,
  setSelectedStory: (s) => { return s},

  // Place Detail
  selectedPlace: undefined,
  closePlaceChip: () => { return Promise.resolve([]) },

  // Sort Helpers
  sortStories: (s) => { return s},
  selectedSort: undefined,
  sortOptions: sortOptions,

  // Filter Helpers
  handleFilter: (c) => { return },
  handleFilterOption: (o) => { return },
  selectedFilter: undefined,
  selectedOptions: undefined,
})

export const CommunityProvider = ({ slug, children }: { slug: string, children: ReactNode}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [showIntro, setShowIntro] = useState<boolean>(true)

  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>()

  const [stories, setStories] = useState<TypeStory[]>([])
  const [selectedStory, setSelectedStory] = useState<TypeStory>()
  const [selectedPlace, setSelectedPlace] = useState<TypePlace>()

  const [listView, setListView] = useState<boolean>(true)
  const [selectedSort, setSelectedSort] = useState<string | undefined>(undefined)
  const [{selectedFilter, selectedOptions}, setFilterState] = useState<FilterState>({
    selectedFilter: undefined,
    selectedOptions: undefined,
  })

  function resetSelections() {
    setStories([])
    setShowIntro(true)
    setSelectedPlace(undefined)
    setSelectedStory(undefined)
    setSelectedSort(undefined)
    setFilterState({
      selectedFilter: undefined,
      selectedOptions: undefined
    })
    setPaginationMeta({})
    setHasNextPage(true)
  }

  function buildQueryParams(useFilterState:boolean = false): SelectedFilters {
    let queryParams:SelectedFilters = {}
    if (selectedSort) {
      queryParams = {
        ...sortOptions[selectedSort]
      }
    }
    if (!useFilterState && selectedPlace) {
      queryParams = {
        ...queryParams,
        ...paginationMeta,
      }
    }
    if (useFilterState && selectedFilter && selectedOptions) {
      queryParams[selectedFilter] = selectedOptions.map((opt) => opt.value)
    }
    return queryParams
  }

  async function fetchStories(useFilterState:boolean = false) {
    setLoading(true)

    const queryParams = buildQueryParams(useFilterState)

    const resp = await getStories(slug, {...queryParams})
    setStories(resp.data.stories)

    setHasNextPage(resp.data.hasNextPage)
    setPaginationMeta(resp.data.nextPageMeta)

    setLoading(false)
    return resp.data.points
  }

  async function fetchPaginatedStories() {
    setShowIntro(false)
    if (!hasNextPage) return

    setLoading(true)
    const queryParams = buildQueryParams(selectedPlace ? false : true)

    const resp = await getStories(slug, {...queryParams, ...paginationMeta})

    // Per docs: copy to mutate, and apply
    const storyArray = [...stories]
    setStories([...storyArray, ...resp.data.stories])

    setHasNextPage(resp.data.hasNextPage)
    setPaginationMeta(resp.data.nextPageMeta)

    setLoading(false)
  }

  async function fetchStory(storyId: string) {
    setLoading(true)

    const resp = await getStory(slug, storyId)
    setSelectedStory(resp.data)

    setLoading(false)
    return resp.data.points
  }

  async function fetchPlace(placeId: string | number) {
    const resp = await getPlace(slug, placeId)

    // Set stories array to empty; this will allow the paginator to
    // correctly pull down stories.
    setStories([])

    setPaginationMeta({places: [placeId]})
    setHasNextPage(true)

    setSelectedPlace(resp.data)
    setSelectedStory(undefined)

    return resp.data.points
  }

  async function closePlaceChip() {
    setStories([])
    setHasNextPage(true)
    setPaginationMeta(undefined)
    setSelectedPlace(undefined)

    return await fetchStories(true)
  }

  function toggleIntroPanel() {
    setShowIntro((prevState) => !prevState)
  }

  function sortStories(sort: string) {
    if (sortOptions[sort]) {
      // Reset when sort is viable so StoryList is fully refreshed.
      setStories([])
      setLoading(true)
      setSelectedSort(sort)
      setPaginationMeta((prevState) => ({
        ...prevState,
        ...sortOptions[sort],
        offset: 0
      }))
    }
  }

  function handleFilter(category: string | undefined) {
    setFilterState({
      selectedFilter: category,
      selectedOptions: selectedOptions ? [] : undefined
    })
  }

  function handleFilterOption(options: FilterOption[]) {
    // Reset whenever filter option changes so StoryList is fully refreshed.
    setStories([])
    setLoading(true)
    setFilterState((prevState) => ({
      ...prevState,
      selectedOptions: options
    }))
  }

  function toggleListView() {
    setListView((prevState) => !prevState)
  }

  return (
    <CommunityContext.Provider
      value={{
        slug,
        loading,
        stories,
        resetSelections,

        // API Wrappers
        fetchStory,
        fetchStories,
        fetchPlace,
        fetchPaginatedStories,

        // Panel Helpers
        showIntro,
        toggleIntroPanel,
        listView,
        toggleListView,

        // Story Detail
        selectedStory,
        setSelectedStory,

        // Place Detail
        selectedPlace,
        closePlaceChip,

        // Sort Helpers
        sortStories,
        selectedSort,
        sortOptions,

        // Filter Helpers
        handleFilter,
        handleFilterOption,
        selectedFilter,
        selectedOptions,
      }}
    >
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunity = () => {
  return useContext(CommunityContext)
}
