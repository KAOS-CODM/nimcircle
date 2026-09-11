import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import type { Circle } from '../../types/circle'

import ContributeModal from '../../components/ContributeModal'

import {
  apiGetCircle,
} from '../../lib/api'

interface CircleViewProps {
  circleId: string
  onBack: () => void
  currentAddress: string
  currentUserId: string
}

interface CircleStats {
  raisedAmount: number
  targetAmount: number
  remainingAmount: number
  progressPercentage: number
  contributorCount: number
  creatorCommitment: number
}

interface CircleContribution {
  _id: string
  circleId: string

  contributorWallet: string
  contributorUserId: string
  contributorUsername?: string

  recipientWallet: string

  amount: number

  transactionHash: string

  memo: string

  status:
    | 'pending'
    | 'confirmed'
    | 'failed'

  confirmedAt: string | null

  createdAt: string
  updatedAt: string
}

interface DeadlineStatus {
  label: string
  icon: string
}

const EMPTY_STATS: CircleStats = {
  raisedAmount: 0,
  targetAmount: 0,
  remainingAmount: 0,
  progressPercentage: 0,
  contributorCount: 0,
  creatorCommitment: 0,
}

function normalizeWalletAddress(
  address: string,
): string {
  return address
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
}

export default function CircleView({
  circleId,
  onBack,
  currentAddress,
  currentUserId,
}: CircleViewProps) {
  const [circle, setCircle] =
    useState<Circle | null>(null)

  const [now] =
    useState(() => Date.now())

  const [
    showContributeModal,
    setShowContributeModal,
  ] = useState(false)

  const [
    stats,
    setStats,
  ] = useState<CircleStats>(
    EMPTY_STATS,
  )

  const [
    contributions,
    setContributions,
  ] = useState<CircleContribution[]>([])

  const [
    loadingCircle,
    setLoadingCircle,
  ] = useState(true)

  const [
    refreshingCircle,
    setRefreshingCircle,
  ] = useState(false)

  const [
    circleError,
    setCircleError,
  ] = useState<string | null>(null)

  const loadCircle = useCallback(
    async (
      initialLoad = false,
    ) => {
      if (initialLoad) {
        setLoadingCircle(true)
      } else {
        setRefreshingCircle(true)
      }

      setCircleError(null)

      try {
        const response =
          await apiGetCircle(
            circleId,
          )

        setCircle(
          response.circle,
        )

        setStats(
          response.stats,
        )

        setContributions(
          response.contributions,
        )
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : String(requestError)

        setCircleError(message)
      } finally {
        if (initialLoad) {
          setLoadingCircle(false)
        } else {
          setRefreshingCircle(false)
        }
      }
    },
    [circleId],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCircle(true)
  }, [loadCircle])

  /*
   * The Circle-specific loading and error states
   * belong to this view because this view owns
   * the selected Circle.
   */
  if (loadingCircle && !circle) {
    return (
      <section className="py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 min-h-11 text-sm font-semibold text-[#607060]"
        >
          ← Back
        </button>

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#162018]">
              Loading Circle...
            </p>

            <p className="mt-2 text-xs text-[#607060]">
              Getting the shared goal details.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (circleError && !circle) {
    return (
      <section className="py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 min-h-11 text-sm font-semibold text-[#607060]"
        >
          ← Back
        </button>

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-[#162018]">
              Unable to load Circle
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#607060]">
              {circleError}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadCircle(true)
              }
              className="mt-6 rounded-2xl bg-[#162018] px-5 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    )
  }

  /*
   * This guard keeps TypeScript aware that
   * everything below has a loaded Circle.
   */
  if (!circle) {
    return null
  }

  const raisedAmount =
    stats.raisedAmount

  const targetAmount =
    stats.targetAmount > 0
      ? stats.targetAmount
      : circle.targetAmount

  const remainingAmount =
    Math.max(
      0,
      stats.remainingAmount > 0
        ? stats.remainingAmount
        : Math.max(
            0,
            targetAmount -
              raisedAmount,
          ),
    )

  const contributorCount =
    stats.contributorCount

  const creatorCommitment =
    stats.creatorCommitment > 0
      ? stats.creatorCommitment
      : circle.creatorCommitment

  const progress =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          stats.progressPercentage,
        ),
      ),
    )

  const deadline =
    new Date(circle.deadline)

  const deadlineTimestamp =
    deadline.getTime()

  const hasValidDeadline =
    !Number.isNaN(
      deadlineTimestamp,
    )

  const normalizedCurrentAddress =
    normalizeWalletAddress(
      currentAddress,
    )

  const normalizedCreatorAddress =
    normalizeWalletAddress(
      circle.creator,
    )

  const normalizedRecipientAddress =
    normalizeWalletAddress(
      circle.recipient,
    )

  const isCreator =
    normalizedCurrentAddress ===
    normalizedCreatorAddress

  const isCreatorGoalOwner =
    isCreator &&
    normalizedCurrentAddress ===
      normalizedRecipientAddress

  const canCreatorContribute =
    isCreator &&
    !isCreatorGoalOwner &&
    creatorCommitment > 0 &&
    creatorCommitment <=
      remainingAmount

  const isCompleted =
    raisedAmount >=
    targetAmount

  const isExpired =
    hasValidDeadline &&
    deadlineTimestamp < now &&
    !isCompleted

  const deadlineLabel =
    hasValidDeadline
      ? deadline.toLocaleDateString(
          undefined,
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
        )
      : circle.deadline

  const deadlineStatus =
    getDeadlineStatus(
      deadlineTimestamp,
      isCompleted,
      now,
    )

  async function handleShare() {
    const shareUrl =
      `${window.location.origin}/circle/${encodeURIComponent(
        circleId,
      )}`

    try {
      await navigator.clipboard.writeText(
        shareUrl,
      )

      window.alert(
        'Circle link copied!',
      )
    } catch {
      window.prompt(
        'Copy this Circle link:',
        shareUrl,
      )
    }
  }

  async function handleContributionSuccess() {
    setShowContributeModal(false)

    await loadCircle()
  }

  return (
    <section className="py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 min-h-11 text-sm font-semibold text-[#607060]"
      >
        ← Back
      </button>

      {circleError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            Unable to refresh this Circle.
          </p>

          <p className="mt-1 text-xs leading-5 text-red-600">
            {circleError}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadCircle()
            }
            disabled={
              refreshingCircle
            }
            className="mt-3 rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 disabled:opacity-50"
          >
            {refreshingCircle
              ? 'Retrying...'
              : 'Retry'}
          </button>
        </div>
      )}

      <GoalHeader
        circle={circle}
        raisedAmount={raisedAmount}
        targetAmount={targetAmount}
        progress={progress}
        remainingAmount={
          remainingAmount
        }
        deadlineStatus={
          deadlineStatus
        }
        isCompleted={isCompleted}
        isExpired={isExpired}
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          label="Contributors"
          value={
            loadingCircle
              ? '...'
              : contributorCount.toString()
          }
          description={
            contributorCount === 1
              ? 'person contributing'
              : 'people contributing'
          }
        />

        <StatCard
          label="Deadline"
          value={deadlineLabel}
          description={
            deadlineStatus.label
          }
        />
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#162018] shadow-sm transition-transform active:scale-[0.98]"
      >
        <span className="text-base">
          ↗
        </span>

        Share Circle
      </button>

      <div className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">
          About this Circle
        </h2>

        <div className="mt-4 divide-y divide-black/5">
          <InfoRow
            label="Creator"
            value={`@${circle.creatorUsername}`}
            secondaryValue={circle.creator}
          />
          
          <InfoRow
            label="Goal owner"
            value={`@${circle.recipientUsername}`}
            secondaryValue={circle.recipient}
          />

          <InfoRow
            label="Creator commitment"
            value={`${creatorCommitment.toLocaleString()} NIM`}
          />

          <InfoRow
            label="Created"
            value={formatDate(
              circle.createdAt,
            )}
          />
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">
              Contributors
            </h2>

            <p className="mt-1 text-xs text-[#607060]">
              People helping reach this goal
            </p>
          </div>

          <span className="rounded-full bg-[#f7f8f5] px-3 py-1 text-xs font-bold text-[#607060]">
            {loadingCircle
              ? '...'
              : contributorCount}
          </span>
        </div>

        {loadingCircle ? (
          <LoadingBlock
            message="Loading contributors..."
          />
        ) : contributions.length === 0 ? (
          <EmptyContributors />
        ) : (
          <ContributorList
            contributions={
              contributions
            }
          />
        )}
      </div>

      <div className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold">
            Contribution history
          </h2>

          <p className="mt-1 text-xs text-[#607060]">
            Confirmed NIM payments recorded for this Circle
          </p>
        </div>

        {loadingCircle ? (
          <LoadingBlock
            message="Loading contribution history..."
          />
        ) : contributions.length === 0 ? (
          <EmptyContributionHistory />
        ) : (
          <ContributionHistory
            contributions={
              contributions
            }
          />
        )}
      </div>

      {isCreator &&
        !isCompleted && (
          <div className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607060]">
                Creator controls
              </p>

              <h2 className="mt-2 text-lg font-bold">
                Manage your Circle
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#607060]">
                Your commitment is fixed at{' '}
                <strong className="text-[#162018]">
                  {creatorCommitment.toLocaleString()}{' '}
                  NIM
                </strong>
                . It cannot be changed after the Circle is created.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-5 min-h-11 w-full rounded-2xl border border-black/10 bg-[#f7f8f5] px-5 text-sm font-bold text-[#162018] opacity-60"
            >
              Extend deadline
            </button>

            <p className="mt-2 text-center text-xs text-[#607060]">
              Deadline management will be available in the next stage.
            </p>
          </div>
        )}

      <div className="mt-6">
        {isCompleted ? (
          <CompletedState />
        ) : isExpired ? (
          <ExpiredState />
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                setShowContributeModal(true)
              }
              disabled={
                loadingCircle ||
                remainingAmount <= 0 ||
                (isCreator &&
                  !canCreatorContribute)
              }
              className="min-h-13 w-full rounded-2xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#162018] shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreator
                ? canCreatorContribute
                  ? `Contribute ${creatorCommitment.toLocaleString()} NIM`
                  : 'Creator commitment unavailable'
                : remainingAmount <= 0
                  ? 'Goal fully funded'
                  : 'Contribute NIM'}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-[#607060]">
              {isCreator
                ? canCreatorContribute
                  ? 'Your fixed creator commitment will be contributed to the goal owner.'
                  : isCreatorGoalOwner
                    ? 'You are the goal owner, so no self-payment is required.'
                    : 'You have no available creator commitment for this Circle.'
                : 'Contributions will use your connected Nimiq Pay wallet and require your approval.'}
            </p>
          </>
        )}
      </div>

      {showContributeModal &&
        currentAddress && (
          <ContributeModal
            circleId={circleId}
            recipient={
              normalizedRecipientAddress
            }
            remainingAmount={
              remainingAmount
            }
            contributorWallet={
              normalizedCurrentAddress
            }
            contributorUserId={
              currentUserId
            }
            fixedAmountNim={
              isCreator
                ? creatorCommitment
                : undefined
            }
            onClose={() =>
              setShowContributeModal(
                false,
              )
            }
            onSuccess={
              handleContributionSuccess
            }
          />
        )}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Goal Header                                                                */
