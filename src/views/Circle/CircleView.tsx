import { useState } from 'react'
import type { Circle } from '../../types/circle'

interface CircleViewProps {
  circle: Circle
  onBack: () => void
  currentAddress?: string
}

export default function CircleView({
  circle,
  onBack,
  currentAddress,
}: CircleViewProps) {
  const [now] = useState(() => Date.now())

  const raisedAmount: number = 0
  const contributorCount: number = 0

  const targetAmount = circle.targetAmount

  const progress =
    targetAmount > 0
      ? Math.min(
          100,
          Math.round(
            (raisedAmount / targetAmount) * 100,
          ),
        )
      : 0

  const remainingAmount = Math.max(
    0,
    targetAmount - raisedAmount,
  )

  const deadline = new Date(circle.deadline)

  const deadlineTimestamp = deadline.getTime()

  const hasValidDeadline = !Number.isNaN(
    deadlineTimestamp,
  )

  const isCreator =
    currentAddress?.toLowerCase() ===
    circle.creator.toLowerCase()

  const isCompleted =
    raisedAmount >= targetAmount

  const isExpired =
    hasValidDeadline &&
    deadlineTimestamp < now &&
    !isCompleted

  const deadlineLabel = hasValidDeadline
    ? deadline.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : circle.deadline

  const deadlineStatus = getDeadlineStatus(
    deadlineTimestamp,
    isCompleted,
    now,
  )

  async function handleShare() {
    const shareUrl = window.location.href

    try {
      if (
        navigator.share &&
        typeof navigator.share === 'function'
      ) {
        await navigator.share({
          title: circle.name,
          text: `Join my NimCircle goal: ${circle.name}`,
          url: shareUrl,
        })

        return
      }

      await navigator.clipboard.writeText(
        shareUrl,
      )

      window.alert(
        'Circle link copied to clipboard.',
      )
    } catch {
      // Sharing can be cancelled by the user.
    }
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

      <GoalHeader
        circle={circle}
        raisedAmount={raisedAmount}
        progress={progress}
        remainingAmount={remainingAmount}
        deadlineStatus={deadlineStatus}
        isCompleted={isCompleted}
        isExpired={isExpired}
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          label="Contributors"
          value={contributorCount.toString()}
          description={
            contributorCount === 1
              ? 'person contributing'
              : 'people contributing'
          }
        />

        <StatCard
          label="Deadline"
          value={deadlineLabel}
          description={deadlineStatus.label}
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
            value={circle.creator}
            mono
          />

          <InfoRow
            label="Recipient"
            value={circle.recipient}
            mono
          />

          <InfoRow
            label="Created"
            value={formatDate(circle.createdAt)}
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
            {contributorCount}
          </span>
        </div>

        <EmptyContributors />
      </div>

      <div className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold">
            Contribution history
          </h2>

          <p className="mt-1 text-xs text-[#607060]">
            NIM payments recorded for this Circle
          </p>
        </div>

        <EmptyContributionHistory />
      </div>

      {isCreator && !isCompleted && (
        <div className="mt-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607060]">
              Creator controls
            </p>

            <h2 className="mt-2 text-lg font-bold">
              Manage your Circle
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607060]">
              You can extend the deadline if your group needs
              more time to reach the goal.
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
            Deadline management will be available in the next
            stage.
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
              disabled
              className="min-h-13 w-full rounded-2xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#162018] shadow-sm transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              Contribute NIM
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-[#607060]">
              Contributions will use your connected Nimiq Pay
              wallet and require your approval.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

function GoalHeader({
  circle,
  raisedAmount,
  progress,
  remainingAmount,
  deadlineStatus,
  isCompleted,
  isExpired,
}: {
  circle: Circle
  raisedAmount: number
  progress: number
  remainingAmount: number
  deadlineStatus: DeadlineStatus
  isCompleted: boolean
  isExpired: boolean
}) {
  const status = isCompleted
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
            {raisedAmount.toLocaleString()} NIM
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Target
          </p>

          <p className="mt-1 text-lg font-bold">
            {circle.targetAmount.toLocaleString()} NIM
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

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <span className="shrink-0 text-sm text-[#607060]">
        {label}
      </span>

      <span
        className={`max-w-[68%] break-all text-right text-sm text-[#162018]/70 ${
          mono ? 'font-mono text-xs' : 'font-medium'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

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
        Once someone contributes NIM, their payment will appear
        here.
      </p>
    </div>
  )
}

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

interface DeadlineStatus {
  label: string
  icon: string
}

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

  if (Number.isNaN(timestamp)) {
    return {
      label: 'Deadline unavailable',
      icon: '?',
    }
  }

  const difference = timestamp - now

  if (difference <= 0) {
    return {
      label: 'Deadline passed',
      icon: '!',
    }
  }

  const daysRemaining =
    difference / (1000 * 60 * 60 * 24)

  if (daysRemaining <= 1) {
    return {
      label: 'Less than a day left',
      icon: '!',
    }
  }

  if (daysRemaining <= 7) {
    const roundedDays = Math.ceil(
      daysRemaining,
    )

    return {
      label: `${roundedDays} days left`,
      icon: '!',
    }
  }

  const roundedDays = Math.ceil(
    daysRemaining,
  )

  return {
    label: `${roundedDays} days left`,
    icon: '○',
  }
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}