import React from "react"
import ReactSelect from "react-select"
import type { GroupBase, Props, StylesConfig } from "react-select"

type ExtendedProps = {
  useTinySelect?: boolean,
  forwardRef?: React.Ref<any>
}

export default function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: ExtendedProps & Props<Option, IsMulti, Group>) {
  const { useTinySelect } = props

  const miniStyles:StylesConfig<Option, IsMulti, Group> = {
    control: (base) => ({
      ...base,
      minHeight: "24px",
      height: "24px",
      background: "inherit",
      border: "none",
      borderRadius: "4px",
    }),
    container: (base) => ({
      ...base,
      display: "inline-block",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      maxHeight: "24px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0", // unset padding
      paddingLeft: "4px", // set just left
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
    }),
    menuList: (base) => ({
      ...base,
      padding: "0",
    }),
    option: (base) => ({
      ...base,
      padding: "4px 8px",
    })
  }

  return(
    <ReactSelect
      {...props}
      styles={{
        ...(useTinySelect && miniStyles)
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#D5E5E9",
          primary50: "#AECDD5",
          primary75: "#619FAD",
          primary: "#09697e",
          // primary25: '#DDF1EC',
          // primary50: '#BDE4D9',
          // primary75: '##97D4C4',
          // primary: '#33AA8B',
        },
      })}
    />
  )
}