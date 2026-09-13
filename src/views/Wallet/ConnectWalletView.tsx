import DiagnosticRow from '../../components/DiagnosticRow'
import nimCircleLogo from '../../assets/nimcircle-logo.svg'
import { useLanguage } from '../../i18n/useLanguage'
import NetworkNotice from '../../components/NetworkNotice'

interface ConnectWalletViewProps {
  onConnect: () => void
  loading: boolean
  error: string | null
  providerReady: boolean
  network: 'testnet' | 'mainnet' | null
}

export default function ConnectWalletView({
  onConnect,
  loading,
  error,
  providerReady,
  network,
}: ConnectWalletViewProps) {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">
        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-lime-300/10 blur-2xl" />

              <span className="absolute left-2 top-5 h-1.5 w-1.5 rounded-full bg-lime-300/80" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-lime-300/50" />
              <span className="absolute bottom-5 left-4 h-1 w-1 rounded-full bg-white/30" />
              <span className="absolute bottom-2 right-5 h-1.5 w-1.5 rounded-full bg-lime-300/80" />

              <img
                src={nimCircleLogo}
                alt="NimCircle"
                className="relative z-10 h-20 w-20 object-contain"
              />
            </div>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-lime-300">
              {t.connectWallet.eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t.connectWallet.title}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              {t.connectWallet.description}
            </p>
          </div>
        </section>

        {/* Network notice */}
        <div className="mt-5">
          <NetworkNotice network={network} />
        </div>
        
        {/* Wallet connection card }
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">*/}

        {/* Wallet connection card */}
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-100 text-slate-900">
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
                    d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h11.25A2.25 2.25 0 0 1 19.5 7.5v9A2.25 2.25 0 0 1 17.25 18.75H6A2.25 2.25 0 0 1 3.75 16.5v-9Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 12h4.5"
                  />
                  <circle cx="15.75" cy="12" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-900">
                  {t.connectWallet.walletCardTitle}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {t.connectWallet.walletCardDescription}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={loading || !providerReady}
              onClick={onConnect}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-25"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {loading
                ? t.connectWallet.connecting
                : t.connectWallet.connect}
            </button>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16h.01"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-red-800">
                      {t.connectWallet.connectionFailed}
                    </p>

                    <p className="mt-1 wrap-break-word text-xs leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Diagnostics */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                {t.connectWallet.diagnostics}
              </p>

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  providerReady
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            </div>
          </div>

          <div className="px-5">
            <DiagnosticRow
              label={t.connectWallet.nimiqProvider}
              value={
                providerReady
                  ? t.connectWallet.ready
                  : t.connectWallet.notInitialized
              }
              success={providerReady}
            />

            <DiagnosticRow
              label={t.connectWallet.wallet}
              value={t.connectWallet.notConnected}
            />
          </div>
        </section>

        {/* Security note */}
        <div className="mt-5 flex items-center justify-center gap-2 px-4 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 shrink-0 text-emerald-600"
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
              d="m9.5 12 1.7 1.7 3.4-3.4"
            />
          </svg>

          <p className="text-xs leading-5 text-slate-500">
            {t.connectWallet.securityNote}
          </p>
        </div>
      </div>
    </main>
  )
}