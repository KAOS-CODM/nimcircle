import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { Circle } from '../../types/circle'

import ContributeModal from '../../components/ContributeModal'

import {
  apiCancelCircle,
  apiExtendCircleDeadline,
  apiGetCircle,
  getLocalizedApiError,
} from '../../lib/api'

import { useLanguage } from '../../i18n/useLanguage'

interface CircleViewProps {
  circleId: string
  onBack: () => void
  currentAddress: string
  currentUserId: string
  network: 'testnet' | 'mainnet' | null
}

interface CircleStats {
  raisedAmount: number
  targetAmount: number
  remainingAmount: number
  progressPercentage: number
  contributorCount: number
  creatorCommitment: number
}

interface CircleContribution {
  _id: string
  circleId: string
  contributorWallet: string
  contributorUserId: string
  contributorUsername?: string
  recipientWallet: string
  amount: number
  transactionHash: string
  memo: string
  status:
    | 'pending'
    | 'confirmed'
    | 'failed'
  confirmedAt: string | null
  createdAt: string
  updatedAt: string
}

interface DeadlineStatus {
  label: string
  icon: string
}

const EMPTY_STATS: CircleStats = {
  raisedAmount: 0,
  targetAmount: 0,
  remainingAmount: 0,
  progressPercentage: 0,
  contributorCount: 0,
  creatorCommitment: 0,
}

function normalizeWalletAddress(
  address: string,
): string {
  return address
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
}

function formatNumber(
  value: number,
  language: string,
): string {
  return value.toLocaleString(
    language,
  )
}

function formatNim(
  value: number,
  language: string,
): string {
  return `${formatNumber(
    value,
    language,
  )} NIM`
}

function interpolate(
  template: string,
  values: Record<
    string,
    string | number
  >,
): string {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) =>
      String(
        values[key] ??
          `{${key}}`,
      ),
  )
}

function toDateTimeLocalMin(
  value: string,
) {
  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return undefined
  }

  const offset =
    date.getTimezoneOffset()

  const localDate = new Date(
    date.getTime() -
      offset * 60 * 1000,
  )

  return localDate
    .toISOString()
    .slice(0, 16)
}

function formatDate(
  value: string,
  language: string,
) {
  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return date.toLocaleDateString(
    language,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )
}

function formatDateTime(
  value: string,
  language: string,
) {
  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return date.toLocaleString(
    language,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  )
}

function truncateHash(
  hash: string,
) {
  if (hash.length <= 18) {
    return hash
  }

  return `${hash.slice(
    0,
    10,
  )}...${hash.slice(-8)}`
}

function truncateWallet(
  wallet: string,
) {
  if (wallet.length <= 18) {
    return wallet
  }

  return `${wallet.slice(
    0,
    10,
  )}...${wallet.slice(-8)}`
}

function getContributorTotal(
  contributions: CircleContribution[],
  wallet: string,
) {
  return contributions
    .filter(
      (contribution) =>
        contribution.contributorWallet.toLowerCase() ===
        wallet.toLowerCase(),
    )
    .reduce(
      (
        total,
        contribution,
      ) =>
        total +
        Number(
          contribution.amount,
        ) /
          100_000,
      0,
    )
}

function getDeadlineStatus(
  timestamp: number,
  completed: boolean,
  now: number,
  language: string,
  t: ReturnType<
    typeof useLanguage
  >['t']['circle'],
): DeadlineStatus {
  if (completed) {
    return {
      label: t.goalCompleted,
      icon: '✓',
    }
  }

  if (Number.isNaN(timestamp)) {
    return {
      label:
        t.deadlineUnavailable,
      icon: '?',
    }
  }

  if (timestamp < now) {
    return {
      label: t.deadlinePassed,
      icon: '!',
    }
  }

  const difference =
    timestamp - now

  const day =
    24 * 60 * 60 * 1000

  const daysRemaining =
    Math.ceil(
      difference / day,
    )

  if (daysRemaining <= 1) {
    return {
      label: t.lessThanDay,
      icon: '!',
    }
  }

  return {
    label: interpolate(
      t.daysLeft,
      {
        count: formatNumber(
          daysRemaining,
          language,
        ),
      },
    ),
    icon:
      daysRemaining <= 7
        ? '!'
        : '○',
  }
}

