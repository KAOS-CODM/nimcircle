import { useMemo, useState } from 'react'
import type { Circle } from '../../types/circle'
import type { CircleProgress } from '../../hooks/useCircles'

interface CirclesViewProps {
  circles: Circle[]
  joinedCircles: Circle[]
  circleProgress: Record<string, CircleProgress>
  onCreateCircle: () => void
  onOpenCircle: (circleId: string) => void
  loading?: boolean
  loadingJoined?: boolean
}

export default function CirclesView({
  circles,
  joinedCircles,
  circleProgress,
  onCreateCircle,
  onOpenCircle,
  loading = false,
  loadingJoined = false,
}: CirclesViewProps) {
  const [activeTab, setActiveTab] = useState<
    'created' | 'joined'
  >('created')

  const activeCircles =
    activeTab === 'created'
      ? circles
      : joinedCircles

  const totalTarget = useMemo(
    () =>
      activeCircles.reduce(
        (total, circle) =>
          total + circle.targetAmount,
        0,
      ),
    [activeCircles],
  )

  const isLoading =
    activeTab === 'created'
      ? loading
      : loadingJoined

  return (
    <section className="py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#607060]">
            Your Circles
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Shared goals
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#607060]">
            Create a goal, invite people, and watch
            the progress grow together.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateCircle}
          className="shrink-0 rounded-2xl bg-[#162018] px-4 py-3 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          + Create
        </button>
      </div>

      <div className="mt-7 rounded-2xl bg-[#eef1eb] p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() =>
              setActiveTab('created')
            }
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === 'created'
                ? 'bg-white text-[#162018] shadow-sm'
                : 'text-[#607060]'
            }`}
          >
            Created
            {circles.length > 0 && (
              <span className="ml-2 text-xs opacity-60">
                {circles.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab('joined')
            }
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === 'joined'
                ? 'bg-white text-[#162018] shadow-sm'
                : 'text-[#607060]'
            }`}
          >
            Joined
            {joinedCircles.length > 0 && (
              <span className="ml-2 text-xs opacity-60">
                {joinedCircles.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeCircles.length > 0 && (
        <div className="mt-6 rounded-3xl bg-[#162018] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            {activeTab === 'created'
              ? 'Created goal target'
              : 'Joined goal target'}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {totalTarget.toLocaleString()} NIM
          </p>

          <p className="mt-1 text-sm text-white/60">
            Across {activeCircles.length}{' '}
            {activeCircles.length === 1
              ? 'Circle'
              : 'Circles'}
          </p>
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-[#607060]">
              Loading Circles...
            </p>
          </div>
        ) : activeCircles.length === 0 ? (
          <EmptyState
            type={activeTab}
            onCreateCircle={onCreateCircle}
          />
        ) : (
          <div className="space-y-4">
            {activeCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                progress={
                  circleProgress[circle.id]
                }
                onOpen={() =>
                  onOpenCircle(circle.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CircleCard({
  circle,
  progress,
  onOpen,
}: {
  circle: Circle
  progress?: CircleProgress
  onOpen: () => void
}) {
  const raisedAmount =
    progress?.raisedAmount ?? 0

  const progressPercentage =
    progress?.progressPercentage ?? 0

  const contributorCount =
    progress?.contributorCount ?? 0

  const safeProgress = Math.min(
    100,
    Math.max(0, progressPercentage),
  )

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-[#162018]">
            {circle.name}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#607060]">
            {circle.description ||
              'No description provided.'}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#eff9d7] px-3 py-1 text-xs font-bold text-[#162018]">
          {circle.status}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607060]">
              Raised
            </p>

            <p className="mt-1 text-lg font-bold text-[#162018]">
              {raisedAmount.toLocaleString()} NIM
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607060]">
              Target
            </p>

            <p className="mt-1 text-sm font-bold text-[#162018]">
              {circle.targetAmount.toLocaleString()}{' '}
              NIM
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#edf0e9]">
          <div
            className="h-full rounded-full bg-[#c7f36b] transition-all duration-500"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#607060]">
            {safeProgress.toFixed(0)}% funded
          </p>

          <p className="text-xs font-semibold text-[#607060]">
            {contributorCount}{' '}
            {contributorCount === 1
              ? 'contributor'
              : 'contributors'}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#f5f6f2] p-3">
          <p className="text-xs text-[#607060]">
            Creator commitment
          </p>

          <p className="mt-1 text-sm font-bold text-[#162018]">
            {circle.creatorCommitment.toLocaleString()}{' '}
            NIM
          </p>
        </div>

        <div className="rounded-2xl bg-[#f5f6f2] p-3">
          <p className="text-xs text-[#607060]">
            Deadline
          </p>

          <p className="mt-1 text-sm font-bold text-[#162018]">
            {formatDeadline(circle.deadline)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-medium text-[#607060]">
          Goal owner
        </p>
        
        <div className="max-w-[70%] min-w-0 text-right">
          <p className="truncate text-xs font-semibold text-[#162018]">
            @{circle.recipientUsername}
          </p>
        
          <p className="truncate font-mono text-[10px] text-[#607060]">
            {circle.recipient}
          </p>
        </div>
      </div>
    </button>
  )
}

function EmptyState({
  type,
  onCreateCircle,
}: {
  type: 'created' | 'joined'
  onCreateCircle: () => void
}) {
  if (type === 'joined') {
    return (
      <div className="rounded-3xl border border-dashed border-black/10 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff5a8] text-xl font-bold text-[#162018]">
          +
        </div>

        <h2 className="mt-4 text-lg font-bold">
          No joined Circles yet
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#607060]">
          When you contribute to someone else's
          Circle, it will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff5a8] text-xl font-bold text-[#162018]">
        +
      </div>

      <h2 className="mt-4 text-lg font-bold">
        Create your first Circle
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#607060]">
        Set a savings goal and bring other people
        together to reach it.
      </p>

      <button
        type="button"
        onClick={onCreateCircle}
        className="mt-5 rounded-2xl bg-[#162018] px-5 py-3 text-sm font-bold text-white"
      >
        Create Circle
      </button>
    </div>
  )
}

function formatDeadline(
  deadline: string,
): string {
  const date = new Date(deadline)

  if (Number.isNaN(date.getTime())) {
    return deadline
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}