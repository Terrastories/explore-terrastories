import React from "react"
import { useMemo } from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

import { useCommunity } from "contexts/CommunityContext"
import { useMapConfig } from "contexts/MapContext"

import Icon from "components/Icon"

import logomark from "logomark.svg"

import type { TypeStory } from "types"

type Props = {
  story: TypeStory,
  grid: boolean,
}

const ItemContainer = styled.div<{ $grid: boolean }>`
display: flex;
justify-content: space-between;
gap: ${props => (props.$grid ? "0.5rem": "1rem")};
flex-direction: ${props => (props.$grid ? "column" : "row")};
margin: 0.25rem;

> svg {
  height: ${props => (props.$grid ? "24px": "36px")};
  width: ${props => (props.$grid ? "24px": "36px")};
  align-self: center;

  // fixed size
  flex-shrink: 0;
  flex-grow: 0;
}

> div {
  flex-basis: ${props => (props.$grid ? "100%": "6rem")};
  flex-shrink: 1;
}

padding: 1rem;
${props => (props.$grid ? "padding-bottom: 0": "padding-right: 0")};

background-color: #fff;
box-shadow: 0 1px 4px rgb(102 102 102 / 10%);

&:hover {
  cursor: pointer;
  box-shadow: 0 0 4px 2px rgb(102 102 102 / 20%);
}

h2 {
  font-size: 1.25rem;
  margin: 0 0 0.25rem 0;
}
`
const MediaPreview = styled.div`
position: relative;
min-height: 4.5rem;
max-height: 4.5rem;
flex-grow: 0;

.previewImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.previewPlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: #ababab;
  }

  img {
    max-height: 100%;
    padding: 0.5rem;
    filter: grayscale(80%);
  }
}

.previewPlaceholder.filled {
  background-color: #efefef;
}
`
const MediaTypesIndicators = styled.span`
display: flex;
gap: 0.25rem;

background-color: rgb(0 0 0 / 60%);
width: 100%;
padding: 0 0.25rem;

// overlay over media preview image or image placeholder
position: absolute;
bottom: 0;
left: 0;

overflow-x: hidden;

svg {
  fill: white;
  flex-basis: 18px;
}
`

const StoryPreview = styled.div`
flex-grow: 1;

h2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  font-size: 1rem;
}
`

export default function StoryListItem({story, grid}: Props) {
  const { t } = useTranslation()

  const { fetchStory } = useCommunity()
  const { setStashedPoints, updateStoryPoints, points } = useMapConfig()

  const handleStoryClick = (e: React.MouseEvent) => {
    const clickedStory = e.currentTarget.getAttribute("data-story-id")
    if (!clickedStory) return
    handleStorySelection(clickedStory)
  }

  function handleStorySelection(storyId: string) {
    fetchStory(storyId)
      .then((newPoints) => {
        if (newPoints) {
          setStashedPoints(points)
          updateStoryPoints(newPoints, true)
        }
      })
  }

  const mediaPreview = useMemo(
    () => {
      if (story.mediaPreviewUrl) {
        return(
          <MediaPreview>
            <img className="previewImage" src={story.mediaPreviewUrl} alt='media preview' />
            <MediaTypesIndicators>
              {story.mediaContentTypes && story.mediaContentTypes.map((m) => (
                <Icon key={m} icon={m} alt={m} />
              ))}
            </MediaTypesIndicators>
          </MediaPreview>
        )
      }

      if (story.mediaContentTypes && story.mediaContentTypes.length > 0) {
        const [first, ...rest] = story.mediaContentTypes
        return(
          <MediaPreview>
            <span className="previewPlaceholder filled">
              <Icon key={first} icon={first} alt={first} />
            </span>
            <MediaTypesIndicators>
              {rest && rest.map((m) => (
                <Icon key={m} icon={m} alt={m} />
              ))}
            </MediaTypesIndicators>
          </MediaPreview>
        )
      }

      return(
        <MediaPreview>
          <span className="previewPlaceholder">
            <img src={logomark} alt={t("no_media")} />
          </span>
        </MediaPreview>
      )
    },
    [story, t]
  )

  return (
    <ItemContainer onClick={handleStoryClick} data-story-id={story.id} $grid={grid}>
      {mediaPreview}
      <StoryPreview>
        <h2 title={story.title}>{story.title}</h2>
        {story.topic && <span className="badge">{story.topic}</span>}
      </StoryPreview>
      <Icon icon={"chevron-right"} alt={"see detail"} />
    </ItemContainer>
  )
}