export default function CircleView({
  circleId,
  onBack,
  currentAddress,
  currentUserId,
  network,
}: CircleViewProps) {
  const {
    language,
    t,
  } = useLanguage()

  const [circle, setCircle] =
    useState<Circle | null>(
      null,
    )

  const [now, setNow] =
    useState(() => Date.now())

  const [
    showContributeModal,
    setShowContributeModal,
  ] = useState(false)

  const [linkCopied, setLinkCopied] =
    useState(false)

  const [
    circleIdCopied,
    setCircleIdCopied,
  ] = useState(false)

  const [stats, setStats] =
    useState<CircleStats>(
      EMPTY_STATS,
    )

  const [
    contributions,
    setContributions,
  ] = useState<
    CircleContribution[]
  >([])

  const [
    loadingCircle,
    setLoadingCircle,
  ] = useState(true)

  const [
    refreshingCircle,
    setRefreshingCircle,
  ] = useState(false)

  const [
    circleError,
    setCircleError,
  ] = useState<string | null>(
    null,
  )

  const [
    showDeadlineModal,
    setShowDeadlineModal,
  ] = useState(false)

  const [
    newDeadline,
    setNewDeadline,
  ] = useState('')

  const [
    extendingDeadline,
    setExtendingDeadline,
  ] = useState(false)

  const [
    deadlineError,
    setDeadlineError,
  ] = useState('')

  const [
    showCancelConfirm,
    setShowCancelConfirm,
  ] = useState(false)

  const [
    cancellingCircle,
    setCancellingCircle,
  ] = useState(false)

  const [
    cancelError,
    setCancelError,
  ] = useState('')

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setNow(Date.now())
      }, 60_000)

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [])

  const loadCircle = useCallback(
    async () => {
      setRefreshingCircle(true)
      setCircleError(null)
  
      try {
        const response =
          await apiGetCircle(circleId)
  
        setCircle(response.circle)
  
        setStats(
          response.stats ??
            EMPTY_STATS,
        )
  
        setContributions(
          response.contributions ??
            [],
        )
      } catch (requestError) {
        setCircleError(
          getLocalizedApiError(
            requestError,
            t,
          ),
        )
      } finally {
        setRefreshingCircle(false)
      }
    },
    [circleId, t],
  )
  
  useEffect(() => {
    let cancelled = false
  
    const loadInitialCircle =
      async () => {
        try {
          const response =
            await apiGetCircle(circleId)
  
          if (cancelled) {
            return
          }
  
          setCircle(
            response.circle,
          )
  
          setStats(
            response.stats ??
              EMPTY_STATS,
          )
  
          setContributions(
            response.contributions ??
              [],
          )
        } catch (requestError) {
          if (cancelled) {
            return
          }
  
          const message =
            requestError instanceof Error
              ? requestError.message
              : String(requestError)
  
          setCircleError(
            message,
          )
        } finally {
          if (!cancelled) {
            setLoadingCircle(false)
          }
        }
      }
  
    void loadInitialCircle()
  
    return () => {
      cancelled = true
    }
  }, [circleId])

  async function handleShare() {
    const miniAppUrl =
      import.meta.env.VITE_NIMCIRCLE_URL
  
    const shareUrl =
      `https://nimpay.app/miniapps/open/${miniAppUrl}/circle/${encodeURIComponent(circleId)}`
  
    try {
      if (navigator.share) {
        await navigator.share({
          title: circle?.name
            ? `Join ${circle.name}`
            : 'Join my NimCircle',
          text:
            'Open this Circle in NimCircle.',
          url: shareUrl,
        })
  
        return
      }
  
      const textArea =
        document.createElement('textarea')
  
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.top = '0'
  
      document.body.appendChild(textArea)
  
      textArea.focus()
      textArea.select()
  
      const copied =
        document.execCommand('copy')
  
      document.body.removeChild(textArea)
  
      if (!copied) {
        throw new Error(
          'Copy command failed',
        )
      }
  
      setLinkCopied(true)
  
      window.setTimeout(() => {
        setLinkCopied(false)
      }, 2000)
    } catch (error) {
      console.error(
        'Failed to share Circle link:',
        error,
      )
  
      window.alert(
        t.circle.unableToCopy,
      )
    }
  }

  async function handleCopyCircleId() {
    if (!circle) {
      return
    }

    try {
      const textArea =
        document.createElement(
          'textarea',
        )

      textArea.value = circle.id
      textArea.style.position =
        'fixed'
      textArea.style.left =
        '-9999px'
      textArea.style.top = '0'

      document.body.appendChild(
        textArea,
      )

      textArea.focus()
      textArea.select()

      const copied =
        document.execCommand(
          'copy',
        )

      document.body.removeChild(
        textArea,
      )

      if (!copied) {
        throw new Error(
          'Copy command failed',
        )
      }

      setCircleIdCopied(true)

      window.setTimeout(() => {
        setCircleIdCopied(false)
      }, 2000)
    } catch (error) {
      console.error(
        'Failed to copy Circle ID:',
        error,
      )

      window.alert(
        t.circle.unableToCopy,
      )
    }
  }

  async function handleContributionSuccess() {
    await loadCircle()
  }

  async function handleExtendDeadline() {
    if (!circle) {
      return
    }

    if (!newDeadline) {
      setDeadlineError(
        t.circle
          .chooseNewDeadline,
      )
      return
    }

    const parsedDeadline =
      new Date(newDeadline)

    if (
      Number.isNaN(
        parsedDeadline.getTime(),
      )
    ) {
      setDeadlineError(
        t.circle
          .validNewDeadline,
      )
      return
    }

    const currentDeadline =
      new Date(circle.deadline)

    if (
      Number.isNaN(
        currentDeadline.getTime(),
      )
    ) {
      setDeadlineError(
        t.circle
          .currentDeadlineInvalid,
      )
      return
    }

    if (
      parsedDeadline.getTime() <=
      currentDeadline.getTime()
    ) {
      setDeadlineError(
        t.circle
          .newDeadlineMustBeLater,
      )
      return
    }

    setExtendingDeadline(true)
    setDeadlineError('')

    try {
      const updatedCircle =
        await apiExtendCircleDeadline(
          circle.id,
          parsedDeadline.toISOString(),
          normalizeWalletAddress(
            currentAddress,
          ),
        )

      setCircle(
        updatedCircle,
      )

      setShowDeadlineModal(
        false,
      )

      setNewDeadline('')

      await loadCircle()
    } catch (
      requestError
    ) {
      const message =
        requestError instanceof
        Error
          ? requestError.message
          : String(
              requestError,
            )

      setDeadlineError(
        message,
      )
    } finally {
      setExtendingDeadline(false)
    }
  }

  async function handleCancelCircle() {
    if (!circle) {
      return
    }

    setCancellingCircle(true)
    setCancelError('')

    try {
      const updatedCircle =
        await apiCancelCircle(
          circle.id,
          normalizeWalletAddress(
            currentAddress,
          ),
        )

      setCircle(
        updatedCircle,
      )

      setShowCancelConfirm(
        false,
      )

      await loadCircle()
    } catch (
      requestError
    ) {
      const message =
        requestError instanceof
        Error
          ? requestError.message
          : String(
              requestError,
            )

      setCancelError(
        message,
      )
    } finally {
      setCancellingCircle(
        false,
      )
    }
  }

  if (loadingCircle) {
    return (
      <section className="py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <BackIcon />
          {t.circle.back}
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <SpinnerIcon />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {t.circle.loading}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {
              t.circle
                .loadingDescription
            }
          </p>
        </div>
      </section>
    )
  }

  if (!circle) {
    return (
      <section className="py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <BackIcon />
          {t.circle.back}
        </button>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-bold text-red-800">
            {t.circle.unableToLoad}
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {circleError ??
              t.circle.refreshError}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadCircle()
            }
            className="mt-4 rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700"
          >
            {t.circle.tryAgain}
          </button>
        </div>
      </section>
    )
  }

  const raisedAmount =
    Number(
      stats.raisedAmount ?? 0,
    )

  const targetAmount =
    Number(
      stats.targetAmount ?? 0,
    ) > 0
      ? Number(
          stats.targetAmount,
        )
      : Number(
          circle.targetAmount ??
            0,
        )

  const remainingAmount =
    Math.max(
      0,
      Number(
        stats.remainingAmount ??
          0,
      ) > 0
        ? Number(
            stats.remainingAmount,
          )
        : Math.max(
            0,
            targetAmount -
              raisedAmount,
          ),
    )

  const contributorCount =
    Number(
      stats.contributorCount ??
        0,
    )

  const creatorCommitment =
    Number(
      stats.creatorCommitment ??
        0,
    ) > 0
      ? Number(
          stats.creatorCommitment,
        )
      : Number(
          circle.creatorCommitment ??
            0,
        )

  const progress =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          Number(
            stats.progressPercentage ??
              0,
          ),
        ),
      ),
    )

  const deadline =
    new Date(circle.deadline)

  const deadlineTimestamp =
    deadline.getTime()

  const hasValidDeadline =
    !Number.isNaN(
      deadlineTimestamp,
    )

  const normalizedCurrentAddress =
    normalizeWalletAddress(
      currentAddress,
    )

  const normalizedCreatorAddress =
    normalizeWalletAddress(
      circle.creator,
    )

  const normalizedRecipientAddress =
    normalizeWalletAddress(
      circle.recipient,
    )

  const isCreator =
    normalizedCurrentAddress ===
    normalizedCreatorAddress

  const isCreatorGoalOwner =
    isCreator &&
    normalizedCurrentAddress ===
      normalizedRecipientAddress

  const canCreatorContribute =
    isCreator &&
    !isCreatorGoalOwner &&
    creatorCommitment > 0 &&
    creatorCommitment <=
      remainingAmount

  const isCompleted =
    raisedAmount >=
    targetAmount

  const isCancelled =
    circle.status ===
    'cancelled'

  const isExpired =
    hasValidDeadline &&
    deadlineTimestamp < now &&
    !isCompleted

  const deadlineLabel =
    hasValidDeadline
      ? deadline.toLocaleDateString(
          language,
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
        )
      : circle.deadline

  const deadlineStatus =
    getDeadlineStatus(
      deadlineTimestamp,
      isCompleted,
      now,
      language,
      t.circle,
    )

  return (
    <section className="py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      >
        <BackIcon />
        {t.circle.back}
      </button>

      {circleError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            {t.circle.refreshError}
          </p>

          <p className="mt-1 text-xs leading-5 text-red-600">
            {circleError}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadCircle()
            }
            disabled={
              refreshingCircle
            }
            className="mt-3 rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 disabled:opacity-50"
          >
            {refreshingCircle
              ? t.circle.retrying
              : t.circle.retry}
          </button>
        </div>
      )}

      <GoalHeader
        circle={circle}
        raisedAmount={
          raisedAmount
        }
        targetAmount={
          targetAmount
        }
        progress={progress}
        remainingAmount={
          remainingAmount
        }
        deadlineLabel={
          deadlineLabel
        }
        deadlineStatus={
          deadlineStatus
        }
        isCompleted={
          isCompleted
        }
        isExpired={
          isExpired
        }
        isCancelled={
          isCancelled
        }
        language={language}
        t={t.circle}
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          icon={<PeopleIcon />}
          label={
            t.circle
              .contributors
          }
          value={formatNumber(
            contributorCount,
            language,
          )}
        />

        <StatCard
          icon={
            <CalendarIcon />
          }
          label={
            t.circle.deadline
          }
          value={
            deadlineLabel
          }
        />
      </div>

      {/* Share Circle */}
      <button
        type="button"
        onClick={() =>
          void handleShare()
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
      >
        <ShareIcon />

        {linkCopied
          ? t.circle.linkCopied
          : t.circle.shareCircle}
      </button>

      {/* Circle ID */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {t.circle.circleId}
            </p>

            <p className="mt-1 truncate font-mono text-xs font-bold text-slate-700">
              {circle.id}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void handleCopyCircleId()
            }
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition active:scale-[0.98] hover:text-emerald-700"
          >
            <CopyIcon />

            {circleIdCopied
              ? t.circle
                  .circleIdCopied
              : t.circle
                  .copyCircleId}
          </button>
        </div>
      </div>

      {/* About Circle */}
      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">
          {t.circle.aboutCircle}
        </h2>

        <div className="mt-4 space-y-4">
          <InfoRow
            label={
              t.circle.creator
            }
            value={
              circle.creatorUsername
                ? `@${circle.creatorUsername}`
                : truncateWallet(
                    circle.creator,
                  )
            }
            secondaryValue={
              circle.creator
            }
          />

          <InfoRow
            label={
              t.circle.goalOwner
            }
            value={
              circle.recipientUsername
                ? `@${circle.recipientUsername}`
                : truncateWallet(
                    circle.recipient,
                  )
            }
            secondaryValue={
              circle.recipient
            }
          />

          <InfoRow
            label={
              t.circle
                .creatorCommitment
            }
            value={formatNim(
              creatorCommitment,
              language,
            )}
          />

          <InfoRow
            label={
              t.circle.created
            }
            value={formatDate(
              circle.createdAt,
              language,
            )}
          />
        </div>
      </div>

      {/* Contributors */}
      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {
                t.circle
                  .contributors
              }
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {
                t.circle
                  .contributorsDescription
              }
            </p>
          </div>

          {refreshingCircle && (
            <SpinnerIcon />
          )}
        </div>

        {contributions.length ===
        0 ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-sm font-semibold text-slate-700">
              {
                t.circle
                  .noContributors
              }
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {
                t.circle
                  .noContributorsDescription
              }
            </p>
          </div>
        ) : (
          <ContributorList
            contributions={
              contributions
            }
            language={language}
          />
        )}
      </div>

      {/* Contribution History */}
      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {
              t.circle
                .contributionHistory
            }
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {
              t.circle
                .contributionHistoryDescription
            }
          </p>
        </div>

        {contributions.length ===
        0 ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-sm font-semibold text-slate-700">
              {
                t.circle
                  .noContributions
              }
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {
                t.circle
                  .noContributionsDescription
              }
            </p>
          </div>
        ) : (
          <ContributionHistory
            contributions={
              contributions
            }
            language={language}
            t={t.circle}
          />
        )}
      </div>

      {/* Creator Controls */}
      {isCreator &&
        !isCompleted &&
        !isExpired &&
        !isCancelled && (
          <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-base font-bold text-emerald-950">
              {t.circle.creatorControls}
            </h2>

            <p className="mt-1 text-sm leading-6 text-emerald-800">
              {t.circle.manageCircle}
            </p>

            <div className="mt-4 rounded-2xl bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {
                  t.circle
                    .fixedCommitment
                }
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatNim(
                  creatorCommitment,
                  language,
                )}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {
                  t.circle
                    .cannotChange
                }
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeadlineError(
                  '',
                )

                setNewDeadline(
                  toDateTimeLocalMin(
                    circle.deadline,
                  ) ?? '',
                )

                setShowDeadlineModal(
                  true,
                )
              }}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-left text-sm font-bold text-emerald-800"
            >
              <span>
                {
                  t.circle
                    .extendDeadline
                }
              </span>

              <ChevronIcon />
            </button>

            <p className="mt-2 text-xs leading-5 text-emerald-700">
              {
                t.circle
                  .extendDeadlineDescription
              }
            </p>

            <button
              type="button"
              onClick={() => {
                setCancelError(
                  '',
                )

                setShowCancelConfirm(
                  true,
                )
              }}
              className="mt-4 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700"
            >
              {
                t.circle
                  .cancelCircle
              }
            </button>

            <p className="mt-2 text-xs leading-5 text-red-600">
              {
                t.circle
                  .cancelCircleDescription
              }
            </p>
          </div>
        )}

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {
                  t.circle
                    .cancelConfirm
                }
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCancelConfirm(
                    false,
                  )
                }
                className="rounded-full p-2 text-slate-500"
              >
                <CloseIcon />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {
                t.circle
                  .cancelWarning
              }
            </p>

            {cancelError && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">
                {cancelError}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowCancelConfirm(
                    false,
                  )
                }
                disabled={
                  cancellingCircle
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
              >
                {
                  t.circle
                    .keepCircle
                }
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleCancelCircle()
                }
                disabled={
                  cancellingCircle
                }
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {cancellingCircle
                  ? t.circle
                      .cancelling
                  : t.circle
                      .cancelCircle}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deadline Modal */}
      {showDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {
                    t.circle
                      .giveMoreTime
                  }
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    t.circle
                      .newDeadlineDescription
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeadlineError(
                    '',
                  )

                  setShowDeadlineModal(
                    false,
                  )
                }}
                className="rounded-full p-2 text-slate-500"
              >
                <CloseIcon />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-bold text-slate-700">
                {
                  t.circle
                    .newDeadline
                }
              </span>

              <input
                type="datetime-local"
                value={newDeadline}
                min={toDateTimeLocalMin(
                  circle.deadline,
                )}
                onChange={(event) =>
                  setNewDeadline(
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {deadlineError && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">
                {deadlineError}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeadlineError(
                    '',
                  )

                  setShowDeadlineModal(
                    false,
                  )
                }}
                disabled={
                  extendingDeadline
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
              >
                {
                  t.circle
                    .closeDeadlineEditor
                }
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleExtendDeadline()
                }
                disabled={
                  extendingDeadline ||
                  !newDeadline
                }
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {extendingDeadline
                  ? t.circle
                      .updatingDeadline
                  : t.circle
                      .updateDeadline}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribution / Circle Status */}
      <div className="mt-5">
        {isCompleted ? (
          <CompletedState
            t={t.circle}
          />
        ) : isExpired ? (
          <ExpiredState
            t={t.circle}
          />
        ) : isCancelled ? (
          <CancelledState
            t={t.circle}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                setShowContributeModal(
                  true,
                )
              }
              disabled={
                loadingCircle ||
                isCancelled ||
                remainingAmount <= 0 ||
                (isCreator &&
                  !canCreatorContribute)
              }
              className="w-full rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isCreator
                ? canCreatorContribute
                  ? `${t.circle.contributeNim} ${formatNim(
                      creatorCommitment,
                      language,
                    )}`
                  : t.circle
                      .creatorCommitmentUnavailable
                : remainingAmount <=
                    0
                  ? t.circle
                      .goalFullyFunded
                  : t.circle
                      .contributeNim}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
              {isCreator
                ? canCreatorContribute
                  ? t.circle
                      .creatorContributionDescription
                  : isCreatorGoalOwner
                    ? t.circle
                        .goalOwnerDescription
                    : t.circle
                        .noCreatorCommitmentDescription
                : t.circle
                    .contributorDescription}
            </p>
          </>
        )}
      </div>

      {showContributeModal &&
        currentAddress && (
          <ContributeModal
            circleId={circleId}
            recipient={
              normalizedRecipientAddress
            }
            remainingAmount={
              remainingAmount
            }
            contributorWallet={
              normalizedCurrentAddress
            }
            contributorUserId={
              currentUserId
            }
            fixedAmountNim={
              isCreator
                ? creatorCommitment
                : undefined
            }
            onClose={() =>
              setShowContributeModal(
                false,
              )
            }
            onSuccess={
              handleContributionSuccess
            }
            network={network}
          />
        )}
    </section>
  )
}

