import { createContext, useContext, useState, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

import { getStories, getStory } from 'api/storyApi'
import { getPlace } from 'api/placeApi'

import type { FeatureCollection } from 'geojson'
import type { TypeStory, TypePlace, FilterOption } from 'types'

type FilterState = {
  selectedFilter: string | undefined,
  selectedOptions: FilterOption[] | undefined,
}
type SelectedFilters = {
  [key: string]: any
}

const sortOptions:{
  [value: string]: any
} = {
  'recent': {
    fn: (a: TypeStory, b: TypeStory) => ((a.createdAt < b.createdAt) ? 1 : -1),
    label: 'Most Recent',
    value: 'recent'
  },
  'alpha': {
    fn: (a: TypeStory, b: TypeStory) => ((a.title > b.title) ? 1 : -1),
    label: 'AZ',
    value: 'alpha'
  },
  'zeta': {
    fn: (a: TypeStory, b: TypeStory) => ((a.title < b.title) ? 1 : -1),
    label: 'ZA',
    value: 'zeta'
  },
  'updated': {
    fn: (a: TypeStory, b: TypeStory) => ((a.updatedAt > b.updatedAt) ? 1 : -1),
    label: 'Recently Updated',
    value: 'updated'
  },
}

interface CommunityCtx {
  closePlaceChip: () => Promise<FeatureCollection>
  fetchStories: (urlParams: object, useFilterState?: boolean) => Promise<FeatureCollection>
  fetchStory: (storyId: string) => Promise<FeatureCollection>
  fetchPlace: (placeId: string | number) => Promise<FeatureCollection>
  handleShowStories: () => void
  handleSort: (sort: string) => void
  handleFilter: (category: string | undefined, options: FilterOption[], sort: string) => SelectedFilters
  listView: boolean
  loading: boolean
  selectedFilter: string | undefined
  selectedOptions: FilterOption[] | undefined
  selectedPlace: TypePlace | undefined
  selectedStory: TypeStory | undefined
  setSelectedStory: (story: TypeStory | undefined) => void
  showIntro: boolean
  sort: string
  sortOptions: {[value: string]: any}
  stories: TypeStory[]
  toggleListView: () => void
}

const CommunityContext = createContext<CommunityCtx>({
  loading: false,
  stories: [],

  // API Wrappers
  fetchStories: (p) => { return Promise.resolve({type: "FeatureCollection", features:[]}) },
  fetchStory: (p) => { return Promise.resolve({type: "FeatureCollection", features:[]}) },
  fetchPlace: (p) => { return Promise.resolve({type: "FeatureCollection", features:[]}) },

  // Panel Helpers
  handleShowStories: () => { return },
  showIntro: true,
  listView: true,
  toggleListView: () => { return },

  // Story Detail
  selectedStory: undefined,
  setSelectedStory: (s) => { return s},

  // Place Detail
  selectedPlace: undefined,
  closePlaceChip: () => { return Promise.resolve({type: "FeatureCollection", features:[]}) },

  // Sort Helpers
  handleSort: (s) => { return s},
  sort: 'recent',
  sortOptions: sortOptions,

  // Filter Helpers
  handleFilter: (c, o, s) => { return {} },
  selectedFilter: undefined,
  selectedOptions: undefined,
})

export const CommunityProvider = ({ children }: {children: ReactNode}) => {
  const { slug } = useParams<{slug: string}>()

  const [loading, setLoading] = useState<boolean>(false)
  const [showIntro, setShowIntro] = useState<boolean>(true)
  const [stories, setStories] = useState<TypeStory[]>([])
  const [selectedStory, setSelectedStory] = useState<TypeStory>()
  const [selectedPlace, setSelectedPlace] = useState<TypePlace>()

  const [listView, setListView] = useState<boolean>(true)
  const [sort, setSort] = useState<string>('recent')
  const [{selectedFilter, selectedOptions}, setFilterState] = useState<FilterState>({
    selectedFilter: undefined,
    selectedOptions: undefined,
  })

  async function fetchStories(urlParams:SelectedFilters = {}, useFilterState = false) {
    if (!slug) return
    setLoading(true)

    let queryParams:SelectedFilters = {}
    if (useFilterState && selectedFilter && selectedOptions) {
      queryParams[selectedFilter] = selectedOptions.map((opt) => opt.value)
    }

    const resp = await getStories(slug, {...queryParams, ...urlParams})
    setStories(resp.data.stories.sort((a: TypeStory, b: TypeStory) => (sortOptions[sort].fn(a, b))))

    setLoading(false)
    return resp.data.points
  }

  async function fetchStory(storyId: string) {
    if (!slug) return
    setLoading(true)

    const resp = await getStory(slug, storyId)
    setSelectedStory(resp.data)

    setLoading(false)
    return resp.data.points
  }

  async function fetchPlace(placeId: string | number) {
    if (!slug) return
    setLoading(true)
    setShowIntro(false)

    const resp = await getPlace(slug, placeId)
    setStories(resp.data.stories.sort((a: TypeStory, b: TypeStory) => (sortOptions[sort].fn(a, b))))
    setSelectedPlace(resp.data)

    setLoading(false)
    return resp.data.points
  }

  async function closePlaceChip() {
    if (!slug) return

    setSelectedPlace(undefined)
    return await fetchStories({}, true)
  }

  function handleShowStories() {
    if (loading) return
    setShowIntro(false)
    return fetchStories()
  }

  function handleSort(sort: string) {
    setLoading(true)
    if (sortOptions[sort]) {
      setSort(sort)
      const storyArray = [...stories]
      setStories(storyArray.sort((a, b)=>(sortOptions[sort].fn(a, b))))
    }
    setLoading(false)
  }

  function handleFilter(category: string | undefined, options: FilterOption[], sort: string) {
    let selectedOptions:SelectedFilters = {}
    if (category) {
      selectedOptions[category] = options.map((opt) => opt.value)
    }
    setFilterState({
      selectedFilter: category,
      selectedOptions: options
    })
    setSort(sort)
    return selectedOptions
  }

  function toggleListView() {
    setListView(!listView)
  }

  return (
    <CommunityContext.Provider
      value={{
        loading,
        stories,

        // API Wrappers
        fetchStory,
        fetchStories,
        fetchPlace,

        // Panel Helpers
        handleShowStories,
        showIntro,
        listView,
        toggleListView,

        // Story Detail
        selectedStory,
        setSelectedStory,

        // Place Detail
        selectedPlace,
        closePlaceChip,

        // Sort Helpers
        handleSort,
        sort,
        sortOptions,

        // Filter Helpers
        handleFilter,
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
