import React from 'react'
import Select, {components, DropdownIndicatorProps, SingleValue, ActionMeta} from 'react-select'

import Icon from 'components/Icon'

import { useCommunity } from 'contexts/CommunityContext'

interface SortOption {
  label: string
  value: string
}

export default function Sort() {
  const [options, setOptions] = React.useState<SortOption[]>()
  const { handleSort, sort, sortOptions } = useCommunity()

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
          label: sortOptions[opt].label, // we'll want to look up translation here in the future
          value: sortOptions[opt].value
        })
      }
      setOptions(opts)
    }
  }, [options, sortOptions])


  const handleSortChange = (option: SingleValue<SortOption>, actionMeta: ActionMeta<SortOption>) => {
    if (option) handleSort(option.value)
  }

  return(
    <Select
      defaultValue={sortOptions[sort]}
      placeholder={''}
      isSearchable={false}
      components={{DropdownIndicator}}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '24px',
          height: '24px',
          background: 'inherit',
          border: 'none',
        }),
        indicatorSeparator: (base, state) => ({
          display: 'none',
        }),
        indicatorsContainer: (base, state) => ({
          ...base,
          maxHeight: '24px',
        }),
        valueContainer: (base, state) => ({
          ...base,
          padding: '0', // unset padding
          paddingLeft: '8px', // set just left
        }),
        menu: (base, state) => ({
          ...base,
          position: 'absolute',
          right: 0,
          width: 'max-content',
        })
      }}
      options={options}
      onChange={handleSortChange} />
  )
}