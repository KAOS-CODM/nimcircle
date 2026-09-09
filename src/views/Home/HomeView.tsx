import type { Circle } from '../../types/circle'

interface HomeViewProps {
  userName: string
  circles: Circle[]
  onCreateCircle: () => void
  onViewCircles: () => void
  onOpenCircle: (circleId: string) => void
}

export default function HomeView({
  userName,
  circles,
  onCreateCircle,
  onViewCircles,
  onOpenCircle,
}: HomeViewProps) {
  const totalTarget = circles.reduce(
    (total, circle) => total + circle.targetAmount,
    0,
  )

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
          What are we saving for?
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
              Bring people together around one shared NIM goal.
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
            Your circles
          </p>

          <p className="mt-2 text-2xl font-bold">
            {circles.length}
          </p>

          <p className="mt-1 text-xs font-medium text-[#607060]">
            View all
          </p>
        </button>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Targets
          </p>

          <p className="mt-2 text-2xl font-bold">
            {totalTarget.toLocaleString()} NIM
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Your recent circles
          </h2>

          {circles.length > 0 && (
            <button
              type="button"
              onClick={onViewCircles}
              className="text-xs font-semibold text-[#607060]"
            >
              View all
            </button>
          )}
        </div>

        {circles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-7 text-center">
            <button
              type="button"
              onClick={onCreateCircle}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff5a8] text-lg font-bold text-[#162018] transition-transform active:scale-[0.95]"
              aria-label="Create your first Circle"
            >
              +
            </button>

            <h3 className="mt-4 text-base font-bold">
              No circles yet
            </h3>

            <p className="mt-2 text-sm leading-5 text-[#607060]">
              Create your first shared goal and invite your people
              to contribute.
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
              <button
                key={circle.id}
                type="button"
                onClick={() => onOpenCircle(circle.id)}
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

                  <span className="shrink-0 text-sm font-bold">
                    {circle.targetAmount.toLocaleString()} NIM
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}