function GoalHeader({
  circle,
  raisedAmount,
  targetAmount,
  progress,
  remainingAmount,
  deadlineLabel,
  deadlineStatus,
  isCompleted,
  isExpired,
  isCancelled,
  language,
  t,
}: {
  circle: Circle
  raisedAmount: number
  targetAmount: number
  progress: number
  remainingAmount: number
  deadlineLabel: string
  deadlineStatus: DeadlineStatus
  isCompleted: boolean
  isExpired: boolean
  isCancelled: boolean
  language: string
  t: ReturnType<
    typeof useLanguage
  >['t']['circle']
}) {
  const status =
    isCompleted
      ? t.completed
      : isCancelled
        ? t.cancelled
        : isExpired
          ? t.expired
          : t.active

  return (
    <div className="overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            {t.sharedGoal}
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight">
            {circle.name}
          </h1>
        </div>

        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          {status}
        </span>
      </div>

      {circle.description && (
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {circle.description}
        </p>
      )}

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400">
            {t.raised}
          </p>

          <p className="mt-1 text-2xl font-black">
            {formatNim(
              raisedAmount,
              language,
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400">
            {t.target}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatNim(
              targetAmount,
              language,
            )}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-300">
            {formatNumber(
              progress,
              language,
            )}
            %
          </span>

          <span className="text-slate-400">
            {formatNim(
              remainingAmount,
              language,
            )}{' '}
            {t.remaining.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <CalendarIcon />

          <span>
            {t.deadline}: {deadlineLabel}
          </span>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
          <span>
            {deadlineStatus.icon}
          </span>

          {deadlineStatus.label}
        </span>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-900">
        {value}
      </p>
    </div>
  )
}

function InfoRow({
  label,
  value,
  secondaryValue,
}: {
  label: string
  value: string
  secondaryValue?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">
          {value}
        </p>

        {secondaryValue && (
          <p className="mt-1 max-w-47.5 truncate text-xs text-slate-400">
            {secondaryValue}
          </p>
        )}
      </div>
    </div>
  )
}

function ContributorList({
  contributions,
  language,
}: {
  contributions: CircleContribution[]
  language: string
}) {
  const uniqueContributors =
    Array.from(
      new Map(
        contributions.map(
          (contribution) => [
            contribution.contributorWallet.toLowerCase(),
            contribution,
          ],
        ),
      ).values(),
    )

  return (
    <div className="mt-5 space-y-3">
      {uniqueContributors.map(
        (contribution) => (
          <div
            key={
              contribution.contributorWallet
            }
            className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {contribution.contributorUsername
                  ? `@${contribution.contributorUsername}`
                  : truncateWallet(
                      contribution.contributorWallet,
                    )}
              </p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {truncateWallet(
                  contribution.contributorWallet,
                )}
              </p>
            </div>

            <p className="shrink-0 text-sm font-black text-emerald-700">
              {formatNim(
                getContributorTotal(
                  contributions,
                  contribution.contributorWallet,
                ),
                language,
              )}
            </p>
          </div>
        ),
      )}
    </div>
  )
}

function ContributionHistory({
  contributions,
  language,
  t,
}: {
  contributions: CircleContribution[]
  language: string
  t: ReturnType<
    typeof useLanguage
  >['t']['circle']
}) {
  return (
    <div className="mt-5 space-y-3">
      {contributions.map(
        (contribution) => (
          <div
            key={
              contribution._id
            }
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {contribution.contributorUsername
                    ? `@${contribution.contributorUsername}`
                    : truncateWallet(
                        contribution.contributorWallet,
                      )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDateTime(
                    contribution.confirmedAt ??
                      contribution.createdAt,
                    language,
                  )}
                </p>
              </div>

              <p className="shrink-0 text-sm font-black text-emerald-700">
                {formatNim(
                  Number(
                    contribution.amount,
                  ) /
                    100_000,
                  language,
                )}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="truncate text-xs text-slate-400">
                {truncateHash(
                  contribution.transactionHash,
                )}
              </span>

              {contribution.status ===
                'confirmed' && (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  {t.confirmed}
                </span>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  )
}

function CompletedState({
  t,
}: {
  t: ReturnType<
    typeof useLanguage
  >['t']['circle']
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-black text-emerald-700">
        ✓
      </div>

      <h2 className="mt-3 text-lg font-black text-emerald-950">
        {t.goalReached}
      </h2>

      <p className="mt-2 text-sm leading-6 text-emerald-800">
        {
          t.goalReachedDescription
        }
      </p>
    </div>
  )
}

function ExpiredState({
  t,
}: {
  t: ReturnType<
    typeof useLanguage
  >['t']['circle']
}) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-black text-amber-700">
        !
      </div>

      <h2 className="mt-3 text-lg font-black text-amber-950">
        {t.expired}
      </h2>

      <p className="mt-2 text-sm leading-6 text-amber-800">
        {
          t.circleExpiredDescription
        }
      </p>
    </div>
  )
}

function CancelledState({
  t,
}: {
  t: ReturnType<
    typeof useLanguage
  >['t']['circle']
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-black text-slate-600">
        ×
      </div>

      <h2 className="mt-3 text-lg font-black text-slate-900">
        {t.cancelled}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {
          t.circleCancelledDescription
        }
      </p>
    </div>
  )
}

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="9"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M16 2v4M8 2v4M3 10h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="5"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="6"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="18"
        cy="19"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}