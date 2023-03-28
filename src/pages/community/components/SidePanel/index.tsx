import React from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import LanguagePicker from 'components/LanguagePicker'

import { useCommunity } from 'contexts/CommunityContext'

import CommunitySwitcherModal from './components/CommunitySwitcherModal'
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
  const { t } = useTranslation();
  const [open, setOpen] = React.useState<boolean>(true)
  const [fullScreen, setfullScreen] = React.useState<boolean>(false)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const { showIntro, selectedStory } = useCommunity()

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

  // Modal
  const [showCommunitySwitcherModal, setShowCommunitySwitcherModal] = React.useState<boolean>(false)

  return (
    <div className={`panelContainer ${fullScreen ? "panelFullScreen" : open ? "panelOpen" : "panelClosed"}`}>
      <div className="panelTab"
        onClick={handlePanelToggle}
        onTouchStart={handlePanelSwipeStart}
        onTouchMove={handlePanelSwipeMove}
        onTouchEnd={handlePanelSwipeEnd}
      ></div>
      <div className="panel">
        <Header
          displayLogo={community.details.displayImage}
          name={community.name} />
        {showIntro &&
          <ExploreIntro
            details={community.details} />}
        {!showIntro &&
          <>
          {selectedStory &&
            <StoryDetail
              story={selectedStory} />}
          {!selectedStory &&
            <StoryPanel
              categories={community.categories}
              filters={community.filters}
              storiesCount={community.storiesCount} />}
          </>}
        <div>
          <div className="panelLinks">
            <a href={`${process.env.REACT_APP_PRIVATE_BASE}/users/sign_in`}>{t('login')}</a>
            <span role="link" onClick={() => {setShowCommunitySwitcherModal(true)}}>{t('switch_communities')}</span>
            <LanguagePicker />
          </div>
        </div>
      </div>
      {showCommunitySwitcherModal && createPortal(
        <CommunitySwitcherModal handleClose={() => setShowCommunitySwitcherModal(false)} />,
        document.body
      )}
    </div>
  )
}
