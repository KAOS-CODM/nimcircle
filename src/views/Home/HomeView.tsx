import type { Circle } from '../../types/circle'
import type { CircleProgress } from '../../hooks/useCircles'

interface HomeViewProps {
  userName: string
  circles: Circle[]
  joinedCircles: Circle[]
  circleProgress: Record<string, CircleProgress>
  onCreateCircle: () => void
  onViewCircles: () => void
  onOpenCircle: (circleId: string) => void
}

export default function HomeView({
  userName,
  circles,
  joinedCircles,
  circleProgress,
  onCreateCircle,
  onViewCircles,
  onOpenCircle,
}: HomeViewProps) {
  const allCircles = Array.from(
    new Map(
      [...circles, ...joinedCircles].map((circle) => [
        circle.id,
        circle,
      ]),
    ).values(),
  )

  const activeCircles = allCircles
    .filter((circle) => circle.status === 'active')
    .slice(0, 3)

  /*const totalTarget = activeCircles.reduce(
    (total, circle) => total + circle.targetAmount,
    0,
  )*/

  const totalRaised = activeCircles.reduce(
    (total, circle) =>
      total + (circleProgress[circle.id]?.raisedAmount ?? 0),
    0,
  )

  const createdCount = circles.filter(
    (circle) => circle.status === 'active',
  ).length

  const joinedCount = joinedCircles.filter(
    (circle) => circle.status === 'active',
  ).length

  return (
    <section className="py-6">
      <div className="mb-7">
        <p className="text-sm font-semibold text-[#607060]">
          Welcome back
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {userName}
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#607060]">
          NimCircle makes saving together simple. Create a shared
          goal, invite people, and contribute NIM toward something
          that matters.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateCircle}
        className="group w-full rounded-3xl bg-[#162018] p-6 text-left text-white transition-transform active:scale-[0.99]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#c7f36b]">
              Start a goal
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Create a Circle
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-5 text-white/60">
              Set a shared NIM target and let everyone contribute
              toward the same goal.
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c7f36b] text-xl font-bold text-[#162018] transition-transform group-active:rotate-12">
            +
          </span>
        </div>
      </button>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onViewCircles}
          className="rounded-3xl border border-black/5 bg-white p-5 text-left shadow-sm transition-transform active:scale-[0.98]"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Your goals
          </p>

          <p className="mt-2 text-2xl font-bold">
            {allCircles.length}
          </p>

          <p className="mt-1 text-xs font-medium text-[#607060]">
            {createdCount} created · {joinedCount} joined
          </p>
        </button>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Total raised
          </p>

          <p className="mt-2 truncate text-2xl font-bold">
            {totalRaised.toLocaleString()}
          </p>

          <p className="mt-1 text-xs font-medium text-[#607060]">
            NIM across active goals
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Active goals
            </h2>

            <p className="mt-1 text-xs text-[#607060]">
              Track the shared goals you're saving toward.
            </p>
          </div>

          {allCircles.length > 0 && (
            <button
              type="button"
              onClick={onViewCircles}
              className="min-h-10 text-xs font-bold text-[#607060]"
            >
              View all
            </button>
          )}
        </div>

        {allCircles.length === 0 ? (
          <EmptyHomeState
            onCreateCircle={onCreateCircle}
          />
        ) : activeCircles.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white/60 p-7 text-center">
            <h3 className="text-base font-bold">
              No active goals
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#607060]">
              Your completed or expired Circles will stay in your
              collection. Start a new goal when you're ready.
            </p>

            <button
              type="button"
              onClick={onCreateCircle}
              className="mt-5 min-h-11 rounded-2xl bg-[#162018] px-5 text-sm font-bold text-white transition-transform active:scale-[0.97]"
            >
              Create a Circle
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCircles.map((circle) => (
              <HomeCircleCard
                key={circle.id}
                circle={circle}
                progress={circleProgress[circle.id]}
                onOpen={() => onOpenCircle(circle.id)}
              />
            ))}
          </div>
        )}
      </div>

      {allCircles.length > 3 && (
        <button
          type="button"
          onClick={onViewCircles}
          className="mt-4 min-h-11 w-full rounded-2xl border border-black/10 bg-white px-5 text-sm font-bold text-[#162018] transition-transform active:scale-[0.98]"
        >
          View all {allCircles.length} goals
        </button>
      )}
    </section>
  )
}

function EmptyHomeState({
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
        Your first Circle starts here
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#607060]">
        Create a shared savings goal, set a target, and invite
        people to contribute NIM together.
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

function HomeCircleCard({
  circle,
  progress,
  onOpen,
}: {
  circle: Circle
  progress?: CircleProgress
  onOpen: () => void
}) {
  const raisedAmount = progress?.raisedAmount ?? 0
  const remainingAmount =
    progress?.remainingAmount ??
    Math.max(circle.targetAmount - raisedAmount, 0)

  const progressPercentage = Math.min(
    Math.max(progress?.progressPercentage ?? 0, 0),
    100,
  )

  const contributorCount = progress?.contributorCount ?? 0

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
              Active goal
            </span>
          </div>

          <h3 className="mt-2 truncate text-base font-bold">
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
        <div
          className="h-full rounded-full bg-[#c7f36b] transition-all"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#607060]">
        <span>
          {raisedAmount.toLocaleString()} NIM raised
        </span>

        <span>
          {remainingAmount.toLocaleString()} NIM to go
        </span>
      </div>

      <div className="mt-3 text-xs font-medium text-[#607060]">
        {contributorCount}{' '}
        {contributorCount === 1 ? 'contributor' : 'contributors'}
      </div>
    </button>
  )
}