import { useState } from 'react'
import { useLanguage } from '../i18n/useLanguage'

interface NetworkNoticeProps {
  network: 'testnet' | 'mainnet' | null
  compact?: boolean
}

export default function NetworkNotice({
  network,
  compact = false,
}: NetworkNoticeProps) {
  const { t } = useLanguage()
  const [showGuide, setShowGuide] = useState(false)

  if (!network) {
    return null
  }

  const isTestnet = network === 'testnet'

  const title = isTestnet
    ? t.networkNotice.testnetTitle
    : t.networkNotice.mainnetTitle

  const description = isTestnet
    ? t.networkNotice.testnetDescription
    : t.networkNotice.mainnetDescription

  const networkName = isTestnet
    ? t.networkNotice.testnet
    : t.networkNotice.mainnet

  const guideTitle = isTestnet
    ? t.networkNotice.howToSwitchTestnet
    : t.networkNotice.howToSwitchMainnet

  return (
    <section
      className={`rounded-3xl border ${
        isTestnet
          ? 'border-amber-200 bg-amber-50'
          : 'border-emerald-200 bg-emerald-50'
      } ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            isTestnet
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3.75 5.25 6.5v5.25c0 4.35 2.78 7.7 6.75 8.5 3.97-.8 6.75-4.15 6.75-8.5V6.5L12 3.75Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15.5h.01"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`text-sm font-black ${
                isTestnet
                  ? 'text-amber-900'
                  : 'text-emerald-900'
              }`}
            >
              {title}
            </h2>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                isTestnet
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {networkName}
            </span>
          </div>

          <p
            className={`mt-2 text-sm leading-6 ${
              isTestnet
                ? 'text-amber-800'
                : 'text-emerald-800'
            }`}
          >
            {description}
          </p>

          <button
            type="button"
            onClick={() => setShowGuide((current) => !current)}
            className={`mt-3 text-xs font-black underline underline-offset-2 ${
              isTestnet
                ? 'text-amber-800'
                : 'text-emerald-800'
            }`}
          >
            {showGuide
              ? t.networkNotice.hideGuide
              : guideTitle}
          </button>

          {showGuide && (
            <div
              className={`mt-3 rounded-2xl border p-3 ${
                isTestnet
                  ? 'border-amber-200 bg-white/60'
                  : 'border-emerald-200 bg-white/60'
              }`}
            >
              <p
                className={`text-xs leading-5 ${
                  isTestnet
                    ? 'text-amber-900'
                    : 'text-emerald-900'
                }`}
              >
                {isTestnet
                  ? t.networkNotice.testnetGuide
                  : t.networkNotice.mainnetGuide}
              </p>
            </div>
          )}

          <p className="mt-3 text-[11px] font-medium leading-5 text-slate-500">
            {t.networkNotice.ignoreIfCorrect}
          </p>
        </div>
      </div>
    </section>
  )
}