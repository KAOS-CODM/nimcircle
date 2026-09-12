import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  ReactNode,
} from 'react'

import {
  getInitialLanguage,
  getTranslations,
  saveLanguage,
} from './index'

import type {
  Language,
} from './index'

import {
  LanguageContext,
} from './LanguageContext'

export function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    language,
    setLanguageState,
  ] = useState<Language>(
    getInitialLanguage,
  )

  function setLanguage(
    nextLanguage: Language,
  ) {
    setLanguageState(
      nextLanguage,
    )

    saveLanguage(
      nextLanguage,
    )
  }

  useEffect(() => {
    document.documentElement.lang =
      language
  }, [language])

  const value =
    useMemo(
      () => ({
        language,
        setLanguage,
        t: getTranslations(
          language,
        ),
      }),
      [language],
    )

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  )
}