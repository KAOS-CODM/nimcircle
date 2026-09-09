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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c7f36b] text-sm font-bold text-[#162018]">
            N
          </span>

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