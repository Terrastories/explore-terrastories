import React from 'react'
import Select from 'react-select'
import type { ActionMeta, SelectInstance, SingleValue, PropsValue, Options } from 'react-select'
import { FilterOption, CategoryOption } from 'types'

import './styles.css'

type Props = {
  categories: CategoryOption[],
  filters: FilterOption[],
  handleFilterChange: (category: string | undefined, options: FilterOption[], sort: string) => void,
  sort: string,
}

export default function StoryFilters(props: Props) {
  const {
    categories,
    filters,
    handleFilterChange,
    sort
  } = props

  const optionRef = React.useRef<SelectInstance<FilterOption>>(null)
  const [filterCategory, setFilterCategory] = React.useState<string>()
  const [filterOptions, setFilterOptions] = React.useState<Options<FilterOption>>()

  const handleCategoryChange = (option: SingleValue<CategoryOption>, actionMeta: ActionMeta<CategoryOption>) => {
    switch (actionMeta.action) {
      case 'select-option':
        if (!option) break
        if (option.value === filterCategory) return
        setFilterCategory(option.value)
        setFilterOptions(filters.filter((filter) => option.value === filter.category))
        break
      case 'clear':
        setFilterCategory(undefined)
        handleFilterChange(filterCategory, [], sort)
        break
    }

    if (optionRef.current) optionRef.current.clearValue()
  }

  const handleOptionChange = (options: PropsValue<FilterOption>, actionMeta: ActionMeta<FilterOption>)  => {
    if (!filterCategory) return
    if (options) {
      handleFilterChange(filterCategory, options as FilterOption[], sort)
    } else {
      handleFilterChange(filterCategory, [], sort)
    }
  }

  return (
    <div>
      <div>Filter Stories</div>
      <Select
        options={categories}
        className={"filterSelect"}
        isClearable={true}
        onChange={handleCategoryChange} />
      <Select
        ref={optionRef}
        isMulti
        options={filterOptions}
        isDisabled={!filterCategory}
        className={"filterSelect"}
        onChange={handleOptionChange} />
    </div>
  )
}
