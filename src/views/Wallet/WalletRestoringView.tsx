
import nimCircleLogo from '../../assets/nimcircle-logo.png'

export default function WalletRestoringView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-5 text-[#162018]">
      <div className="w-full max-w-sm text-center">
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

        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Starting NimCircle
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#607060]">
          Connecting to Nimiq Pay...
        </p>

        <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-black/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#162018]" />
        </div>
      </div>
    </main>
  )
}