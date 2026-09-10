import { useState } from 'react'

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
  return (
    <div className="min-h-screen bg-[#f7f8f5] px-5 py-10 text-[#162018]">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center justify-center">
        <div className="w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c7f36b] text-2xl font-bold text-[#162018]">
            N
          </div>

          <div className="mt-7 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#607060]">
              NimCircle
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Create your profile
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
              Choose a username and name that your circle members can recognize.
            </p>
          </div>

          <ProfileForm
            walletAddress={
              walletAddress
            }
            onComplete={
              onComplete
            }
          />
        </div>
      </div>
    </div>
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
  const [username, setUsername] =
    useState('')

  const [displayName, setDisplayName] =
    useState('')

  const [error, setError] =
    useState('')

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
        'Please choose a username.',
      )
      return
    }

    if (
      trimmedUsername.length < 3
    ) {
      setError(
        'Your username must be at least 3 characters.',
      )
      return
    }

    if (
      trimmedUsername.length > 20
    ) {
      setError(
        'Your username must be 20 characters or fewer.',
      )
      return
    }

    if (
      !/^[a-z0-9_]+$/.test(
        trimmedUsername,
      )
    ) {
      setError(
        'Username can only contain letters, numbers, and underscores.',
      )
      return
    }

    if (!trimmedDisplayName) {
      setError(
        'Please enter a display name.',
      )
      return
    }

    if (
      trimmedDisplayName.length < 2
    ) {
      setError(
        'Your display name must be at least 2 characters.',
      )
      return
    }

    if (
      trimmedDisplayName.length > 30
    ) {
      setError(
        'Your display name must be 30 characters or fewer.',
      )
      return
    }

    setError('')

    onComplete({
      username:
        trimmedUsername,

      displayName:
        trimmedDisplayName,
    })
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mt-8 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-black/5"
    >
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-[#162018]"
        >
          Username
        </label>

        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
            @
          </span>

          <input
            id="username"
            type="text"
            value={
              username
            }
            onChange={(
              event,
            ) => {
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
            placeholder="kaos"
            maxLength={20}
            autoComplete="username"
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-[#f7f8f5] px-4 pl-9 text-[#162018] outline-none transition focus:border-[#162018] focus:ring-2 focus:ring-[#c7f36b]/50"
          />
        </div>

        <p className="mt-2 text-xs text-black/40">
          3-20 characters using letters, numbers, or underscores.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="displayName"
          className="block text-sm font-semibold text-[#162018]"
        >
          Display name
        </label>

        <input
          id="displayName"
          type="text"
          value={
            displayName
          }
          onChange={(
            event,
          ) => {
            setDisplayName(
              event.target.value,
            )

            setError('')
          }}
          placeholder="e.g. Kaos"
          maxLength={30}
          autoComplete="name"
          className="mt-2 min-h-12 w-full rounded-2xl border border-black/10 bg-[#f7f8f5] px-4 text-[#162018] outline-none transition focus:border-[#162018] focus:ring-2 focus:ring-[#c7f36b]/50"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607060]">
          Connected wallet
        </p>

        <p className="mt-2 break-all font-mono text-xs leading-5 text-[#162018]/60">
          {walletAddress}
        </p>
      </div>

      <button
        type="submit"
        className="mt-6 min-h-12 w-full rounded-2xl bg-[#162018] px-5 font-bold text-white transition-transform active:scale-[0.98]"
      >
        Create profile
      </button>
    </form>
  )
}