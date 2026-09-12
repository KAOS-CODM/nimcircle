import { en } from './languages/en'
import { es } from './languages/es'
import { de } from './languages/de'
import { fr } from './languages/fr'
import { pt } from './languages/pt'

export const supportedLanguages = [
  'en',
  'es',
  'de',
  'fr',
  'pt',
] as const

export type Language =
  (typeof supportedLanguages)[number]

export const languageNames: Record<
  Language,
  string
> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  pt: 'Português',
}

export const translations = {
  en,
  es,
  de,
  fr,
  pt,
}