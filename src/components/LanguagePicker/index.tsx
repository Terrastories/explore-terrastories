import React from "react"
import { useTranslation } from "react-i18next"

import Select from "components/Select"
import type {SingleValue} from "react-select"

interface LanguageOption {
  value: string | undefined
  label: string
}

export default function LanguagePicker() {
  const { t, i18n } = useTranslation()

  const options = () => {
    const obj: LanguageOption[] = []
    for(const [k, v] of Object.entries(t("languages", {returnObjects: true}))) {
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
        useTinySelect={true}
        value={{
          label: t(`languages.${i18n.resolvedLanguage}`),
          value: i18n.resolvedLanguage
        }}
        placeholder={"language"}
        options={options()}
        menuPlacement='auto'
        isSearchable={false}
        onChange={(opt: SingleValue<LanguageOption>) => {
          if (opt) i18n.changeLanguage(opt.value)
        }}
      />
    </React.Suspense>
  )
}
