import React from 'react'
import { useTranslation } from 'react-i18next'
import Select, {components, DropdownIndicatorProps, SingleValue, ActionMeta} from 'react-select'

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
      defaultValue={{
        label: t(`sorts.${selectedSort}`),
        value: selectedSort
      }}
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