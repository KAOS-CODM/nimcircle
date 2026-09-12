import {
  useEffect,
  useState,
} from 'react'

import type {
  User,
} from '../../types/user'

import type {
  Circle,
} from '../../types/circle'

import {
  apiGetCreatedCircles,
  apiGetJoinedCircles,
  apiGetUserContributions,
  apiGetUsername,
  lunaToNim,
} from '../../lib/api'

import LanguageSelector from '../../components/Profile/LanguageSelector'

import {
  useLanguage,
} from '../../i18n/useLanguage'

interface ProfileViewProps {
  user: User
}

interface RecentContribution {
  id: string
  circleId: string
  circleName: string
  amount: number
  createdAt: string
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M5 20C5 16.69 8.13 14 12 14C15.87 14 19 16.69 19 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7.5C4 6.67 4.67 6 5.5 6H19C19.55 6 20 6.45 20 7V18C20 18.55 19.55 19 19 19H5C4.45 19 4 18.55 4 18V7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M4 9H17.5C18.88 9 20 10.12 20 11.5V14H16.5C15.67 14 15 13.33 15 12.5C15 11.67 15.67 11 16.5 11H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.8 12H20.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 3.5C14.1 5.8 15.2 8.7 15.2 12C15.2 15.3 14.1 18.2 12 20.5C9.9 18.2 8.8 15.3 8.8 12C8.8 8.7 9.9 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 8V5.5C16 4.67 15.33 4 14.5 4H5.5C4.67 4 4 4.67 4 5.5V14.5C4 15.33 4.67 16 5.5 16H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5L9.5 17L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ContributionIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16.5 7.5C16.5 6.12 14.49 5 12 5C9.51 5 7.5 6.12 7.5 7.5C7.5 8.88 9.51 10 12 10C14.49 10 16.5 11.12 16.5 12.5C16.5 13.88 14.49 15 12 15C9.51 15 7.5 13.88 7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16.5 16.5C16.5 17.88 14.49 19 12 19C9.51 19 7.5 17.88 7.5 16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 4V8.5M12 15.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ProfileView({
  user,
}: ProfileViewProps) {
  const {
    t,
  } = useLanguage()

  const [
    addressCopied,
    setAddressCopied,
  ] = useState(false)

  const [
    username,
    setUsername,
  ] = useState<string | null>(null)

  const [
    createdCircles,
    setCreatedCircles,
  ] = useState<Circle[]>([])

  const [
    joinedCircles,
    setJoinedCircles,
  ] = useState<Circle[]>([])

  const [
    recentContributions,
    setRecentContributions,
  ] = useState<RecentContribution[]>([])

  const [
    loadingActivity,
    setLoadingActivity,
  ] = useState(true)

  const [
    activityError,
    setActivityError,
  ] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProfileActivity() {
      setLoadingActivity(true)
      setActivityError(null)

      try {
        const [
          loadedUsername,
          loadedCreatedCircles,
          loadedJoinedCircles,
          loadedContributions,
        ] = await Promise.all([
          apiGetUsername(
            user.walletAddress,
          ),
          apiGetCreatedCircles(
            user.walletAddress,
          ),
          apiGetJoinedCircles(
            user.walletAddress,
          ),
          apiGetUserContributions(
            user.walletAddress,
          ),
        ])

        if (cancelled) {
          return
        }

        setUsername(
          loadedUsername,
        )

        setCreatedCircles(
          loadedCreatedCircles,
        )

        setJoinedCircles(
          loadedJoinedCircles,
        )

        const circleMap = new Map<
          string,
          string
        >()

        for (const circle of [
          ...loadedCreatedCircles,
          ...loadedJoinedCircles,
        ]) {
          circleMap.set(
            circle.id,
            circle.name,
          )
        }

        const confirmedContributions =
          loadedContributions
            .filter(
              (contribution) =>
                contribution.status ===
                'confirmed',
            )
            .sort(
              (a, b) =>
                new Date(
                  b.confirmedAt ||
                    b.createdAt,
                ).getTime() -
                new Date(
                  a.confirmedAt ||
                    a.createdAt,
                ).getTime(),
            )

        setRecentContributions(
          confirmedContributions
            .slice(0, 5)
            .map(
              (contribution) => ({
                id: contribution._id,
                circleId:
                  contribution.circleId,
                circleName:
                  circleMap.get(
                    contribution.circleId,
                  ) ||
                  'NimCircle',
                amount:
                  lunaToNim(
                    contribution.amount,
                  ),
                createdAt:
                  contribution.confirmedAt ||
                  contribution.createdAt,
              }),
            ),
        )
      } catch (requestError) {
        if (cancelled) {
          return
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : String(requestError)

        setActivityError(message)
      } finally {
        if (!cancelled) {
          setLoadingActivity(false)
        }
      }
    }

    void loadProfileActivity()

    return () => {
      cancelled = true
    }
  }, [user.walletAddress])

