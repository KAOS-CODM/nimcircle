import type { User } from '../types/user'

interface WelcomeBackModalProps {
  user: User
  onContinue: () => void
}

export default function WelcomeBackModal({
  user,
  onContinue,
}: WelcomeBackModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#162018]/40 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-4xl bg-white p-7 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c7f36b] text-xl font-bold text-[#162018]">
          N
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#607060]">
            NimCircle
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#162018]">
            Welcome back, {user.displayName}
          </h2>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Your wallet and profile are ready. Let's get back to
            your circles.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-7 min-h-12 w-full rounded-2xl bg-[#162018] px-5 font-bold text-white transition-transform active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}