/* -------------------------------------------------------------------------- */

function GoalHeader({
  circle,
  raisedAmount,
  targetAmount,
  progress,
  remainingAmount,
  deadlineStatus,
  isCompleted,
  isExpired,
}: {
  circle: Circle
  raisedAmount: number
  targetAmount: number
  progress: number
  remainingAmount: number
  deadlineStatus: DeadlineStatus
  isCompleted: boolean
  isExpired: boolean
}) {
  const status =
    isCompleted
      ? 'Completed'
      : isExpired
        ? 'Expired'
        : 'Active'

  return (
    <div className="rounded-4xl bg-[#162018] p-6 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#c7f36b]">
            Shared goal
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {circle.name}
          </h1>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
            isCompleted
              ? 'bg-[#c7f36b] text-[#162018]'
              : isExpired
                ? 'bg-white/10 text-white/60'
                : 'bg-white/10 text-white'
          }`}
        >
          {status}
        </span>
      </div>

      {circle.description && (
        <p className="mt-3 text-sm leading-6 text-white/60">
          {circle.description}
        </p>
      )}

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Raised
          </p>

          <p className="mt-1 text-3xl font-bold">
            {raisedAmount.toLocaleString()}{' '}
            NIM
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Target
          </p>

          <p className="mt-1 text-lg font-bold">
            {targetAmount.toLocaleString()}{' '}
            NIM
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#c7f36b] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-white/50">
        <span>
          {progress}% complete
        </span>

        <span className="text-right">
          {isCompleted
            ? 'Goal reached'
            : `${remainingAmount.toLocaleString()} NIM remaining`}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          {deadlineStatus.icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Deadline
          </p>

          <p className="mt-1 text-sm font-semibold">
            {deadlineStatus.label}
          </p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
        {label}
      </p>

      <p className="mt-2 truncate text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#607060]">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Information rows                                                           */
/* -------------------------------------------------------------------------- */

function InfoRow({
  label,
  value,
  secondaryValue,
  mono = false,
}: {
  label: string
  value: string
  secondaryValue?: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <span className="shrink-0 text-sm text-[#607060]">
        {label}
      </span>

      <div className="max-w-[68%] min-w-0 text-right">
        <p
          className={`break-all text-sm text-[#162018] ${
            mono
              ? 'font-mono text-xs'
              : 'font-medium'
          }`}
        >
          {value}
        </p>

        {secondaryValue && (
          <p className="mt-1 break-all font-mono text-[10px] text-[#607060]">
            {secondaryValue}
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function LoadingBlock({
  message,
}: {
  message: string
}) {
  return (
    <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-5 text-center">
      <div className="mx-auto h-6 w-6 animate-pulse rounded-full bg-[#dff5a8]" />

      <p className="mt-3 text-xs font-semibold text-[#607060]">
        {message}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Contributors                                                               */
/* -------------------------------------------------------------------------- */

function ContributorList({
  contributions,
}: {
  contributions: CircleContribution[]
}) {
  const uniqueContributors =
    Array.from(
      new Map(
        contributions.map(
          (contribution) => [
            contribution.contributorWallet.toLowerCase(),
            contribution,
          ],
        ),
      ).values(),
    )

  return (
    <div className="mt-5 space-y-3">
      {uniqueContributors.map(
        (contribution) => (
          <div
            key={
              contribution.contributorWallet
            }
            className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8f5] p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold">
                {contribution.contributorUsername
                  ? `@${contribution.contributorUsername}`
                  : contribution.contributorWallet}
              </p>
              
              <p className="mt-1 truncate font-mono text-xs text-[#607060]">
                {contribution.contributorWallet}
              </p>
            </div>

            <span className="shrink-0 text-sm font-bold text-[#162018]">
              {getContributorTotal(
                contributions,
                contribution.contributorWallet,
              ).toLocaleString()}{' '}
              NIM
            </span>
          </div>
        ),
      )}
    </div>
  )
}

function getContributorTotal(
  contributions: CircleContribution[],
  wallet: string,
) {
  return contributions
    .filter(
      (contribution) =>
        contribution.contributorWallet.toLowerCase() ===
        wallet.toLowerCase(),
    )
    .reduce(
      (total, contribution) =>
        total +
        contribution.amount / 100_000,
      0,
    )
}

/* -------------------------------------------------------------------------- */
/* Contribution history                                                       */
/* -------------------------------------------------------------------------- */

function ContributionHistory({
  contributions,
}: {
  contributions: CircleContribution[]
}) {
  return (
    <div className="mt-5 space-y-3">
      {contributions.map(
        (contribution) => (
          <div
            key={
              contribution._id
            }
            className="rounded-2xl border border-black/5 bg-[#f7f8f5] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">
                  Contribution
                </p>

                <p className="mt-1 font-mono text-xs text-[#607060]">
                  {truncateHash(
                    contribution.transactionHash,
                  )}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold">
                {(
                  contribution.amount /
                  100_000
                ).toLocaleString()}{' '}
                NIM
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#607060]">
              <span>
                {formatDateTime(
                  contribution.confirmedAt ||
                    contribution.createdAt,
                )}
              </span>

              <span className="rounded-full bg-[#dff5a8] px-2.5 py-1 font-bold text-[#162018]">
                Confirmed
              </span>
            </div>
          </div>
        ),
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Empty states                                                               */
/* -------------------------------------------------------------------------- */

function EmptyContributors() {
  return (
    <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-5 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#dff5a8] text-lg font-bold text-[#162018]">
        +
      </div>

      <p className="mt-3 text-sm font-bold">
        No contributors yet
      </p>

      <p className="mt-1 text-xs leading-5 text-[#607060]">
        Share this Circle to invite people to contribute.
      </p>
    </div>
  )
}

function EmptyContributionHistory() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-black/10 p-5 text-center">
      <p className="text-sm font-bold">
        No contributions yet
      </p>

      <p className="mt-1 text-xs leading-5 text-[#607060]">
        Once someone contributes NIM, their payment will appear here.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Circle states                                                              */
/* -------------------------------------------------------------------------- */

function CompletedState() {
  return (
    <div className="rounded-3xl border border-[#c7f36b] bg-[#eff9d7] p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c7f36b] text-lg font-bold text-[#162018]">
        ✓
      </div>

      <h2 className="mt-4 text-base font-bold">
        Goal reached
      </h2>

      <p className="mt-2 text-sm leading-5 text-[#607060]">
        This Circle has reached its target.
      </p>
    </div>
  )
}

function ExpiredState() {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f2ec] text-lg font-bold text-[#607060]">
        !
      </div>

      <h2 className="mt-4 text-base font-bold">
        Circle expired
      </h2>

      <p className="mt-2 text-sm leading-5 text-[#607060]">
        The deadline has passed before the goal was reached.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Deadline                                                                   */
/* -------------------------------------------------------------------------- */

function getDeadlineStatus(
  timestamp: number,
  completed: boolean,
  now: number,
): DeadlineStatus {
  if (completed) {
    return {
      label: 'Goal completed',
      icon: '✓',
    }
  }

  if (
    Number.isNaN(timestamp)
  ) {
    return {
      label:
        'Deadline unavailable',
      icon: '?',
    }
  }

  const difference =
    timestamp - now

  if (difference <= 0) {
    return {
      label: 'Deadline passed',
      icon: '!',
    }
  }

  const daysRemaining =
    difference /
    (1000 * 60 * 60 * 24)

  if (daysRemaining <= 1) {
    return {
      label:
        'Less than a day left',
      icon: '!',
    }
  }

  if (daysRemaining <= 7) {
    const roundedDays =
      Math.ceil(
        daysRemaining,
      )

    return {
      label: `${roundedDays} days left`,
      icon: '!',
    }
  }

  const roundedDays =
    Math.ceil(
      daysRemaining,
    )

  return {
    label:
      `${roundedDays} days left`,
    icon: '○',
  }
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )
}

function formatDateTime(
  value: string,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return date.toLocaleString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  )
}

function truncateHash(
  hash: string,
) {
  if (hash.length <= 18) {
    return hash
  }

  return `${hash.slice(
    0,
    10,
  )}...${hash.slice(-8)}`
}