  const createdDate =
    new Date(user.createdAt)

  const createdDateLabel =
    Number.isNaN(
      createdDate.getTime(),
    )
      ? user.createdAt
      : createdDate.toLocaleDateString(
          undefined,
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
        )

  const totalContributed =
    recentContributions.length === 0
      ? 0
      : recentContributions.reduce(
          (
            total,
            contribution,
          ) =>
            total +
            contribution.amount,
          0,
        )

  async function handleCopyAddress() {
    const textArea =
      document.createElement(
        'textarea',
      )

    textArea.value =
      user.walletAddress

    textArea.style.position =
      'fixed'

    textArea.style.left =
      '-9999px'

    textArea.style.top =
      '0'

    document.body.appendChild(
      textArea,
    )

    try {
      textArea.focus()
      textArea.select()

      const copied =
        document.execCommand(
          'copy',
        )

      if (!copied) {
        throw new Error(
          'Copy command failed',
        )
      }

      setAddressCopied(true)

      window.setTimeout(() => {
        setAddressCopied(false)
      }, 2000)
    } catch (error) {
      console.error(
        'Failed to copy wallet address:',
        error,
      )

      window.alert(
        'Unable to copy wallet address.',
      )
    } finally {
      document.body.removeChild(
        textArea,
      )
    }
  }

