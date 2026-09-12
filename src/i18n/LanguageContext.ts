import {
  createContext,
} from 'react'

import type {
  Language,
} from './index'

import type {
  getTranslations,
} from './index'

export interface LanguageContextValue {
  language: Language
  setLanguage: (
    language: Language,
  ) => void
  t: ReturnType<
    typeof getTranslations
  >
}

export const LanguageContext =
  createContext<
    LanguageContextValue | undefined
  >(undefined)