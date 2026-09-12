import {
  useState,
} from 'react'

import {
  languageNames,
  supportedLanguages,
} from '../../i18n/translations'

import type {
  Language,
} from '../../i18n/translations'

import {
  useLanguage,
} from '../../i18n/useLanguage'

export default function LanguageSelector() {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage()

  const [
    open,
    setOpen,
  ] = useState(false)

  function handleSelect(
    nextLanguage: Language,
  ) {
    setLanguage(
      nextLanguage,
    )

    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        className="flex w-full items-center justify-between gap-4 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div>
          <p className="text-sm font-semibold text-[#162018]">
            {t.profile.language}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#607060]">
            {
              languageNames[
                language
              ]
            }
          </p>
        </div>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f3ed] text-[#162018] transition-transform ${
            open
              ? 'rotate-180'
              : ''
          }`}
        >
          ↓
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-3xl bg-white p-2 shadow-lg ring-1 ring-black/5"
          role="listbox"
          aria-label={
            t.profile.language
          }
        >
          {supportedLanguages.map(
            (
              option,
            ) => {
              const selected =
                option ===
                language

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      option,
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                    selected
                      ? 'bg-[#dff5a8] text-[#162018]'
                      : 'text-[#162018] hover:bg-[#f7f8f5]'
                  }`}
                  role="option"
                  aria-selected={
                    selected
                  }
                >
                  <span className="text-sm font-semibold">
                    {
                      languageNames[
                        option
                      ]
                    }
                  </span>

                  {selected && (
                    <span className="text-sm font-bold">
                      ✓
                    </span>
                  )}
                </button>
              )
            },
          )}
        </div>
      )}
    </div>
  )
}