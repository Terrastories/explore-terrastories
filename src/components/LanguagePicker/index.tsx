import React from 'react'
import Select, {SingleValue} from 'react-select'
import { useTranslation } from 'react-i18next'

interface LanguageOption {
  value: string
  label: string
}

export default function LanguagePicker() {
  const { t, i18n } = useTranslation()

  const options = () => {
    let obj: LanguageOption[] = []
    for(let [k, v] of Object.entries(t('languages', {returnObjects: true}))) {
      obj.push({
        label: v,
        value: k
      })
    }
    return obj
  }

  return(
    <React.Suspense>
    <Select
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '24px',
          height: '24px',
          background: 'inherit',
          border: 'none',
        }),
        container: (base, state) => ({
          ...base,
          display: 'inline-block',
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
          width: 'max-content',
        })
      }}
      defaultValue={{
        label: t(`languages.${i18n.resolvedLanguage}`),
        value: i18n.resolvedLanguage
      }}
      placeholder={'language'}
      options={options()}
      menuPlacement='auto'
      onChange={(opt: SingleValue<LanguageOption>, a: unknown) => {
        if (opt) i18n.changeLanguage(opt.value)
      }}
    />
    </React.Suspense>
  )
}
