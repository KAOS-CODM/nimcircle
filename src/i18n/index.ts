import {
  supportedLanguages,
  translations,
} from './translations'

import type {
  Language,
} from './translations'

const LANGUAGE_STORAGE_KEY =
  'nimcircle:language'

function isSupportedLanguage(
  value: string | null | undefined,
): value is Language {
  return (
    value !== null &&
    value !== undefined &&
    (
      supportedLanguages as readonly string[]
    ).includes(value)
  )
}

function getBrowserLanguage(): Language {
  const browserLanguage =
    navigator.language
      ?.split('-')[0]
      .toLowerCase()

  if (
    isSupportedLanguage(
      browserLanguage,
    )
  ) {
    return browserLanguage
  }

  return 'en'
}

export function getInitialLanguage(): Language {
  const savedLanguage =
    localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    )

  if (
    isSupportedLanguage(
      savedLanguage,
    )
  ) {
    return savedLanguage
  }

  const nimiqPayLanguage =
    window.nimiqPay?.language
      ?.toLowerCase()

  if (
    isSupportedLanguage(
      nimiqPayLanguage,
    )
  ) {
    return nimiqPayLanguage
  }

  return getBrowserLanguage()
}

export function saveLanguage(
  language: Language,
) {
  localStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    language,
  )
}

export function getTranslations(
  language: Language,
) {
  return translations[language]
}

export {
  supportedLanguages,
  translations,
}

export type {
  Language,
}