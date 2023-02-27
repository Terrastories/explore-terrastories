import React from 'react'

import StoryFilters from 'components/StoryFilters'
import StoryList from 'components/StoryList'
import StoryDetail from 'components/StoryDetail'
import Header from 'components/Header'

import './styles.css'

import http from 'utils/http'

import { FilterOption, CategoryOption, TypeStory } from 'types'
import { FeatureCollection } from 'geojson'

type PanelProps = {
  isMobile: boolean,
  communitySlug: string,
  categories: CategoryOption[],
  filters: FilterOption[],
  storiesCount: number,
  points: FeatureCollection,
  handleStoriesChange: (points: FeatureCollection) => void
}

type SelectedFilters = {
  [key: string]: any
}

const DEFAULT_SORT = 'recent'
const sorts:{
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

export default function StoryPanel(props :PanelProps) {
  const {
    isMobile,
    communitySlug,
    categories,
    filters,
    storiesCount,
    handleStoriesChange,
    points,
  } = props

  const [open, setToggle] = React.useState<boolean>(true)
  const [fullScreen, setfullScreen] = React.useState<boolean>(false)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const [stories, setStories] = React.useState<TypeStory[]>([])
  const [loading, setLoading] = React.useState(false)

  const [sort, setSort] = React.useState<string>(DEFAULT_SORT)
  const initialFilterState:{
    filterCategory: string | undefined,
    filterOptions: FilterOption[] | undefined
  } = {
    filterCategory: undefined,
    filterOptions: undefined,
  }
  const [{filterCategory, filterOptions}, setFilterState] = React.useState(initialFilterState)
  const [filteredStoriesCount, setStoriesCount] = React.useState<number>(storiesCount)

  const [selectedStory, setSelectedStory] = React.useState<TypeStory>()
  const [stashedStoryPoints, setStoryPointStash] = React.useState<FeatureCollection>()

  const [showStories, setShowStories] = React.useState<boolean>(false)

  const fetchStories = React.useCallback((urlparams = {}) => {
    setLoading(true)
    http.get(`/api/communities/${communitySlug}/stories`, {
      params: urlparams
    })
    .then((resp) => {
      setStories(resp.data.stories.sort((a: TypeStory, b: TypeStory) => (sorts[sort].fn(a, b))))
      setStoriesCount(resp.data.total)
      handleStoriesChange(resp.data.points)
      setShowStories(true)
    })
    .catch(err => {
      console.log(err)
      setShowStories(false)
    })
    .finally(() => setLoading(false))
  }, [communitySlug, handleStoriesChange, sort])

  const fetchStory = React.useCallback((storyId: string) => {
    setLoading(true)
    http.get(`/api/communities/${communitySlug}/stories/${storyId}`)
    .then((resp) => {
      setSelectedStory(resp.data)
      handleStoriesChange(resp.data.points)
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => setLoading(false))
  }, [communitySlug, handleStoriesChange])


  const handleFilterChange = (category: string | undefined, options: FilterOption[], sort: string) => {
    let selectedOptions:SelectedFilters = {}
    if (category) {
      selectedOptions[category] = options.map((opt) => opt.value)
    }
    setFilterState({
      filterCategory: category,
      filterOptions: options
    })
    setSort(sort)
    fetchStories(selectedOptions)
  }

  const handleSortOnlyChange = (sort: string) => {
    setLoading(true)
    setSort(sort)
    if (sorts[sort]) {
      const storyArray = [...stories]
      setStories(storyArray.sort((a, b) => (sorts[sort].fn(a, b))))
      setShowStories(true)
    }
    setLoading(false)
  }

  // Panel Event Handlers
  const handlePanelToggle: React.MouseEventHandler = () => {
    // Don't handle mouse toggle events if mobile (this should only be relevant on browser mobile)
    if (isMobile) return

    setToggle(!open)
  }

  const handlePanelSwipeStart: React.TouchEventHandler = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }
  const handlePanelSwipeMove: React.TouchEventHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }
  const handlePanelSwipeEnd: React.TouchEventHandler = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return

    if (fullScreen && touchStart < touchEnd) {
      setfullScreen(false)
    } else if (open && touchStart > touchEnd) {
      setfullScreen(true)
    } else {
      setToggle(!open)
    }
  }

  const handleStorySelection = (storyId: string) => {
    setStoryPointStash(points)
    fetchStory(storyId)
  }

  const handleCloseStoryDetail = () => {
    setSelectedStory(undefined)
    if (stashedStoryPoints) {
      handleStoriesChange(stashedStoryPoints)
      setStoryPointStash(undefined)
    }
  }

  return (
    <div className={`panelContainer ${fullScreen ? "panelFullScreen" : open ? "panelOpen" : "panelClosed"}`}>
      <div className="panelTab"
        onClick={handlePanelToggle}
        onTouchStart={handlePanelSwipeStart}
        onTouchMove={handlePanelSwipeMove}
        onTouchEnd={handlePanelSwipeEnd}
      ></div>
      <div className="panel">
        {!isMobile && <Header />}
        {selectedStory &&
          <StoryDetail
            story={selectedStory}
            handleCloseStoryDetail={handleCloseStoryDetail}
            />}
        {!selectedStory &&
          <>
            <StoryFilters
              categories={categories}
              filters={filters}
              selectedFilter={filterCategory}
              selectedOptions={filterOptions}
              handleFilterChange={handleFilterChange}
              sort={sort}
              />
            <StoryList
              showStories={showStories}
              stories={stories}
              loading={loading}
              filteredStoriesCount={filteredStoriesCount}
              totalStories={storiesCount}
              handleSortOnlyChange={handleSortOnlyChange}
              sorts={sorts}
              defaultSort={DEFAULT_SORT}
              handleStorySelection={handleStorySelection}
              />
          </>}
      </div>
    </div>
  )
}
