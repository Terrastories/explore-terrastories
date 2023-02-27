import React from 'react'
import Select, {components, DropdownIndicatorProps, SingleValue, ActionMeta} from 'react-select'
import { ReactComponent as SortIcon } from './assets/sort.svg'

interface SortOption {
  label: string
  value: string
}

type calloptions = {
  [value: string]: any
}

interface SortProps {
  items?: any[],
  sortOptions: calloptions,
  defaultSort: string,
  onSort: (items: string) => void
}

export default function Sort({onSort, items, defaultSort, sortOptions}:SortProps) {
  const [options, setOptions] = React.useState<SortOption[]>()

  const DropdownIndicator = (
    props: DropdownIndicatorProps<SortOption, false>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <SortIcon />
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


  const handleSort = (option: SingleValue<SortOption>, actionMeta: ActionMeta<SortOption>) => {
    if (option) onSort(option.value)
  }

  return(
    <Select
      // unstyled
      defaultValue={sortOptions[defaultSort]}
      placeholder={''}
      isSearchable={false}
      components={{DropdownIndicator}}
      // menuIsOpen={true}
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
          // maxWidth: 'max-content',
          // padding: '1rem',
        })
      }}
      options={options}
      onChange={handleSort} />
  )
}