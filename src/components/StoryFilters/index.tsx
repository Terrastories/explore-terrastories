import React from 'react'
import Select from 'react-select'
import type { ActionMeta, SelectInstance, SingleValue, PropsValue } from 'react-select'
import { FilterOption, CategoryOption } from 'types'

import './styles.css'

type Props = {
  categories: CategoryOption[],
  filters: FilterOption[],
  handleFilterChange: (category: string | undefined, options: FilterOption[], sort: string) => void,
  sort: string,
  selectedFilter?: string,
  selectedOptions?: FilterOption[],
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
    handleFilterChange,
    sort,
    selectedFilter,
    selectedOptions,
  } = props

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
  const categoryValue = categories.find(c => selectedOptions ? c.value === selectedFilter : false)

  const handleCategoryChange = (option: SingleValue<CategoryOption>, actionMeta: ActionMeta<CategoryOption>) => {
    switch (actionMeta.action) {
      case 'select-option':
        if (!option) break
        if (option.value === filterCategory) return
        dispatch({
          type: 'updateFilters',
          value: {
            filterCategory: option.value,
            filterOptions: filters.filter((filter) => option.value === filter.category),
          }
        })
        if (optionRef.current && optionRef.current.hasValue()) optionRef.current.clearValue()
        break
      case 'clear':
        dispatch({type: 'clear'})
        handleFilterChange(undefined, [], sort)
        break
      }
  }

  const handleOptionChange = (options: PropsValue<FilterOption>, actionMeta: ActionMeta<FilterOption>)  => {
    switch (actionMeta.action) {
      case 'select-option':
      case 'remove-value':
        if (!options) break
        handleFilterChange(filterCategory, options as FilterOption[], sort)
        break
      case 'clear':
        handleFilterChange(filterCategory, [], sort)
        break
    }
  }

  React.useEffect(() => {
    if (categoryValue) {
      dispatch({
        type: 'updateFilters',
        value: {
          filterCategory: categoryValue.value,
          filterOptions: filters.filter((filter) => categoryValue.value === filter.category),
        }
      })
    }
  }, [categoryValue, filters])

  return (
    <div>
      <div>Filter Stories</div>
      <Select
        options={categories}
        defaultValue={categoryValue}
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
