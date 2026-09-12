import type { EnglishTranslations } from './languages/en'

export type TranslationSchema<T> = {
  [K in keyof T]: T[K] extends object
    ? TranslationSchema<T[K]>
    : string
}

export type LanguageTranslations =
  TranslationSchema<EnglishTranslations>