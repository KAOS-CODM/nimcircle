import { useState } from 'react'
import type { Circle } from '../../types/circle'

type CircleTab = 'created' | 'joined'

interface CirclesViewProps {
  circles: Circle[]
  onCreateCircle: () => void
  onOpenCircle: (circleId: string) => void
}

export default function CirclesView({
  circles,
  onCreateCircle,
  onOpenCircle,
}: CirclesViewProps) {
  const [activeTab, setActiveTab] =
    useState<CircleTab>('created')

  const totalTarget = circles.reduce(
    (total, circle) => total + circle.targetAmount,
    0,
  )

  const displayedCircles =
    activeTab === 'created'
      ? circles
      : []

  return (
    <section className="py-6">
      <div className="mb-7">
        <p className="text-sm font-semibold text-[#607060]">
          Shared goals
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Your circles
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#607060]">
          Manage the goals you create and the ones you help fund.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Created
          </p>

          <p className="mt-2 text-2xl font-bold">
            {circles.length}
          </p>

          <p className="mt-1 text-xs text-[#607060]">
            {circles.length === 1
              ? 'shared goal'
              : 'shared goals'}
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Targets
          </p>

          <p className="mt-2 truncate text-2xl font-bold">
            {totalTarget.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-[#607060]">
            NIM across your goals
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-2xl bg-[#e9ece4] p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('created')}
            className={`min-h-11 rounded-xl px-4 text-sm font-bold transition ${
              activeTab === 'created'
                ? 'bg-white text-[#162018] shadow-sm'
                : 'text-[#607060]'
            }`}
          >
            Created
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('joined')}
            className={`min-h-11 rounded-xl px-4 text-sm font-bold transition ${
              activeTab === 'joined'
                ? 'bg-white text-[#162018] shadow-sm'
                : 'text-[#607060]'
            }`}
          >
            Joined
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {activeTab === 'created'
                ? 'Circles you created'
                : 'Circles you joined'}
            </h2>

            <p className="mt-1 text-xs text-[#607060]">
              {activeTab === 'created'
                ? 'Goals owned by your wallet'
                : 'Goals you have contributed to'}
            </p>
          </div>

          {displayedCircles.length > 0 && (
            <span className="text-xs font-semibold text-[#607060]">
              {displayedCircles.length}
            </span>
          )}
        </div>

        {activeTab === 'joined' ? (
          <JoinedEmptyState />
        ) : displayedCircles.length === 0 ? (
          <CreatedEmptyState
            onCreateCircle={onCreateCircle}
          />
        ) : (
          <div className="space-y-3">
            {displayedCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onOpen={() => onOpenCircle(circle.id)}
              />
            ))}
          </div>
        )}
      </div>

      {activeTab === 'created' &&
        displayedCircles.length > 0 && (
          <button
            type="button"
            onClick={onCreateCircle}
            className="mt-6 min-h-12 w-full rounded-2xl bg-[#162018] px-5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
          >
            + Create another Circle
          </button>
        )}
    </section>
  )
}

function CircleCard({
  circle,
  onOpen,
}: {
  circle: Circle
  onOpen: () => void
}) {
  const deadline = new Date(circle.deadline)

  const deadlineLabel = Number.isNaN(
    deadline.getTime(),
  )
    ? circle.deadline
    : deadline.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-3xl border border-black/5 bg-white p-5 text-left shadow-sm transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#c7f36b]" />

            <span className="text-xs font-semibold text-[#607060]">
              Active
            </span>
          </div>

          <h3 className="mt-2 truncate font-bold">
            {circle.name}
          </h3>

          <p className="mt-1 truncate text-sm text-[#607060]">
            {circle.description ||
              'Shared NIM savings goal'}
          </p>
        </div>

        <span className="shrink-0 text-sm font-bold">
          {circle.targetAmount.toLocaleString()} NIM
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#f0f2ec]">
        <div className="h-full w-0 rounded-full bg-[#c7f36b]" />
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[#607060]">
            Raised
          </p>

          <p className="mt-1 text-sm font-bold">
            0 NIM
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-[#607060]">
            Deadline
          </p>

          <p className="mt-1 text-sm font-semibold">
            {deadlineLabel}
          </p>
        </div>
      </div>
    </button>
  )
}

function CreatedEmptyState({
  onCreateCircle,
}: {
  onCreateCircle: () => void
}) {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-7 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5a8] text-xl font-bold text-[#162018]">
        +
      </div>

      <h3 className="mt-4 text-base font-bold">
        No created Circles
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#607060]">
        Create a shared goal and invite people to contribute NIM
        toward it.
      </p>

      <button
        type="button"
        onClick={onCreateCircle}
        className="mt-5 min-h-11 rounded-2xl bg-[#162018] px-5 text-sm font-bold text-white transition-transform active:scale-[0.97]"
      >
        Create a Circle
      </button>
    </div>
  )
}

function JoinedEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-7 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5a8] text-xl font-bold text-[#162018]">
        ○
      </div>

      <h3 className="mt-4 text-base font-bold">
        No joined Circles yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#607060]">
        Circles you contribute to will appear here so you can
        easily keep track of the goals you are helping fund.
      </p>
    </div>
  )
}