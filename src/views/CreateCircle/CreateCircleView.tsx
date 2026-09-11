import { useState } from 'react'

interface CreateCircleViewProps {
  creatorWallet: string
  onBack: () => void
  onCreate: (circle: {
    name: string
    description: string
    targetAmount: number
    deadline: string
    goalOwnerWallet: string
    goalOwnerUserId?: string | null
    creatorCommitment: number
  }) => void | Promise<void>
  loading?: boolean
}

function normalizeWalletAddress(
  address: string,
): string {
  return address
    .trim()
    .replace(/\s+/g, '')
}

export default function CreateCircleView({
  creatorWallet,
  onBack,
  onCreate,
  loading = false,
}: CreateCircleViewProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [goalOwnerWallet, setGoalOwnerWallet] =
    useState('')
  const [creatorCommitment, setCreatorCommitment] =
    useState('0')
  const [error, setError] =
    useState<string | null>(null)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (loading) {
      return
    }

    setError(null)

    const parsedTargetAmount =
      Number(targetAmount)

    const parsedCreatorCommitment =
      Number(creatorCommitment)

    if (!name.trim()) {
      setError(
        'Give your Circle a name.',
      )
      return
    }

    if (
      !Number.isFinite(
        parsedTargetAmount,
      ) ||
      parsedTargetAmount <= 0
    ) {
      setError(
        'Enter a valid target amount.',
      )
      return
    }

    if (
      !Number.isFinite(
        parsedCreatorCommitment,
      ) ||
      parsedCreatorCommitment < 0
    ) {
      setError(
        'Enter a valid creator commitment.',
      )
      return
    }

    if (
      parsedCreatorCommitment >
      parsedTargetAmount
    ) {
      setError(
        'Your creator commitment cannot be greater than the target amount.',
      )
      return
    }

    if (!deadline) {
      setError(
        'Choose a deadline.',
      )
      return
    }

    const deadlineTimestamp =
      new Date(deadline).getTime()

    if (
      Number.isNaN(
        deadlineTimestamp,
      ) ||
      deadlineTimestamp <= Date.now()
    ) {
      setError(
        'The deadline must be a valid future date.',
      )
      return
    }

    const normalizedGoalOwner =
      normalizeWalletAddress(
        goalOwnerWallet,
      )

    if (
      !normalizedGoalOwner
        .toLowerCase()
        .startsWith('nq') ||
      normalizedGoalOwner.length < 20
    ) {
      setError(
        'Enter a valid Nimiq wallet address.',
      )
      return
    }

    try {
      await onCreate({
        name:
          name.trim(),

        description:
          description.trim(),

        targetAmount:
          parsedTargetAmount,

        deadline,

        goalOwnerWallet:
          normalizedGoalOwner,

        creatorCommitment:
          parsedCreatorCommitment,
      })
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : String(requestError)

      setError(message)
    }
  }

  const normalizedGoalOwnerForDisplay =
    normalizeWalletAddress(
      goalOwnerWallet,
    )

  const normalizedCreatorWalletForDisplay =
    normalizeWalletAddress(
      creatorWallet,
    )

  const creatorIsGoalOwner =
    normalizedGoalOwnerForDisplay.length > 0 &&
    normalizedGoalOwnerForDisplay
      .toLowerCase() ===
      normalizedCreatorWalletForDisplay.toLowerCase()

  return (
    <section className="py-6">
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="mb-6 min-h-11 text-sm font-semibold text-[#607060] disabled:cursor-not-allowed disabled:opacity-50"
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
          Set the goal, who it is for, your commitment,
          and the deadline. Then share the Circle with
          everyone contributing.
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
            onChange={(event) =>
              setName(event.target.value)
            }
            maxLength={80}
            disabled={loading}
            placeholder="e.g. New apartment"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8] disabled:cursor-not-allowed disabled:bg-gray-100"
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
              setDescription(
                event.target.value,
              )
            }
            maxLength={500}
            rows={4}
            disabled={loading}
            placeholder="What are you saving for?"
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8] disabled:cursor-not-allowed disabled:bg-gray-100"
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
              min="0.00001"
              step="0.00001"
              inputMode="decimal"
              value={targetAmount}
              onChange={(event) =>
                setTargetAmount(
                  event.target.value,
                )
              }
              disabled={loading}
              placeholder="1000"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 pr-16 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8] disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#607060]">
              NIM
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="circle-goal-owner"
            className="mb-2 block text-sm font-bold"
          >
            Goal owner wallet
          </label>

          <input
            id="circle-goal-owner"
            type="text"
            value={goalOwnerWallet}
            onChange={(event) => {
              setGoalOwnerWallet(
                event.target.value,
              )
              setError(null)
            }}
            disabled={loading}
            placeholder="nq... ... ... ..."
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 font-mono text-sm outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8] disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          <p className="mt-2 text-xs leading-5 text-[#607060]">
            This is the wallet that receives all
            contributions. It can be your own wallet or
            someone else's.
          </p>

          {creatorIsGoalOwner && (
            <div className="mt-3 rounded-2xl bg-[#eff9d7] p-3">
              <p className="text-xs leading-5 text-[#162018]">
                This is a personal Circle. Your commitment
                will be recorded as your fixed pledge, but
                you will not send NIM to yourself.
              </p>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="creator-commitment"
            className="mb-2 block text-sm font-bold"
          >
            Your commitment
          </label>

          <div className="relative">
            <input
              id="creator-commitment"
              type="number"
              min="0"
              step="0.00001"
              inputMode="decimal"
              value={creatorCommitment}
              onChange={(event) => {
                setCreatorCommitment(
                  event.target.value,
                )
                setError(null)
              }}
              disabled={loading}
              placeholder="0"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 pr-16 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8] disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#607060]">
              NIM
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-[#607060]">
            Your commitment is fixed when this Circle is
            created. It is included in the goal plan and
            cannot be changed later.
          </p>

          {creatorIsGoalOwner && (
            <p className="mt-2 text-xs leading-5 text-[#607060]">
              Because this is your own goal, the commitment
              is a product-level pledge rather than a
              payment to yourself.
            </p>
          )}
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
              setDeadline(
                event.target.value,
              )
            }
            disabled={loading}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none focus:border-[#162018]/30 focus:ring-2 focus:ring-[#dff5a8] disabled:cursor-not-allowed disabled:bg-gray-100"
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
          disabled={loading}
          className="min-h-12 w-full rounded-2xl bg-[#162018] px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {loading
            ? 'Creating Circle...'
            : 'Create Circle'}
        </button>
      </form>
    </section>
  )
}