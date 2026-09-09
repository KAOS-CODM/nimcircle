import type { Circle } from '../../types/circle'

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
  const totalTarget = circles.reduce(
    (total, circle) => total + circle.targetAmount,
    0,
  )

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
          Keep track of the goals you are creating and supporting.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Circles
          </p>

          <p className="mt-2 text-2xl font-bold">
            {circles.length}
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Total targets
          </p>

          <p className="mt-2 text-2xl font-bold">
            {totalTarget.toLocaleString()} NIM
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            All circles
          </h2>

          {circles.length > 0 && (
            <span className="text-xs font-medium text-[#607060]">
              {circles.length}{' '}
              {circles.length === 1 ? 'circle' : 'circles'}
            </span>
          )}
        </div>

        {circles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5a8] text-xl font-bold">
              +
            </div>

            <h3 className="mt-4 text-base font-bold">
              No circles yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#607060]">
              Create a shared savings goal and invite others to
              contribute NIM.
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
            {circles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onOpen={() => onOpenCircle(circle.id)}
              />
            ))}
          </div>
        )}
      </div>

      {circles.length > 0 && (
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

  const deadlineLabel = Number.isNaN(deadline.getTime())
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
          <h3 className="truncate font-bold">
            {circle.name}
          </h3>

          <p className="mt-1 truncate text-sm text-[#607060]">
            {circle.description ||
              'Shared NIM savings goal'}
          </p>
        </div>

        <span className="shrink-0 rounded-xl bg-[#f7f8f5] px-2.5 py-1 text-xs font-semibold text-[#607060]">
          Active
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Target
          </p>

          <p className="mt-1 text-lg font-bold">
            {circle.targetAmount.toLocaleString()} NIM
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Deadline
          </p>

          <p className="mt-1 text-sm font-semibold">
            {deadlineLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#f0f2ec]">
        <div className="h-full w-0 rounded-full bg-[#c7f36b]" />
      </div>

      <p className="mt-2 text-xs text-[#607060]">
        No contributions recorded yet
      </p>
    </button>
  )
}