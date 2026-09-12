import nimCircleLogo from '../assets/nimcircle-logo.svg'
import {
  useLanguage,
} from '../i18n/useLanguage'

interface AppHeaderProps {
  address: string
  onHome: () => void
}

function shortenAddress(
  address: string,
) {
  if (address.length <= 16) {
    return address
  }

  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

export default function AppHeader({
  address,
  onHome,
}: AppHeaderProps) {
  const {
    t,
  } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 text-white shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-5">
        <button
          type="button"
          onClick={onHome}
          aria-label={
            t.navigation.home
          }
          className="flex min-h-11 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className="absolute h-9 w-9 rounded-full bg-lime-300/10 blur-xl" />

            <span className="absolute left-1 top-2 h-1 w-1 rounded-full bg-lime-300/90" />

            <span className="absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full bg-lime-300/60" />

            <span className="absolute bottom-1.5 right-2 h-1 w-1 rounded-full bg-white/25" />

            <img
              src={nimCircleLogo}
              alt="NimCircle"
              className="relative z-10 h-8 w-8 object-contain"
            />
          </div>

          <span className="text-base font-black tracking-tight text-white">
            NimCircle
          </span>
        </button>

        <div className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
          <span
            className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_8px_rgba(190,242,100,0.7)]"
            aria-hidden="true"
          />

          <p className="font-mono text-[11px] font-bold tracking-tight text-slate-300">
            {shortenAddress(
              address,
            )}
          </p>
        </div>
      </div>
    </header>
  )
}