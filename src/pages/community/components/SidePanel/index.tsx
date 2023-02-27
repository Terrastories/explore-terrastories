import React from 'react'

import { useCommunity } from 'contexts/CommunityContext'

import Header from './components/Header'
import ExploreIntro from './components/ExploreIntro'
import StoryPanel from './components/StoryPanel'
import StoryDetail from './components/StoryDetail'

import useMobile from 'hooks/useMobile'

import type { TypeCommunity } from 'types'

import './styles.css'

type PanelProps = {
  community: TypeCommunity
}

export default function SidePanel({ community }: PanelProps) {
  const [open, setOpen] = React.useState<boolean>(true)
  const [fullScreen, setfullScreen] = React.useState<boolean>(false)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const { showIntro, selectedStory, stories } = useCommunity()

  const isMobile = useMobile()

  // Panel Event Handlers
  const handlePanelToggle: React.MouseEventHandler = () => {
    // Don't handle mouse toggle events if mobile (this should only be relevant on browser mobile)
    if (isMobile) return

    setOpen(!open)
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
      setOpen(!open)
    }
  }

  const showStories = stories.length > 0

  return (
    <div className={`panelContainer ${fullScreen ? "panelFullScreen" : open ? "panelOpen" : "panelClosed"}`}>
      <div className="panelTab"
        onClick={handlePanelToggle}
        onTouchStart={handlePanelSwipeStart}
        onTouchMove={handlePanelSwipeMove}
        onTouchEnd={handlePanelSwipeEnd}
      ></div>
      <div className="panel">
        <Header />
        {showIntro &&
          <ExploreIntro
            details={community.details} />}
        {!showIntro &&
          <>
          {selectedStory &&
            <StoryDetail
              story={selectedStory} />}
          {!selectedStory && showStories &&
            <StoryPanel
              categories={community.categories}
              filters={community.filters}
              storiesCount={community.storiesCount} />}
          </>}
      </div>
    </div>
  )
}
