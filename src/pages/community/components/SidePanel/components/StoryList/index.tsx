import React from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

import EmptyList from "components/EmptyList"
import Heading from "components/Heading"
import Icon from "components/Icon"
import Loading from "components/Loading"

import Sort from "./components/Sort"
import StoryFilters from "./components/StoryFilters"
import StoryListItem from "./components/StoryListItem"

import type { FilterOption } from "types"

import { useCommunity } from "contexts/CommunityContext"

const IconButton = styled.button`
margin: 0;
padding: 0;
border: none;
max-height: 24px;
max-width: 24px;
`

const StoryListControl = styled.div`
.controlsGroup {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin: 1rem 0;
  white-space: nowrap;
  opacity: 1;
}
`

const StoryListContainer = styled.div`
margin-bottom: auto;
overflow-x: hidden;
overflow-y: auto;

#paginationObserver {
  height: 1px;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 0;
}

&.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

&.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
`

type PanelProps = {
  categories: string[],
  filters: FilterOption[],
}

export default function StoryList({categories, filters}: PanelProps) {
  const { t } = useTranslation(["community", "translation"])
  const observerRef = React.useRef(null)
  const scrollableContainerRef = React.useRef<HTMLDivElement>(null)

  const { loading, stories, selectedPlace, fetchPaginatedStories, listView, toggleListView } = useCommunity()

  const hasStories = stories.length > 0

  // Scroll Top
  //
  // Automatically scroll story list scrollable content
  // to the top when selectedPlace is selected or deselected
  React.useEffect(() => {
    if (!scrollableContainerRef.current) return

    scrollableContainerRef.current.scrollTop = 0
  }, [scrollableContainerRef, selectedPlace])

  // Pagination Observer
  //
  // Available when StoryList is not loading. This will
  // attempt to fetch the next "page" of stories whenever
  // the observer is 100% in view.
  React.useEffect(() => {
    if (loading) return
    if (!observerRef.current) return

    const el = observerRef.current

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) fetchPaginatedStories()
      },
      {threshold: [0.25]}
    )

    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [loading, observerRef, fetchPaginatedStories])

  return (
    <>
      {selectedPlace
        ? <Heading title={selectedPlace.name}>
          {selectedPlace.region && <span className="badge square">{selectedPlace.region}</span>}
          {selectedPlace.typeOfPlace && <span className="badge square">{selectedPlace.typeOfPlace}</span>}
        </Heading>
        : <StoryListControl>
          <StoryFilters
            categories={categories}
            filters={filters} />
          <div className={"controlsGroup"}>
            <Sort />
            <IconButton type='button' onClick={toggleListView}>
              { listView
                ? <Icon icon='grid' alt={t("switch_to_grid")} />
                : <Icon icon='list' alt={t("switch_to_list")} /> }
            </IconButton>
          </div>
        </StoryListControl>}
      <StoryListContainer ref={scrollableContainerRef} className={listView ? "list" : "grid"}>
        {selectedPlace &&
        <>
          {selectedPlace.description}
          <h3>{t("translation:stories")}</h3>
        </>}

        {!loading && !selectedPlace && !hasStories &&
        <EmptyList message={t("translation:errors.empty", {resources: t("translation:stories")})} />}
        {stories.map((story) => (
          <StoryListItem
            key={story.id}
            story={story}
            grid={!listView} />
        ))}
        {loading ?
          <Loading /> :
          <span ref={observerRef} id='paginationObserver'></span>}
      </StoryListContainer>
    </>
  )
}
