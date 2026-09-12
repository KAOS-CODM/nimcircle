import {
  useEffect,
  useState,
} from 'react'

import type { User } from '../../types/user'
import type { Circle } from '../../types/circle'

import {
  apiGetCreatedCircles,
  apiGetJoinedCircles,
  apiGetUserContributions,
  apiGetUsername,
  lunaToNim,
} from '../../lib/api'

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

export default function ProfileView({
  user,
}: ProfileViewProps) {
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
          (total, contribution) =>
            total +
            contribution.amount,
          0,
        )

  async function handleCopyAddress() {
    const textArea =
      document.createElement('textarea')

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
    <section className="py-6">
      {/* Header */}
      <div className="mb-7">
        <p className="text-sm font-semibold text-[#607060]">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Your profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#607060]">
          Your identity and activity on NimCircle.
        </p>
      </div>

      {/* Profile identity */}
      <div className="rounded-4xl bg-[#162018] p-6 text-white shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#c7f36b] text-3xl font-bold text-[#162018]">
            {getInitial(
              user.displayName,
            )}
          </div>

          <p className="mt-5 text-sm font-semibold text-[#c7f36b]">
            {username
              ? `@${username}`
              : '@username'}
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {user.displayName}
          </h2>

          <p className="mt-3 max-w-full break-all font-mono text-[11px] leading-5 text-white/50">
            {shortenAddress(
              user.walletAddress,
            )}
          </p>
        </div>
      </div>

      {/* Activity stats */}
      <div className="mt-5 overflow-hidden rounded-4xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="grid grid-cols-2">
          <Stat
            value={
              loadingActivity
                ? '...'
                : String(
                    createdCircles.length,
                  )
            }
            label="Created"
          />

          <Stat
            value={
              loadingActivity
                ? '...'
                : String(
                    joinedCircles.length,
                  )
            }
            label="Joined"
            borderLeft
          />
        </div>

        <div className="grid grid-cols-2 border-t border-black/5">
          <Stat
            value={
              loadingActivity
                ? '...'
                : formatNim(
                    totalContributed,
                  )
            }
            label="NIM given"
          />

          <Stat
            value={
              loadingActivity
                ? '...'
                : String(
                    joinedCircles.length,
                  )
            }
            label="Supported"
            borderLeft
          />
        </div>
      </div>

      {/* Recent contributions */}
      <div className="mt-6">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-[#162018]">
            Recent contributions
          </h2>

          <p className="mt-1 text-sm text-[#607060]">
            Your latest confirmed contributions.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          {loadingActivity ? (
            <ContributionLoading />
          ) : activityError ? (
            <div className="p-5">
              <p className="text-sm font-medium text-[#162018]">
                Unable to load activity.
              </p>

              <p className="mt-1 text-xs leading-5 text-[#607060]">
                {activityError}
              </p>
            </div>
          ) : recentContributions.length ===
            0 ? (
            <EmptyContributions />
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
      <div className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-[#162018]">
          Your wallet
        </h2>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <p className="break-all font-mono text-xs leading-5 text-[#607060]">
            {user.walletAddress}
          </p>

          <button
            type="button"
            onClick={
              handleCopyAddress
            }
            className="mt-4 min-h-10 rounded-xl bg-[#162018] px-4 py-2 text-xs font-bold text-white transition-transform active:scale-[0.98]"
          >
            {addressCopied
              ? 'Address copied!'
              : 'Copy address'}
          </button>
        </div>
      </div>

      {/* Member since */}
      <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#607060]">
          Member since
        </p>

        <p className="mt-2 text-sm font-semibold text-[#162018]">
          {createdDateLabel}
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

function Stat({
  value,
  label,
  borderLeft = false,
}: {
  value: string
  label: string
  borderLeft?: boolean
}) {
  return (
    <div
      className={`px-4 py-5 text-center ${
        borderLeft
          ? 'border-l border-black/5'
          : ''
      }`}
    >
      <p className="text-2xl font-bold tracking-tight text-[#162018]">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#607060]">
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
          ? 'border-b border-black/5'
          : ''
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#162018]">
          {contribution.circleName}
        </p>

        <p className="mt-1 text-xs text-[#607060]">
          {formatContributionDate(
            contribution.createdAt,
          )}
        </p>
      </div>

      <p className="shrink-0 text-sm font-bold text-[#162018]">
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
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-[#f0f2ed]" />
                <div className="h-3 w-20 animate-pulse rounded bg-[#f0f2ed]" />
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-[#f0f2ed]" />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function EmptyContributions() {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff5a8] text-lg font-bold text-[#162018]">
        N
      </div>

      <p className="mt-3 text-sm font-semibold text-[#162018]">
        No contributions yet
      </p>

      <p className="mt-1 text-xs leading-5 text-[#607060]">
        Your confirmed contributions will appear here.
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