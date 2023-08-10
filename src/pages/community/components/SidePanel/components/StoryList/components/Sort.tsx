import React from 'react'
import { useTranslation } from 'react-i18next'
import {components, DropdownIndicatorProps, SingleValue, ActionMeta} from 'react-select'

import Select from 'components/Select'
import Icon from 'components/Icon'

import { useCommunity } from 'contexts/CommunityContext'

interface SortOption {
  label: string
  value: string
}

export default function Sort() {
  const { t } = useTranslation()
  const [options, setOptions] = React.useState<SortOption[]>()
  const { sortStories, selectedSort, sortOptions } = useCommunity()

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
      let opts:SortOption[] = []
      for(let opt of Object.keys(sortOptions)) {
        opts.push({
          label: t(`sorts.${opt}`),
          value: sortOptions[opt].value
        })
      }
      setOptions(opts)
    }
  }, [options, sortOptions, t])


  const handleSortChange = (option: SingleValue<SortOption>, actionMeta: ActionMeta<SortOption>) => {
    if (option) sortStories(option.value)
  }

  return(
    <Select
      useTinySelect={true}
      defaultValue={{
        label: t(`sorts.${selectedSort}`),
        value: selectedSort
      }}
      isSearchable={false}
      components={{DropdownIndicator}}
      options={options}
      onChange={handleSortChange} />
  )
}