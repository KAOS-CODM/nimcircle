import nimCircleLogo from '../../assets/nimcircle-logo.svg'
import { useLanguage } from '../../i18n/useLanguage'

export default function WalletRestoringView() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-sm">
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

            {/* App name */}
            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-lime-300">
              {t.walletRestoring.eyebrow}
            </p>

            {/* Heading */}
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              {t.walletRestoring.title}
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              {t.walletRestoring.description}
            </p>

            {/* Loading indicator */}
            <div
              className="mt-8 flex items-center gap-3"
              aria-label={t.walletRestoring.initializing}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-5 w-5 animate-ping rounded-full bg-lime-300/20" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-lime-300" />
              </span>

              <span className="text-xs font-bold text-slate-400">
                {t.walletRestoring.initializing}
              </span>
            </div>

            {/* Progress line */}
            <div className="mt-7 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-lime-300" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}