  return (
    <section className="pb-8">
      {/* Hero */}
      <div className="bg-slate-950 px-4 pb-8 pt-6 text-white">
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            {t.profile.account}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {t.profile.yourProfile}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            {t.profile.profileDescription}
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-md px-4">
        {/* Profile identity */}
        <div className="relative -mt-3 rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-2xl font-bold text-slate-950">
              {getInitial(
                user.displayName,
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-300">
                {username
                  ? `@${username}`
                  : '@username'}
              </p>

              <h2 className="mt-1 truncate text-xl font-bold">
                {user.displayName}
              </h2>

              <p className="mt-1 font-mono text-[11px] text-slate-400">
                {shortenAddress(
                  user.walletAddress,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Language */}
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <GlobeIcon />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t.profile.language}
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {
                  t.profile
                    .languageDescription
                }
              </p>
            </div>
          </div>

          {/* The selector stays inside normal document flow */}
          <div className="relative z-10">
            <LanguageSelector />
          </div>
        </section>

        {/* Activity stats */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2">
            <Stat
              value={
                loadingActivity
                  ? '...'
                  : String(
                      createdCircles.length,
                    )
              }
              label={
                t.profile.created
              }
              icon={
                <CircleIcon />
              }
            />

            <Stat
              value={
                loadingActivity
                  ? '...'
                  : String(
                      joinedCircles.length,
                    )
              }
              label={
                t.profile.joined
              }
              icon={
                <UserIcon />
              }
              borderLeft
            />
          </div>

          <div className="grid grid-cols-2 border-t border-slate-100">
            <Stat
              value={
                loadingActivity
                  ? '...'
                  : formatNim(
                      totalContributed,
                    )
              }
              label={
                t.profile.nimGiven
              }
              icon={
                <ContributionIcon />
              }
            />

            <Stat
              value={
                loadingActivity
                  ? '...'
                  : String(
                      joinedCircles.length,
                    )
              }
              label={
                t.profile.supported
              }
              icon={
                <PeopleIcon />
              }
              borderLeft
            />
          </div>
        </div>

        {/* Recent contributions */}
        <div className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
              {t.profile.nimGiven}
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {
                t.profile
                  .recentContributions
              }
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {
                t.profile
                  .recentContributionsDescription
              }
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {loadingActivity ? (
              <ContributionLoading />
            ) : activityError ? (
              <div className="p-5">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    {
                      t.profile
                        .unableToLoadActivity
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600/80">
                    {activityError}
                  </p>
                </div>
              </div>
            ) : recentContributions.length ===
              0 ? (
              <EmptyContributions
                title={
                  t.profile
                    .noContributions
                }
                description={
                  t.profile
                    .noContributionsDescription
                }
              />
            ) : (
              recentContributions.map(
                (
                  contribution,
                  index,
                ) => (
                  <ContributionRow
                    key={
                      contribution.id
                    }
                    contribution={
                      contribution
                    }
                    showBorder={
                      index <
                      recentContributions.length -
                        1
                    }
                  />
                ),
              )
            )}
          </div>
        </div>

        {/* Wallet */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <WalletIcon />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {
                  t.profile
                    .yourWallet
                }
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {t.profile.copyAddress}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-600">
              {user.walletAddress}
            </p>

            <button
              type="button"
              onClick={
                handleCopyAddress
              }
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              {addressCopied ? (
                <CheckIcon />
              ) : (
                <CopyIcon />
              )}

              {addressCopied
                ? t.profile
                    .addressCopied
                : t.profile
                    .copyAddress}
            </button>
          </div>
        </section>

        {/* Member since */}
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            {t.profile.memberSince}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {createdDateLabel}
          </p>
        </section>
      </main>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

function Stat({
  value,
  label,
  icon,
  borderLeft = false,
}: {
  value: string
  label: string
  icon: React.ReactNode
  borderLeft?: boolean
}) {
  return (
    <div
      className={`px-4 py-5 ${
        borderLeft
          ? 'border-l border-slate-100'
          : ''
      }`}
    >
      <div className="flex items-center justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-center text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-center text-xs font-semibold text-slate-500">
        {label}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Contribution row                                                           */
/* -------------------------------------------------------------------------- */

function ContributionRow({
  contribution,
  showBorder,
}: {
  contribution: RecentContribution
  showBorder: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-5 ${
        showBorder
          ? 'border-b border-slate-100'
          : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <ContributionIcon />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {contribution.circleName}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {formatContributionDate(
              contribution.createdAt,
            )}
          </p>
        </div>
      </div>

      <p className="shrink-0 text-sm font-bold text-slate-900">
        {formatNim(
          contribution.amount,
        )}{' '}
        NIM
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Empty / loading states                                                     */
/* -------------------------------------------------------------------------- */

function ContributionLoading() {
  return (
    <div className="p-5">
      <div className="space-y-4">
        {[1, 2, 3].map(
          (item) => (
            <div
              key={item}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />

                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function EmptyContributions({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="p-7 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <ContributionIcon />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function getInitial(
  name: string,
) {
  return (
    name
      .trim()
      .charAt(0)
      .toUpperCase() || 'N'
  )
}

function shortenAddress(
  address: string,
) {
  if (address.length <= 16) {
    return address
  }

  return `${address.slice(
    0,
    8,
  )}...${address.slice(-8)}`
}

function formatNim(
  amount: number,
) {
  return new Intl.NumberFormat(
    undefined,
    {
      maximumFractionDigits: 2,
    },
  ).format(amount)
}

function formatContributionDate(
  date: string,
) {
  const parsedDate =
    new Date(date)

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return ''
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

function PeopleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15 5.5C16.93 5.5 18.5 7.07 18.5 9C18.5 10.93 16.93 12.5 15 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16 14C18.6 14.48 20.5 16.5 20.5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}