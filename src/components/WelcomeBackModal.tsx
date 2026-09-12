import nimCircleLogo from '../assets/nimcircle-logo.png'
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
        {/* NimCircle logo */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          {/* Soft ambient glow */}
          <div className="absolute h-12 w-12 rounded-full bg-[#c7f36b]/30 blur-xl" />

          {/* Small orbit particles */}
          <span className="absolute left-1 top-3 h-1 w-1 rounded-full bg-[#c7f36b]" />

          <span className="absolute right-1 top-2 h-1.5 w-1.5 rounded-full bg-[#c7f36b]/70" />

          <span className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-[#162018]/20" />

          <img
            src={nimCircleLogo}
            alt="NimCircle"
            className="relative z-10 h-12 w-12 object-contain"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#607060]">
            NimCircle
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#162018]">
            Welcome back, {user.displayName}
          </h2>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Your wallet and profile are ready. Let&apos;s get back to
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