import { useState } from 'react'
import nimCircleLogo from '../assets/nimcircle-logo.png'
import { useLanguage } from '../i18n/useLanguage'

interface ProfileSetupProps {
  walletAddress: string
  onComplete: (data: {
    username: string
    displayName: string
  }) => void
}

export default function ProfileSetup({
  walletAddress,
  onComplete,
}: ProfileSetupProps) {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center justify-center">
        <div className="w-full">
          <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full bg-lime-300/10 blur-2xl" />

                <span className="absolute left-1 top-4 h-1.5 w-1.5 rounded-full bg-lime-300/80" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-lime-300/50" />
                <span className="absolute bottom-4 left-2 h-1 w-1 rounded-full bg-white/30" />
                <span className="absolute bottom-1 right-3 h-1.5 w-1.5 rounded-full bg-lime-300/80" />

                <img
                  src={nimCircleLogo}
                  alt="NimCircle"
                  className="relative z-10 h-16 w-16 object-contain"
                />
              </div>

              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-lime-300">
                {t.profileSetup.eyebrow}
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {t.profileSetup.title}
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                {t.profileSetup.description}
              </p>
            </div>
          </section>

          <ProfileForm
            walletAddress={walletAddress}
            onComplete={onComplete}
          />
        </div>
      </div>
    </main>
  )
}

function ProfileForm({
  walletAddress,
  onComplete,
}: {
  walletAddress: string
  onComplete: (data: {
    username: string
    displayName: string
  }) => void
}) {
  const { t } = useLanguage()

  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedUsername =
      username.trim().toLowerCase()

    const trimmedDisplayName =
      displayName.trim()

    if (!trimmedUsername) {
      setError(
        t.profileSetup.pleaseChooseUsername,
      )
      return
    }

    if (trimmedUsername.length < 3) {
      setError(
        t.profileSetup.usernameTooShort,
      )
      return
    }

    if (trimmedUsername.length > 20) {
      setError(
        t.profileSetup.usernameTooLong,
      )
      return
    }

    if (
      !/^[a-z0-9_]+$/.test(
        trimmedUsername,
      )
    ) {
      setError(
        t.profileSetup.usernameInvalid,
      )
      return
    }

    if (!trimmedDisplayName) {
      setError(
        t.profileSetup.pleaseEnterDisplayName,
      )
      return
    }

    if (trimmedDisplayName.length < 2) {
      setError(
        t.profileSetup.displayNameTooShort,
      )
      return
    }

    if (trimmedDisplayName.length > 30) {
      setError(
        t.profileSetup.displayNameTooLong,
      )
      return
    }

    setError('')

    onComplete({
      username: trimmedUsername,
      displayName: trimmedDisplayName,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-black text-slate-900"
        >
          {t.profileSetup.username}
        </label>

        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            @
          </span>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(
                event.target.value
                  .toLowerCase()
                  .replace(
                    /[^a-z0-9_]/g,
                    '',
                  ),
              )

              setError('')
            }}
            placeholder={
              t.profileSetup.usernamePlaceholder
            }
            maxLength={20}
            autoComplete="username"
            className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pl-9 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-lime-300/30"
          />
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          {t.profileSetup.usernameHint}
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="displayName"
          className="block text-sm font-black text-slate-900"
        >
          {t.profileSetup.displayName}
        </label>

        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(event) => {
            setDisplayName(
              event.target.value,
            )

            setError('')
          }}
          placeholder={
            t.profileSetup.displayNamePlaceholder
          }
          maxLength={30}
          autoComplete="name"
          className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-lime-300/30"
        />
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M10.3 4.2 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <p className="pt-0.5 text-sm font-medium leading-5 text-red-700">
            {error}
          </p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.8v-2.4H7a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.5 1Z"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              {t.profileSetup.connectedWallet}
            </p>

            <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-600">
              {walletAddress}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14M5 12h14"
          />
        </svg>

        {t.profileSetup.createProfile}
      </button>
    </form>
  )
}