import React from "react"
import { useTranslation } from "react-i18next"
import {components, DropdownIndicatorProps, SingleValue} from "react-select"

import Select from "components/Select"
import Icon from "components/Icon"

import { useCommunity } from "contexts/CommunityContext"

interface SortOption {
  label: string
  value: string
}

export default function Sort() {
  const { t } = useTranslation()
  const [options, setOptions] = React.useState<SortOption[]>()
  const { sortStories, selectedSort, sortOptions, fetchStories } = useCommunity()

  const [updateStoryList, setUpdateStoryList] = React.useState(false)

  const DropdownIndicator = (
    props: DropdownIndicatorProps<SortOption, false>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon icon='sort' alt='sort' />
      </components.DropdownIndicator>
    )
  }

  React.useEffect(() => {
    if (!options) {
      const opts:SortOption[] = []
      for(const opt of Object.keys(sortOptions)) {
        opts.push({
          label: t(`sorts.${opt}`),
          value: opt
        })
      }
      setOptions(opts)
    }
  }, [options, sortOptions, t])

  const handleSortChange = (option: SingleValue<SortOption>) => {
    if (option) {
      sortStories(option.value)
      setUpdateStoryList(true)
    }
  }

  const defaultSort = (sort: string | undefined) => {
    const sortOpt = sort ? sort : "recent"
    return {
      label: t(`sorts.${sortOpt}`),
      value: sortOpt
    }
  }

  React.useEffect(() => {
    if (selectedSort && updateStoryList) {
      setUpdateStoryList(false)
      Promise.resolve(fetchStories(true))
    }
  }, [selectedSort, updateStoryList, fetchStories])

  return(
    <Select
      useTinySelect={true}
      defaultValue={defaultSort(selectedSort)}
      isSearchable={false}
      components={{DropdownIndicator}}
      options={options}
      onChange={handleSortChange} />
  )
}