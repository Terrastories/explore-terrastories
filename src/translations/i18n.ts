import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'

// Used for backend typing
import en from './locales/en/translation.json'

i18n
  // custom webpack bundling backend
  // (removes requirement that locales must be in /public)
  .use({
    type: 'backend',
    read<Namespace extends keyof typeof en>(
      language: string,
      namespace: Namespace,
      callback: (
        errorValue: unknown,
        translations: null | typeof en[Namespace]
      ) => void
    ) {
      import(`./locales/${language}/${namespace}.json`)
        .then((resources) => {
          callback(null, resources);
        })
        .catch((error) => {
          callback(error, null);
        });
    }
  })
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: {
      mat: ['nl', 'en'],
      default: ['en']
    },
    load: 'languageOnly',
    lowerCaseLng: true,
    cleanCode: true,
    returnNull: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

  export default i18n;