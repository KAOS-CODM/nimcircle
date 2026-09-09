import { useState } from 'react'

interface CreateCircleViewProps {
  address: string
  onBack: () => void
  onCreate: (circle: {
    name: string
    description: string
    targetAmount: number
    deadline: string
  }) => void
}

export default function CreateCircleView({
  onBack,
  onCreate,
}: CreateCircleViewProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const amount = Number(targetAmount)

    if (!name.trim()) {
      setError('Give your Circle a name.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid target amount.')
      return
    }

    if (!deadline) {
      setError('Choose a deadline.')
      return
    }

    if (
      new Date(deadline).getTime() <= Date.now()
    ) {
      setError('The deadline must be in the future.')
      return
    }

    setError(null)

    onCreate({
      name: name.trim(),
      description: description.trim(),
      targetAmount: amount,
      deadline,
    })
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

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#607060]">
          New Circle
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Create a shared goal
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#607060]">
          Set the target and deadline. Once created, you can share
          the Circle with everyone contributing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="circle-name"
            className="mb-2 block text-sm font-bold"
          >
            Circle name
          </label>

          <input
            id="circle-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="e.g. New apartment"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8]"
          />
        </div>

        <div>
          <label
            htmlFor="circle-description"
            className="mb-2 block text-sm font-bold"
          >
            Description
          </label>

          <textarea
            id="circle-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={240}
            rows={4}
            placeholder="What are you saving for?"
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8]"
          />
        </div>

        <div>
          <label
            htmlFor="circle-target"
            className="mb-2 block text-sm font-bold"
          >
            Target amount
          </label>

          <div className="relative">
            <input
              id="circle-target"
              type="number"
              min="0.000001"
              step="any"
              inputMode="decimal"
              value={targetAmount}
              onChange={(event) =>
                setTargetAmount(event.target.value)
              }
              placeholder="1000"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 pr-16 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8]"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#607060]">
              NIM
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="circle-deadline"
            className="mb-2 block text-sm font-bold"
          >
            Deadline
          </label>

          <input
            id="circle-deadline"
            type="date"
            value={deadline}
            onChange={(event) =>
              setDeadline(event.target.value)
            }
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8]"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="min-h-12 w-full rounded-2xl bg-[#162018] px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          Create Circle
        </button>
      </form>
    </section>
  )
}