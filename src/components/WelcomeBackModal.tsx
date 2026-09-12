import nimCircleLogo from '../assets/nimcircle-logo.svg'
import type { User } from '../types/user'
import { useLanguage } from '../i18n/useLanguage'

interface WelcomeBackModalProps {
  user: User
  onContinue: () => void
}

export default function WelcomeBackModal({
  user,
  onContinue,
}: WelcomeBackModalProps) {
  const { t } = useLanguage()

  const title = t.welcomeBack.title.replace(
    '{name}',
    user.displayName,
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-6 pb-7 pt-8 text-white">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full bg-lime-300/10 blur-2xl" />

              <span className="absolute left-1 top-4 h-1 w-1 rounded-full bg-lime-300/80" />
              <span className="absolute right-1 top-2 h-1.5 w-1.5 rounded-full bg-lime-300/50" />
              <span className="absolute bottom-3 left-2 h-1 w-1 rounded-full bg-white/30" />
              <span className="absolute bottom-1 right-3 h-1.5 w-1.5 rounded-full bg-lime-300/80" />

              <img
                src={nimCircleLogo}
                alt="NimCircle"
                className="relative z-10 h-14 w-14 object-contain"
              />
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">
              {t.welcomeBack.eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              {title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
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
              </div>

              <p className="text-sm leading-6 text-slate-600">
                {t.welcomeBack.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            {t.welcomeBack.continue}
          </button>
        </div>
      </div>
    </div>
  )
}