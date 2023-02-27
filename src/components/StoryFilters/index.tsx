import React from 'react'
import Select from 'react-select'

import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import type { ActionMeta, SelectInstance, SingleValue, PropsValue } from 'react-select'
import { FilterOption, CategoryOption } from 'types'

import './styles.css'

type Props = {
  categories: CategoryOption[],
  filters: FilterOption[],
}

interface IFilterState {
  [filterCategory: string]: any
  filterCategory: string | undefined
  filterOptions: FilterOption[] | undefined
}

interface IFilterAction {
  type: string
  value?: IFilterState
}

export default function StoryFilters(props: Props) {
  const {
    categories,
    filters,
  } = props

  const { sort, selectedFilter, selectedOptions, handleFilter, fetchStories } = useCommunity()
  const { updateStoryPoints } = useMapConfig()

  const optionRef = React.useRef<SelectInstance<FilterOption>>(null)

  const initialFilterState:IFilterState = {
    filterCategory: undefined,
    filterOptions: undefined,
  }

  const filterReducer = (state: IFilterState, action: IFilterAction): IFilterState => {
    if (action.type === 'clear') {
      return initialFilterState
    }
    if (action.value && action.type === 'updateFilters') {
      return action.value
    }
    return state
  }

  const [state, dispatch] = React.useReducer(filterReducer, initialFilterState, () => (initialFilterState))
  const {filterCategory, filterOptions} = state

  const handleCategoryChange = (option: SingleValue<CategoryOption>, actionMeta: ActionMeta<CategoryOption>) => {
    switch (actionMeta.action) {
      case 'select-option':
        if (!option) break
        if (option.value === filterCategory) return
        handleFilter(option.value, [], sort)
        if (optionRef.current && optionRef.current.hasValue()) optionRef.current.clearValue()
        break
      case 'clear':
        dispatch({type: 'clear'})
        // selected options already empty (filters already reset to all stories)
        let skipFetch = selectedOptions && selectedOptions.length === 0
        let opts = handleFilter(undefined, [], sort)
        if (!skipFetch) {
          fetchStories(opts).then(
            (newPoints) => updateStoryPoints(newPoints)
          )
        }
        break
      }
  }

  const handleOptionChange = (options: PropsValue<FilterOption>, actionMeta: ActionMeta<FilterOption>)  => {
    switch (actionMeta.action) {
      case 'select-option':
      case 'remove-value':
        if (!options) break
        fetchStories(handleFilter(filterCategory, options as FilterOption[], sort)).then(
          (newPoints) => updateStoryPoints(newPoints)
        )
        break
      case 'clear':
        fetchStories(handleFilter(filterCategory, [], sort)).then(
          (newPoints) => updateStoryPoints(newPoints)
        )
        break
    }
  }

  React.useEffect(() => {
    if (selectedFilter) {
      dispatch({
        type: 'updateFilters',
        value: {
          filterCategory: selectedFilter,
          filterOptions: filters.filter((filter) => selectedFilter === filter.category),
        }
      })
    }
  }, [selectedFilter, filters])

  return (
    <div>
      <div>Filter Stories</div>
      <Select
        options={categories}
        value={categories.find(c => c.value === selectedFilter)}
        className={"filterSelect"}
        isClearable={true}
        onChange={handleCategoryChange} />
      <Select
        ref={optionRef}
        value={selectedOptions}
        isMulti
        options={filterOptions}
        isDisabled={!filterOptions}
        className={"filterSelect"}
        onChange={handleOptionChange} />
    </div>
  )
}
