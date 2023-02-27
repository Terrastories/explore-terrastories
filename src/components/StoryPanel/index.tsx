import React from 'react'

import StoryFilters from 'components/StoryFilters'
import Header from 'components/Header'
import './styles.css'

import { FilterOption, CategoryOption } from 'types'

type PanelProps = {
  isMobile: boolean,
  communitySlug: string,
  categories: CategoryOption[],
  filters: FilterOption[],
  storiesCount: number
}

export default function StoryPanel({isMobile, communitySlug, categories, filters, storiesCount = 0}:PanelProps) {
  const [open, setToggle] = React.useState<boolean>(true)
  const [fullScreen, setfullScreen] = React.useState<boolean>(false)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const [filteredStoriesCount, setStoriesCount] = React.useState<number>(storiesCount)

  const handleFilterChange = (category: string, options: string[]) => {
    console.log("fetch updated stories: " + category)
    console.log("options: ", options)
    setStoriesCount(4)
  }

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
        <div>Filter Stories</div>
        <StoryFilters
          categories={categories}
          filters={filters}
          handleFilterChange={handleFilterChange}
          />
        <div>
          There are {filteredStoriesCount} stories to explore in
        </div>
      </div>
    </div>
  )
}
