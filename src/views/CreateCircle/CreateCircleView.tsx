import {
  useState,
  type FormEvent,
} from 'react'

import {
  useLanguage,
} from '../../i18n/useLanguage'

import {
  ApiRequestError,
} from '../../lib/api'

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
  value: string,
) {
  return value
    .trim()
    .replace(/\s+/g, '')
}

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L13.6 8.4L19 10L13.6 11.6L12 17L10.4 11.6L5 10L10.4 8.4L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7.5C4 6.67 4.67 6 5.5 6H19C19.55 6 20 6.45 20 7V18C20 18.55 19.55 19 19 19H5C4.45 19 4 18.55 4 18V7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 9H17.5C18.88 9 20 10.12 20 11.5V14H16.5C15.67 14 15 13.33 15 12.5C15 11.67 15.67 11 16.5 11H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 3V7M16 3V7M4 10H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CommitmentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 7.5C16.5 6.12 14.49 5 12 5C9.51 5 7.5 6.12 7.5 7.5C7.5 8.88 9.51 10 12 10C14.49 10 16.5 11.12 16.5 12.5C16.5 13.88 14.49 15 12 15C9.51 15 7.5 13.88 7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 16.5C16.5 17.88 14.49 19 12 19C9.51 19 7.5 17.88 7.5 16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SectionIcon({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
      {children}
    </div>
  )
}

export default function CreateCircleView({
  creatorWallet,
  onBack,
  onCreate,
  loading = false,
}: CreateCircleViewProps) {
  const {
    t,
  } = useLanguage()

  const [
    name,
    setName,
  ] = useState('')

  const [
    description,
    setDescription,
  ] = useState('')

  const [
    targetAmount,
    setTargetAmount,
  ] = useState('')

  const [
    deadline,
    setDeadline,
  ] = useState('')

  const [
    goalOwnerWallet,
    setGoalOwnerWallet,
  ] = useState(
    creatorWallet,
  )

  const [
    creatorCommitment,
    setCreatorCommitment,
  ] = useState('0')

  const [
    error,
    setError,
  ] = useState('')

  const creatorIsGoalOwner =
    normalizeWalletAddress(
      goalOwnerWallet,
    ).toLowerCase() ===
    normalizeWalletAddress(
      creatorWallet,
    ).toLowerCase()

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')

    const parsedTargetAmount =
      Number(targetAmount)

    const parsedCreatorCommitment =
      Number(creatorCommitment)

    if (!name.trim()) {
      setError(
        t.createCircle.nameRequired,
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
        t.createCircle.targetInvalid,
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
        t.createCircle.commitmentInvalid,
      )
      return
    }

    if (
      parsedCreatorCommitment >
      parsedTargetAmount
    ) {
      setError(
        t.createCircle.commitmentTooHigh,
      )
      return
    }

    if (!deadline) {
      setError(
        t.createCircle.deadlineRequired,
      )
      return
    }

    const deadlineDate =
      new Date(
        `${deadline}T23:59:59`,
      )

    if (
      Number.isNaN(
        deadlineDate.getTime(),
      ) ||
      deadlineDate.getTime() <=
        Date.now()
    ) {
      setError(
        t.createCircle.deadlineInvalid,
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
        t.createCircle.walletInvalid,
      )
      return
    }

    try {
      await onCreate({
        name: name.trim(),
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
    } catch (submitError) {
      if (
        submitError instanceof ApiRequestError
      ) {
        switch (submitError.code) {
          case 'NIM_AMOUNT_INVALID':
            setError(
              t.contributeModal.paymentAmountInvalid,
            )
            return
    
          case 'NIM_AMOUNT_TOO_LARGE':
            setError(
              t.contributeModal.paymentAmountTooLarge,
            )
            return
        }
      }
    
      setError(
        submitError instanceof Error
          ? submitError.message
          : t.createCircle.targetInvalid,
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero */}
      <section className="bg-slate-950 px-4 pb-8 pt-4 text-white">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="mb-7 flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white disabled:opacity-50"
          >
            <ArrowLeftIcon />
            {t.createCircle.back}
          </button>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <SparkIcon />
          </div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            {t.createCircle.newCircle}
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            {t.createCircle.heading}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            {t.createCircle.description}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-md px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Basic details */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <SectionIcon>
                <TargetIcon />
              </SectionIcon>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {t.createCircle.circleName}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {t.createCircle.descriptionLabel}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="circle-name"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  {t.createCircle.circleName}
                </label>

                <input
                  id="circle-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  placeholder={
                    t.createCircle
                      .circleNamePlaceholder
                  }
                  maxLength={80}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="circle-description"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  {t.createCircle
                    .descriptionLabel}
                </label>

                <textarea
                  id="circle-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder={
                    t.createCircle
                      .descriptionPlaceholder
                  }
                  maxLength={500}
                  rows={4}
                  disabled={loading}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-100"
                />
              </div>
            </div>
          </section>

          {/* Goal */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <SectionIcon>
                <TargetIcon />
              </SectionIcon>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {t.createCircle.targetAmount}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {t.createCircle.goalOwnerDescription}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="target-amount"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  {t.createCircle.targetAmount}
                </label>

                <div className="relative">
                  <input
                    id="target-amount"
                    type="number"
                    min="1"
                    step="any"
                    value={targetAmount}
                    onChange={(event) =>
                      setTargetAmount(
                        event.target.value,
                      )
                    }
                    placeholder={
                      t.createCircle
                        .targetPlaceholder
                    }
                    disabled={loading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-100"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    NIM
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="goal-owner-wallet"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  {t.createCircle
                    .goalOwnerWallet}
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <WalletIcon />
                  </div>

                  <input
                    id="goal-owner-wallet"
                    type="text"
                    value={goalOwnerWallet}
                    onChange={(event) =>
                      setGoalOwnerWallet(
                        event.target.value,
                      )
                    }
                    placeholder={
                      t.createCircle
                        .goalOwnerPlaceholder
                    }
                    disabled={loading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-100"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {
                    t.createCircle
                      .goalOwnerDescription
                  }
                </p>

                {creatorIsGoalOwner && (
                  <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-600">
                        <TargetIcon />
                      </div>

                      <p className="text-xs leading-5 text-emerald-800">
                        {
                          t.createCircle
                            .personalCircle
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contribution & deadline */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <SectionIcon>
                <CommitmentIcon />
              </SectionIcon>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {t.createCircle.creatorCommitment}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {t.createCircle.commitmentDescription}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="creator-commitment"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  {
                    t.createCircle
                      .creatorCommitment
                  }
                </label>

                <div className="relative">
                  <input
                    id="creator-commitment"
                    type="number"
                    min="0"
                    step="any"
                    value={creatorCommitment}
                    onChange={(event) =>
                      setCreatorCommitment(
                        event.target.value,
                      )
                    }
                    placeholder={
                      t.createCircle
                        .commitmentPlaceholder
                    }
                    disabled={loading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-100"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    NIM
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {
                    t.createCircle
                      .commitmentDescription
                  }
                </p>

                {creatorIsGoalOwner && (
                  <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs leading-5 text-emerald-800">
                      {
                        t.createCircle
                          .personalCommitmentDescription
                      }
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="circle-deadline"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  {t.createCircle.deadline}
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <CalendarIcon />
                  </div>

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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </div>

                <p className="text-sm leading-5 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? t.createCircle.creating
                : t.createCircle.createCircle}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              {t.createCircle.commitmentDescription}
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}