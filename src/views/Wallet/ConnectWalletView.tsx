import DiagnosticRow from '../../components/DiagnosticRow'
import nimCircleLogo from '../../assets/nimcircle-logo.png'

interface ConnectWalletViewProps {
  onConnect: () => void
  loading: boolean
  error: string | null
  providerReady: boolean
}

export default function ConnectWalletView({
  onConnect,
  loading,
  error,
  providerReady,
}: ConnectWalletViewProps) {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-5 py-8 text-[#162018]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="text-center">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            {/* Ambient glow */}
            <div className="absolute h-20 w-20 rounded-full bg-[#c7f36b]/25 blur-2xl" />
          
            {/* Floating particles */}
            <span className="absolute left-1 top-7 h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
            <span className="absolute right-2 top-4 h-2 w-2 rounded-full bg-[#c7f36b]/70" />
            <span className="absolute bottom-5 left-3 h-1 w-1 rounded-full bg-[#162018]/25" />
            <span className="absolute bottom-2 right-6 h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
          
            {/* NimCircle logo */}
            <img
              src={nimCircleLogo}
              alt="NimCircle"
              className="relative z-10 h-20 w-20 object-contain"
            />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-[#607060]">
            NimCircle
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Save together.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-[#607060]">
            Create shared NIM goals, invite people, and watch
            everyone contribute toward the same target.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-bold">
              Connect your Nimiq wallet
            </p>

            <p className="mt-1 text-sm leading-5 text-[#607060]">
              NimCircle uses your Nimiq Pay wallet to identify you
              and send NIM contributions.
            </p>
          </div>

          <button
            type="button"
            disabled={loading || !providerReady}
            onClick={onConnect}
            className="min-h-12 w-full rounded-2xl bg-[#162018] px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-800">
                Wallet connection failed
              </p>

              <p className="mt-2 wrap-break-word text-xs leading-5 text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-3xl border border-black/5 bg-white/70 px-5">
          <DiagnosticRow
            label="Nimiq provider"
            value={
              providerReady
                ? 'Ready'
                : 'Not initialized'
            }
            success={providerReady}
          />

          <DiagnosticRow
            label="Wallet"
            value="Not connected"
          />
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-[#607060]">
          Your private keys never leave Nimiq Pay.
        </p>
      </div>
    </main>
  )
}