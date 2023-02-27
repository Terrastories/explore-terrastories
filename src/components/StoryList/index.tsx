import React from 'react'

import Story from 'components/Story'
import Loading from 'components/Loading'

import Sort from 'components/Sort'

import { ReactComponent as GridIcon } from './assets/grid_view.svg'
import { ReactComponent as ListIcon } from './assets/list_view.svg'

import { TypeStory } from 'types'
import './styles.css'

type StoryListItems = {
  stories: TypeStory[],
  loading: boolean,
  showStories: boolean,
  totalStories: number,
  filteredStoriesCount: number,
  sorts: {[value: string]: any},
  defaultSort: string,
  handleSortOnlyChange: (sort: string) => void
}

export default function StoryList(props: StoryListItems) {
  let {
    stories,
    defaultSort,
    sorts,
    loading,
    showStories,
    totalStories,
    filteredStoriesCount,
    handleSortOnlyChange,
  } = props

  const [listView, setListView] = React.useState<boolean>(true)

  const toggleListView = () => {
    setListView(!listView)
  }

  const handleSortChange = (sort: string) => {
    handleSortOnlyChange(sort)
  }

  return (
    <>
      {!showStories &&
        <div>
          This will eventually be start-exploring panel.
        </div>}
      {showStories &&
        <>
        <div className={'storyListControls'}>
          <div className={`controlsGroup ${showStories ? '' : 'hidden'}`}>
            <Sort
              onSort={handleSortChange}
              sortOptions={sorts}
              defaultSort={defaultSort}
              />
            { listView ?
              <GridIcon onClick={toggleListView} className={'icon'} /> :
              <ListIcon onClick={toggleListView} className={'icon'} /> }
          </div>
        </div>
        <div>There are {filteredStoriesCount} of {totalStories} to explore.</div>
        <div className={`storyListContainer ${listView ? 'list' : 'grid'}`}>
          {loading && <Loading />}
          {!loading && stories.map((story) => (
            <Story key={story.id} story={story} />
          ))}
        </div>
        </>}
    </>
  )
}
