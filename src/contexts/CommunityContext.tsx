import { createContext, useContext, useState, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

import { getStories, getStory } from 'api/storyApi'

import type { FeatureCollection } from 'geojson'
import type { TypeStory, FilterOption } from 'types'

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
  fetchStories: (urlParams: object) => Promise<FeatureCollection>
  fetchStory: (storyId: string) => Promise<FeatureCollection>
  handleShowStories: () => void
  handleSort: (sort: string) => void
  handleFilter: (category: string | undefined, options: FilterOption[], sort: string) => SelectedFilters
  setSelectedStory: (story: TypeStory | undefined) => void
  toggleListView: () => void

  showIntro: boolean
  selectedStory: TypeStory | undefined
  stories: TypeStory[]

  listView: boolean

  sort: string
  sortOptions: {[value: string]: any}

  selectedFilter: string | undefined
  selectedOptions: FilterOption[] | undefined

  loading: boolean
}

const CommunityContext = createContext<CommunityCtx>({
  fetchStories: (p) => { return Promise.resolve({type: "FeatureCollection", features:[]}) },
  fetchStory: (p) => { return Promise.resolve({type: "FeatureCollection", features:[]}) },
  handleShowStories: () => { return },
  handleSort: (s) => { return s},
  handleFilter: (c, o, s) => { return {} },
  setSelectedStory: (s) => { return s},
  toggleListView: () => { return },

  showIntro: true,

  selectedStory: undefined,
  stories: [],

  listView: true,

  sort: 'recent',
  sortOptions: sortOptions,

  selectedFilter: undefined,
  selectedOptions: undefined,

  loading: false,
})

export const CommunityProvider = ({ children }: {children: ReactNode}) => {
  const { slug } = useParams<{slug: string}>()

  const [loading, setLoading] = useState<boolean>(false)
  const [showIntro, setShowIntro] = useState<boolean>(true)
  const [stories, setStories] = useState<TypeStory[]>([])
  const [selectedStory, setSelectedStory] = useState<TypeStory>()

  const [listView, setListView] = useState<boolean>(true)
  const [sort, setSort] = useState<string>('recent')
  const [{selectedFilter, selectedOptions}, setFilterState] = useState<FilterState>({
    selectedFilter: undefined,
    selectedOptions: undefined,
  })

  async function fetchStories(urlParams = {}) {
    if (!slug) return
    setLoading(true)

    const resp = await getStories(slug, urlParams)
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

        // Panel Helpers
        handleShowStories,
        showIntro,
        listView,
        toggleListView,

        // Story Detail
        selectedStory,
        setSelectedStory,

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
