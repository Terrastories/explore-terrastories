import React from 'react'
import { useTranslation } from 'react-i18next'

import Icon from 'components/Icon'

import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import Breadcrumbs from './Breadcrumbs'
import StoryDetail from './StoryDetail'
import StoryList from './StoryList'

import ExploreIntro from './ExploreIntro'

import { FilterOption, TypeCommunityDetails } from 'types'

type PanelProps = {
  categories: string[],
  filters: FilterOption[],
  storiesCount: number,
  details: TypeCommunityDetails,
}

export default function StoryPanel(props :PanelProps) {
  const { t } = useTranslation()
  const { closePlaceChip, showIntro, selectedStory, selectedPlace, setSelectedStory } = useCommunity()
  const { updateStoryPoints, stashedPoints, setStashedPoints } = useMapConfig()

  const hasBreadcrumbs = selectedStory || selectedPlace

  const resetPanel = React.useCallback(() => {
    setSelectedStory(undefined)
    if (selectedPlace)
      closePlaceChip().then((points) => updateStoryPoints(points, !!stashedPoints))
  }, [selectedPlace, setSelectedStory, closePlaceChip, updateStoryPoints, stashedPoints])

  const handleCloseStoryDetail = React.useCallback(() => {
    setSelectedStory(undefined)
    if (stashedPoints) {
      updateStoryPoints(stashedPoints, !!selectedPlace)
      setStashedPoints(undefined)
    }
  }, [setSelectedStory, updateStoryPoints, setStashedPoints, stashedPoints, selectedPlace])

  return (
    (showIntro && !selectedPlace)
      ? <ExploreIntro details={props.details} />
      : <>
        <Breadcrumbs>
          <span role={hasBreadcrumbs ? 'link' : ''} onClick={hasBreadcrumbs ? resetPanel : undefined}>{t('translation:stories')}</span>
          {selectedPlace &&
            <span className='iconGroup' role={selectedStory ? 'link' : ''} onClick={selectedStory ? handleCloseStoryDetail : undefined}>
              <Icon icon='pin' alt='pin' />
              <span className='clampTitle'>{selectedPlace.name}</span>
            </span>}
          {selectedStory &&
            <span className='clampTitle' title={selectedStory.title}>{selectedStory.title}</span>}
        </Breadcrumbs>
        {selectedStory
          ? <StoryDetail />
          : <StoryList {...props} />}
        </>
  )
}
