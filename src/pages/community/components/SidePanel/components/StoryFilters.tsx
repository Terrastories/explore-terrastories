import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import Select from 'components/Select'
import { useCommunity } from 'contexts/CommunityContext'
import { useMapConfig } from 'contexts/MapContext'

import type { ActionMeta, SelectInstance, SingleValue, PropsValue } from 'react-select'
import { FilterOption, CategoryOption } from 'types'

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

const FilterSelectGroup = styled.div`
.filterSelect + .filterSelect {
  margin-top: 0.5rem;
}
`

export default function StoryFilters(props: Props) {
  const { t } = useTranslation()
  const {
    categories,
    filters,
  } = props

  const { selectedFilter, selectedOptions, handleFilter, fetchStories } = useCommunity()
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
        handleFilter(option.value, [])
        if (optionRef.current && optionRef.current.hasValue()) optionRef.current.clearValue()
        break
      case 'clear':
        dispatch({type: 'clear'})
        // selected options already empty (filters already reset to all stories)
        let skipFetch = selectedOptions && selectedOptions.length === 0
        let opts = handleFilter(undefined, [])
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
        fetchStories(handleFilter(filterCategory, options as FilterOption[])).then(
          (newPoints) => updateStoryPoints(newPoints)
        )
        break
      case 'clear':
        fetchStories(handleFilter(filterCategory, [])).then(
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
    <FilterSelectGroup>
      <div>{t('filter_stories')}</div>
      <Select
        placeholder={t('select_category')}
        options={categories}
        value={categories.find(c => c.value === selectedFilter)}
        className={"filterSelect"}
        isClearable={true}
        onChange={handleCategoryChange} />
      <Select
        forwardRef={optionRef}
        value={selectedOptions}
        isMulti
        placeholder={t('select_option')}
        options={filterOptions}
        isDisabled={!filterOptions}
        className={"filterSelect"}
        onChange={handleOptionChange} />
    </FilterSelectGroup>
  )
}
