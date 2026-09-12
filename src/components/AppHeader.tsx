import nimCircleLogo from '../assets/nimcircle-logo.png'

interface AppHeaderProps {
  address: string
  onHome: () => void
}

function shortenAddress(address: string) {
  if (address.length <= 16) {
    return address
  }

  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

export default function AppHeader({
  address,
  onHome,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f7f8f5]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-5">
        <button
          type="button"
          onClick={onHome}
          className="flex min-h-11 items-center gap-3"
        >
          {/* NimCircle logo */}
          <div className="relative flex h-11 w-11 items-center justify-center">
            {/* Subtle glow */}
            <div className="absolute h-8 w-8 rounded-full bg-[#c7f36b]/20 blur-lg" />

            {/* Small orbiting dots */}
            <span className="absolute left-1 top-2 h-1 w-1 rounded-full bg-[#c7f36b]" />
            <span className="absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c7f36b]/70" />
            <span className="absolute bottom-1.5 right-2 h-1 w-1 rounded-full bg-[#162018]/25" />

            <img
              src={nimCircleLogo}
              alt="NimCircle"
              className="relative z-10 h-8 w-8 object-contain"
            />
          </div>

          <span className="text-base font-bold tracking-tight text-[#162018]">
            NimCircle
          </span>
        </button>

        <div className="rounded-full border border-black/10 bg-white px-3 py-2">
          <p className="text-xs font-semibold text-[#607060]">
            {shortenAddress(address)}
          </p>
        </div>
      </div>
    </header>
  )
}