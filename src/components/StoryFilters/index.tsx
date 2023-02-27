import React from 'react'
import Select from 'react-select'
import type { ActionMeta, SelectInstance, PropsValue, Options, SingleValue } from 'react-select'
import { FilterOption, CategoryOption } from 'types'

type Props = {
  categories: CategoryOption[],
  filters: FilterOption[],
  handleFilterChange: (category: string, options: string[]) => void
}

export default function StoryFilters(props: Props) {
  const optionRef = React.useRef<SelectInstance<FilterOption>>(null)
  const [filterCategory, setFilterCategory] = React.useState<string>()
  const [filterOptions, setFilterOptions] = React.useState<Options<FilterOption>>()

  const {
    categories,
    filters,
    handleFilterChange,
  } = props

  const handleCategoryChange = (newValue: SingleValue<CategoryOption>, actionMeta: ActionMeta<CategoryOption>)  => {
    // Do nothing if clicked category is already selected
    if (newValue && newValue.value === filterCategory) return

    switch (actionMeta.action) {
      case 'select-option':
        if (!newValue) break
        setFilterCategory(newValue.value)
        setFilterOptions(filters.filter((filter) => filter.category === newValue.value))
        break
      case 'clear':
        setFilterCategory(undefined)
        if (optionRef.current) optionRef.current.clearValue()
        break
    }

    if (optionRef.current) optionRef.current.clearValue()
  }

  const handleOptionChange = (newValue: PropsValue<FilterOption>, actionMeta: ActionMeta<FilterOption>)  => {
    if (!filterCategory) return
    if (!newValue) return

    let selectedOptions: string[] = []
    for (let v of newValue as FilterOption[]) {
      if (!v) return
      selectedOptions.push(v.value)
    }
    handleFilterChange(filterCategory, selectedOptions)
  }

  return (
    <div>
      <Select
        options={categories}
        isClearable={true}
        onChange={handleCategoryChange} />
      <Select
        ref={optionRef}
        isMulti
        options={filterOptions}
        isSearchable={true}
        isDisabled={!filterOptions}
        onChange={handleOptionChange}
        noOptionsMessage={() => "no"} />
    </div>
  )
}
