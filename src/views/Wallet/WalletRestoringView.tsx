export default function WalletRestoringView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-5 text-[#162018]">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#c7f36b] text-2xl font-bold">
          N
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