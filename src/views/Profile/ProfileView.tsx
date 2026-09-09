import type { User } from '../../types/user'

interface ProfileViewProps {
  user: User
}

export default function ProfileView({
  user,
}: ProfileViewProps) {
  const createdDate = new Date(user.createdAt)

  const createdDateLabel = Number.isNaN(
    createdDate.getTime(),
  )
    ? user.createdAt
    : createdDate.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

  return (
    <section className="py-6">
      <div className="mb-7">
        <p className="text-sm font-semibold text-[#607060]">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Your profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#607060]">
          Your wallet is your identity on NimCircle.
        </p>
      </div>

      <div className="rounded-4xl bg-[#162018] p-6 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#c7f36b] text-2xl font-bold text-[#162018]">
            {getInitial(user.displayName)}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Display name
            </p>

            <h2 className="mt-1 truncate text-2xl font-bold">
              {user.displayName}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-4xl bg-white shadow-sm ring-1 ring-black/5">
        <ProfileRow
          label="Wallet address"
          value={user.walletAddress}
          mono
        />

        <ProfileRow
          label="Member since"
          value={createdDateLabel}
        />
      </div>

      <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dff5a8] font-bold text-[#162018]">
            N
          </div>

          <div>
            <h2 className="font-bold">
              Your wallet, your identity
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607060]">
              NimCircle uses your connected Nimiq wallet as your
              authoritative identity. Your display name simply
              makes it easier for people in your circles to
              recognize you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProfileRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="border-b border-black/5 p-5 last:border-b-0">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607060]">
        {label}
      </p>

      <p
        className={`mt-2 break-all text-sm leading-6 text-[#162018]/70 ${
          mono ? 'font-mono text-xs' : 'font-medium'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'N'
}