import React from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { animated, SpringValues } from '@react-spring/web'

import LanguagePicker from 'components/LanguagePicker'

import CommunitySwitcherModal from './components/CommunitySwitcherModal'
import Header from './components/Header'
import StoryPanel from './components/StoryPanel'

import useMouseDraggable from './hooks/useMouseDraggable'
import useTouchDraggable from './hooks/useTouchDraggable'

import useMobile from 'hooks/useMobile'

import type { TypeCommunity } from 'types'

import './styles.css'

type PanelProps = {
  community: TypeCommunity
}
type PanelSpringValues = SpringValues<{
  height?: string
  x?: number
}>

export default function SidePanel({ community }: PanelProps) {
  const { t } = useTranslation()

  const panelRef = React.useRef<HTMLDivElement>(null)
  const panelResizeableRef = React.useRef<HTMLDivElement>(null)

  const { isMobile } = useMobile()

  // Community Switcher Modal
  const [showCommunitySwitcherModal, setShowCommunitySwitcherModal] = React.useState<boolean>(false)

  // Panel Responsive Mouse Events
  const { browserSprings, open } = useMouseDraggable(panelRef, panelResizeableRef, isMobile)

  // Panel Mobile Touch Events
  const { mobileSprings, dragging, touchEnd } = useTouchDraggable(panelResizeableRef, isMobile)


  // Dynamic Panel Styles
  // These are either set by react-spring or mobile drag events
  const panelStyles = (springs: PanelSpringValues) => {
    if (dragging) {
      return { top: touchEnd }
    } else {
      return springs
    }
  }

  return (
    <animated.div ref={panelRef} style={panelStyles(isMobile ? mobileSprings : browserSprings)} className={`panelContainer ${open ? "panelOpen" : "panelClosed"}`}>
      <div ref={panelResizeableRef} className="panelTab"></div>
      <div className="panel">
        <Header
          displayLogo={community.details.displayImage}
          name={community.name} />
        <StoryPanel
          categories={community.categories}
          filters={community.filters}
          storiesCount={community.storiesCount}
          details={community.details}
        />
        <div className="panelLinks">
          <div>
            <a href={`${process.env.REACT_APP_PRIVATE_BASE}/users/sign_in`}>{t('login')}</a>
            <span role="link" onClick={() => {setShowCommunitySwitcherModal(true)}}>{t('switch_communities')}</span>
          </div>
          <LanguagePicker />
        </div>
      </div>
      {showCommunitySwitcherModal && createPortal(
        <CommunitySwitcherModal handleClose={() => setShowCommunitySwitcherModal(false)} />,
        document.body
      )}
    </animated.div>
  )
}
