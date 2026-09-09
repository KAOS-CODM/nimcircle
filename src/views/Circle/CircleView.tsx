import type { Circle } from '../../types/circle'

interface CircleViewProps {
  circle: Circle
  onBack: () => void
}

export default function CircleView({
  circle,
  onBack,
}: CircleViewProps) {
  const deadline = new Date(circle.deadline)

  return (
    <section className="py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 min-h-11 text-sm font-semibold text-[#607060]"
      >
        ← Back
      </button>

      <div className="rounded-4xl bg-[#162018] p-6 text-white">
        <p className="text-sm font-semibold text-[#c7f36b]">
          Shared goal
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {circle.name}
        </h1>

        {circle.description && (
          <p className="mt-3 text-sm leading-6 text-white/60">
            {circle.description}
          </p>
        )}

        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
                Raised
              </p>

              <p className="mt-1 text-3xl font-bold">
                0 NIM
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
            <div className="h-full w-0 rounded-full bg-[#c7f36b]" />
          </div>

          <div className="mt-3 flex justify-between text-xs text-white/50">
            <span>0%</span>
            <span>
              {circle.targetAmount.toLocaleString()} NIM remaining
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Contributors
          </p>

          <p className="mt-2 text-2xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Deadline
          </p>

          <p className="mt-2 text-sm font-bold">
            {deadline.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">
          About this Circle
        </h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#607060]">
              Creator
            </span>

            <span className="max-w-[65%] break-all text-right font-medium">
              {circle.creator}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-[#607060]">
              Recipient
            </span>

            <span className="max-w-[65%] break-all text-right font-medium">
              {circle.recipient}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="mt-5 min-h-12 w-full rounded-2xl bg-[#dff5a8] px-5 py-3 text-sm font-bold text-[#162018] opacity-60"
      >
        Contribute NIM
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-[#607060]">
        NIM contributions will be connected to the Circle in the
        next stage.
      </p>
    </section>
  )
}