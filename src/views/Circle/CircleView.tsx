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
  apiUpdateCircleCommitment,
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
  creatorContributedAmount: number
  creatorCommitmentRemaining: number
}

interface CircleContribution {
  id: string
  contributorWallet: string
  contributorUserId: string
  contributorUsername?: string
  amount: number
  transactionHash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmedAt?: string | null
  createdAt?: string
}

const EMPTY_STATS: CircleStats = {
  raisedAmount: 0,
  targetAmount: 0,
  remainingAmount: 0,
  progressPercentage: 0,
  contributorCount: 0,
  creatorCommitment: 0,
  creatorContributedAmount: 0,
  creatorCommitmentRemaining: 0,
}

function normalizeWalletAddress(address: string) {
  return address
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
}

function shortenWalletAddress(address: string) {
  if (!address) {
    return ''
  }

  if (address.length <= 18) {
    return address
  }

  return `${address.slice(0, 10)}...${address.slice(-8)}`
}

function formatNim(amount: number, language: string) {
  return new Intl.NumberFormat(language, {
    maximumFractionDigits: 4,
  }).format(amount)
}

function formatDate(
  value: string | Date | null | undefined,
  language: string,
) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
  }).format(date)
}

function formatDateTime(
  value: string | Date | null | undefined,
  language: string,
) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function toDateTimeLocalMin(value: string | Date) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const offset = date.getTimezoneOffset()

  const localDate = new Date(
    date.getTime() - offset * 60_000,
  )

  return localDate.toISOString().slice(0, 16)
}

function Icon({
  children,
  className = 'h-5 w-5',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  )
}

type IconProps = {
  className?: string
}

function ArrowLeftIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  )
}

function CopyIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect
        height="12"
        rx="2"
        width="12"
        x="9"
        y="9"
      />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Icon>
  )
}

function ShareIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6" />
      <path d="m8.2 13.2 7.6 4.6" />
    </Icon>
  )
}

function UsersIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  )
}

function CalendarIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect
        height="18"
        rx="2"
        width="18"
        x="3"
        y="4"
      />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Icon>
  )
}

function TargetIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4V2M20 12h2M12 20v2M4 12H2" />
    </Icon>
  )
}

function WalletIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M16 13h5" />
      <circle cx="16" cy="13" r="1" />
      <path d="M4 5V4a2 2 0 0 1 2-2h11" />
    </Icon>
  )
}

function EditIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </Icon>
  )
}

function CheckIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m5 12 4 4L19 6" />
    </Icon>
  )
}

function XIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Icon>
  )
}

function ExternalLinkIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M14 5h5v5" />
      <path d="m19 5-8 8" />
      <path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
    </Icon>
  )
}

function InfoRow({
  label,
  value,
  valueClassName = '',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      
      <span className="shrink-0 text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`min-w-0 max-w-[68%] wrap-break-word text-right text-sm font-semibold text-slate-900 ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  )
}

function WalletIdentity({
  username,
  address,
  isCurrentUser = false,
}: {
  username?: string
  address: string
  isCurrentUser?: boolean
}) {
  return (
    <div className="min-w-0 max-w-[68%] text-right">
      <p className="wrap-break-word text-sm font-semibold text-slate-900">
        {isCurrentUser
          ? 'You'
          : username
            ? `@${username}`
            : shortenWalletAddress(address)}
      </p>

      {!isCurrentUser && (
        <p className="mt-1 break-all text-xs font-medium text-slate-400">
          {address}
        </p>
      )}
    </div>
  )
}

export default function CircleView({
  circleId,
  onBack,
  currentAddress,
  currentUserId,
  network,
}: CircleViewProps) {
  const { t, language } = useLanguage()

  const [circle, setCircle] = useState<Circle | null>(null)

  const [stats, setStats] =
    useState<CircleStats>(EMPTY_STATS)

  const [contributions, setContributions] =
    useState<CircleContribution[]>([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [circleError, setCircleError] = useState('')

  const [
    showContributeModal,
    setShowContributeModal,
  ] = useState(false)

  const [
    showCommitmentEditor,
    setShowCommitmentEditor,
  ] = useState(false)

  const [
    commitmentInput,
    setCommitmentInput,
  ] = useState('')

  const [
    commitmentError,
    setCommitmentError,
  ] = useState('')

  const [
    updatingCommitment,
    setUpdatingCommitment,
  ] = useState(false)

  const [
    showDeadlineEditor,
    setShowDeadlineEditor,
  ] = useState(false)

  const [
    deadlineInput,
    setDeadlineInput,
  ] = useState('')

  const [
    deadlineMin,
    setDeadlineMin,
  ] = useState('')

  const [
    deadlineError,
    setDeadlineError,
  ] = useState('')

  const [
    extendingDeadline,
    setExtendingDeadline,
  ] = useState(false)

  const [cancelling, setCancelling] =
    useState(false)

  const [copyFeedback, setCopyFeedback] =
    useState(false)

  const [shareFeedback, setShareFeedback] =
    useState<'shared' | 'copied' | null>(null)

  const loadCircle = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setCircleError('')

      try {
        const result =
          await apiGetCircle(circleId)

        setCircle(result.circle)

        setStats({
          raisedAmount: Number(
            result.stats?.raisedAmount ?? 0,
          ),
          targetAmount: Number(
            result.stats?.targetAmount ?? 0,
          ),
          remainingAmount: Number(
            result.stats?.remainingAmount ?? 0,
          ),
          progressPercentage: Number(
            result.stats?.progressPercentage ?? 0,
          ),
          contributorCount: Number(
            result.stats?.contributorCount ?? 0,
          ),
          creatorCommitment: Number(
            result.stats?.creatorCommitment ??
              result.circle
                .creatorCommitment ??
              0,
          ),
          creatorContributedAmount: Number(
            result.stats
              ?.creatorContributedAmount ?? 0,
          ),
          creatorCommitmentRemaining: Number(
            result.stats
              ?.creatorCommitmentRemaining ?? 0,
          ),
        })

        setContributions(
          Array.isArray(
            result.contributions,
          )
            ? result.contributions.map(
                (contribution, index) => ({
                  id:
                    contribution.transactionHash ||
                    `${contribution.contributorWallet}-${contribution.createdAt ?? index}`,

                  contributorWallet:
                    contribution.contributorWallet,

                  contributorUserId:
                    contribution.contributorUserId,

                  contributorUsername:
                    contribution.contributorUsername,

                  amount: Number(
                    contribution.amount ?? 0,
                  ),

                  transactionHash:
                    contribution.transactionHash,

                  status:
                    contribution.status,

                  confirmedAt:
                    contribution.confirmedAt ??
                    null,

                  createdAt:
                    contribution.createdAt,
                }),
              )
            : [],
        )
      } catch (requestError) {
        setCircleError(
          getLocalizedApiError(
            requestError,
            t,
          ),
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [circleId, t],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCircle()
  }, [loadCircle])

  const normalizedCurrentAddress =
    normalizeWalletAddress(currentAddress)

  const normalizedCreatorAddress =
    normalizeWalletAddress(
      circle?.creator ?? '',
    )

  const normalizedRecipientAddress =
    normalizeWalletAddress(
      circle?.recipient ?? '',
    )

  const isCreator =
    normalizedCurrentAddress !== '' &&
    normalizedCurrentAddress === normalizedCreatorAddress

  const isGoalOwner =
    normalizedCurrentAddress !== '' &&
    normalizedCurrentAddress === normalizedRecipientAddress
  
  const isFundraisingCircle =
    circle !== null &&
    normalizedCreatorAddress !== '' &&
    normalizedRecipientAddress !== '' &&
    normalizedCreatorAddress !==
      normalizedRecipientAddress

  const isPersonalCircle =
    circle !== null &&
    !isFundraisingCircle

  const creatorCommitment = Math.max(
    0,
    Number(
      stats.creatorCommitment ??
        circle?.creatorCommitment ??
        0,
    ),
  )

  const creatorContributedAmount =
    Math.max(
      0,
      Number(
        stats.creatorContributedAmount ?? 0,
      ),
    )

  const creatorCommitmentRemaining =
    Math.max(
      0,
      Number(
        stats.creatorCommitmentRemaining ??
          0,
      ),
    )

  const remainingAmount = Math.max(
    0,
    Number(stats.remainingAmount ?? 0),
  )

  /*
   * Creator commitment is no longer a hard
   * contribution limit. A fundraising creator
   * can open the contribution flow even when
   * their commitment has been fully used.
   *
   * The ContributeModal handles the decision
   * when a payment exceeds the remaining
   * commitment.
   */
  const canCreatorContribute =
    isCreator &&
    isFundraisingCircle &&
    circle?.status === 'active' &&
    remainingAmount > 0

  const canContribute =
    circle !== null &&
    circle.status === 'active' &&
    remainingAmount > 0 &&
    !isGoalOwner &&
    (!isCreator || canCreatorContribute)

  const confirmedRaisedAmount =
    Math.max(
      0,
      Number(stats.raisedAmount ?? 0),
    )

  const progressPercentage =
    Math.min(
      100,
      Math.max(
        0,
        stats.targetAmount > 0
          ? (confirmedRaisedAmount /
              stats.targetAmount) *
            100
          : stats.progressPercentage,
      ),
    )

  const isCompleted =
    circle?.status === 'completed' ||
    confirmedRaisedAmount >=
      stats.targetAmount

  const openCommitmentEditor = () => {
    setCommitmentInput(
      creatorCommitment > 0
        ? String(creatorCommitment)
        : '',
    )

    setCommitmentError('')
    setShowCommitmentEditor(true)
  }

  const closeCommitmentEditor = () => {
    if (updatingCommitment) {
      return
    }

    setShowCommitmentEditor(false)
    setCommitmentError('')
  }

  const handleCommitmentUpdate =
    async () => {
      if (!circle) {
        return
      }

      const nextCommitment =
        Number(commitmentInput)

      if (
        !Number.isFinite(nextCommitment) ||
        nextCommitment <= 0
      ) {
        setCommitmentError(
          t.app.errors
            .fundraisingCommitmentRequired,
        )
        return
      }

      if (
        nextCommitment >
        stats.targetAmount
      ) {
        setCommitmentError(
          t.app.errors
            .commitmentCannotExceedTarget,
        )
        return
      }

      if (
        nextCommitment <
        creatorContributedAmount
      ) {
        setCommitmentError(
          t.app.errors
            .commitmentCannotBeBelowContributed,
        )
        return
      }

      setUpdatingCommitment(true)
      setCommitmentError('')

      try {
        const updatedCircle =
          await apiUpdateCircleCommitment(
            circle.id,
            nextCommitment,
            normalizedCurrentAddress,
          )

        setCircle(updatedCircle)

        setCommitmentInput(
          String(
            Number(
              updatedCircle
                .creatorCommitment ?? 0,
            ),
          ),
        )

        setShowCommitmentEditor(false)

        await loadCircle(true)
      } catch (requestError) {
        setCommitmentError(
          getLocalizedApiError(
            requestError,
            t,
          ),
        )
      } finally {
        setUpdatingCommitment(false)
      }
    }

  const openDeadlineEditor = () => {
    if (!circle?.deadline) {
      return
    }

    setDeadlineInput(
      toDateTimeLocalMin(
        circle.deadline,
      ),
    )

    setDeadlineMin(
      toDateTimeLocalMin(
        new Date(Date.now() + 60_000),
      ),
    )

    setDeadlineError('')
    setShowDeadlineEditor(true)
  }

  const handleDeadlineUpdate =
    async () => {
      if (!circle) {
        return
      }

      if (!deadlineInput) {
        setDeadlineError(
          t.app.errors.deadlineRequired,
        )
        return
      }

      const nextDeadline =
        new Date(deadlineInput)

      if (
        Number.isNaN(
          nextDeadline.getTime(),
        ) ||
        nextDeadline.getTime() <=
          Date.now()
      ) {
        setDeadlineError(
          t.app.errors.deadlineNotFuture,
        )
        return
      }

      setExtendingDeadline(true)
      setDeadlineError('')

      try {
        await apiExtendCircleDeadline(
          circle.id,
          nextDeadline.toISOString(),
          normalizedCurrentAddress,
        )

        setShowDeadlineEditor(false)

        await loadCircle(true)
      } catch (requestError) {
        setDeadlineError(
          getLocalizedApiError(
            requestError,
            t,
          ),
        )
      } finally {
        setExtendingDeadline(false)
      }
    }

  const handleCancelCircle = async () => {
    if (!circle || cancelling) {
      return
    }

    const confirmed = window.confirm(
      t.circle.cancelConfirm,
    )

    if (!confirmed) {
      return
    }

    setCancelling(true)

    try {
      await apiCancelCircle(
        circle.id,
        normalizedCurrentAddress,
      )

      await loadCircle(true)
    } catch (requestError) {
      setCircleError(
        getLocalizedApiError(
          requestError,
          t,
        ),
      )
    } finally {
      setCancelling(false)
    }
  }

  const handleCopyCircleId =
    async () => {
      if (!circle) {
        return
      }
  
      const textArea =
        document.createElement('textarea')
  
      try {
        textArea.value = circle.id
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '0'
        textArea.style.opacity = '0'
  
        document.body.appendChild(
          textArea,
        )
  
        textArea.focus()
        textArea.select()
  
        const copied =
          document.execCommand('copy')
  
        if (!copied) {
          throw new Error(
            'Copy command failed',
          )
        }
  
        setCopyFeedback(true)
  
        window.setTimeout(() => {
          setCopyFeedback(false)
        }, 1800)
      } catch (error) {
        console.error(
          'Failed to copy Circle ID:',
          error,
        )
  
        setCircleError(
          t.circle.circleIdCopyFailed,
        )
      } finally {
        if (textArea.parentNode) {
          textArea.parentNode.removeChild(
            textArea,
          )
        }
      }
    }

  const handleShare = async () => {
    const miniAppUrl =
      import.meta.env.VITE_NIMCIRCLE_URL
  
    const shareUrl =
      `https://nimpay.app/miniapps/open/${miniAppUrl}/circle/${encodeURIComponent(circleId)}`
  
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            circle?.name ?? 'NimCircle',
          text:
            t.circle.shareDescription,
          url: shareUrl,
        })
  
        setShareFeedback('shared')
  
        window.setTimeout(() => {
          setShareFeedback(null)
        }, 1800)
  
        return
      }
  
      const textArea =
        document.createElement('textarea')
  
      try {
        textArea.value = shareUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '0'
        textArea.style.opacity = '0'
  
        document.body.appendChild(
          textArea,
        )
  
        textArea.focus()
        textArea.select()
  
        const copied =
          document.execCommand('copy')
  
        if (!copied) {
          throw new Error(
            'Copy command failed',
          )
        }
  
        setShareFeedback('copied')
  
        window.setTimeout(() => {
          setShareFeedback(null)
        }, 1800)
      } finally {
        if (textArea.parentNode) {
          textArea.parentNode.removeChild(
            textArea,
          )
        }
      }
    } catch (error) {
      console.error(
        'Failed to share Circle link:',
        error,
      )
    }
  }

  const handleContributionSuccess =
    async () => {
      setShowContributeModal(false)
      await loadCircle(true)
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              {t.circle.loading}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-xl px-5 py-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            {t.circle.back}
          </button>

          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <XIcon />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              {t.app.errors.circleNotFound}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {circleError}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadCircle()
              }
              className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t.circle.retry}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const circleStatusLabel =
    circle.status === 'completed'
      ? t.circle.completed
      : circle.status === 'expired'
        ? t.circle.expired
        : circle.status === 'cancelled'
          ? t.circle.cancelled
          : t.circle.active

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto w-full max-w-xl">
        <header className="bg-slate-950 px-5 pb-7 pt-5 text-white">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              aria-label={t.circle.back}
            >
              <ArrowLeftIcon />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  void handleShare()
                }
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  shareFeedback
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
                aria-label={
                  t.circle.shareCircle
                }
              >
                {shareFeedback ? (
                  <CheckIcon />
                ) : (
                  <ShareIcon />
                )}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
              {circleStatusLabel}
            </span>

            <h1 className="mt-3 text-3xl font-black tracking-tight">
              {circle.name}
            </h1>

            {circle.description && (
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {circle.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <span>
                {t.circle.circleId}:
              </span>

              <button
                type="button"
                onClick={() =>
                  void handleCopyCircleId()
                }
                className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-white transition"
              >
                <span className="max-w-47.5 truncate">
                  {circleId}
                </span>

                {copyFeedback ? (
                  <CheckIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <CopyIcon className="h-4 w-4 shrink-0" />
                )}
              </button>

              {copyFeedback && (
                <span className="animate-in fade-in text-emerald-400">
                  {t.circle.circleIdCopied}
                </span>
              )}
            </div>

            {shareFeedback && (
              <div className="fixed bottom-6 left-1/2 z-60 -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-xl">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />

                  <span>
                    {shareFeedback === 'shared'
                      ? t.circle.shared
                      : t.circle.linkCopied}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="-mt-4 px-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.circle.progress}
                </p>

                <p className="mt-2 text-3xl font-black text-slate-950">
                  {formatNim(
                    confirmedRaisedAmount,
                    language,
                  )}{' '}
                  <span className="text-lg font-bold text-slate-400">
                    NIM
                  </span>
                </p>
              </div>

              <p className="text-sm font-bold text-emerald-600">
                {Math.round(
                  progressPercentage,
                )}
                %
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                {t.circle.target}:{' '}
                <strong className="text-slate-800">
                  {formatNim(
                    stats.targetAmount,
                    language,
                  )}{' '}
                  NIM
                </strong>
              </span>

              <span>
                {t.circle.remaining}:{' '}
                <strong className="text-slate-800">
                  {formatNim(
                    remainingAmount,
                    language,
                  )}{' '}
                  NIM
                </strong>
              </span>
            </div>
          </section>

          {circleError && (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {circleError}
            </div>
          )}

          <section className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UsersIcon className="h-4 w-4" />
              </div>

              <p className="mt-3 text-lg font-black text-slate-900">
                {stats.contributorCount}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {t.circle.contributors}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarIcon className="h-4 w-4" />
              </div>

              <p className="mt-3 truncate text-sm font-black text-slate-900">
                {formatDate(
                  circle.deadline,
                  language,
                )}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {t.circle.deadline}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TargetIcon className="h-4 w-4" />
              </div>

              <p className="mt-3 text-sm font-black text-slate-900">
                {isPersonalCircle
                  ? t.circle.personal
                  : t.circle.fundraising}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {t.circle.goalType}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-base font-black text-slate-900">
              {t.circle.aboutCircle}
            </h2>

            <div className="mt-3 divide-y divide-slate-100">
              <div className="flex items-start justify-between gap-4 py-3">
                <span className="shrink-0 text-sm text-slate-500">
                  {t.circle.goalOwner}
                </span>

                <WalletIdentity
                  username={
                    circle.recipientUsername
                  }
                  address={
                    circle.recipient
                  }
                  isCurrentUser={
                    normalizedRecipientAddress ===
                    normalizedCurrentAddress
                  }
                />
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="shrink-0 text-sm text-slate-500">
                  {t.circle.creator}
                </span>

                <WalletIdentity
                  username={
                    circle.creatorUsername
                  }
                  address={
                    circle.creator
                  }
                  isCurrentUser={
                    normalizedCreatorAddress ===
                    normalizedCurrentAddress
                  }
                />
              </div>

              <InfoRow
                label={t.circle.deadline}
                value={formatDateTime(
                  circle.deadline,
                  language,
                )}
              />

              {isFundraisingCircle && (
                <InfoRow
                  label={
                    t.circle
                      .creatorCommitment
                  }
                  value={`${formatNim(
                    creatorCommitment,
                    language,
                  )} NIM`}
                />
              )}
            </div>
          </section>

          {isFundraisingCircle && (
            <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <WalletIcon className="h-4 w-4" />
                    </div>

                    <h2 className="text-base font-black text-slate-900">
                      {
                        t.circle
                          .creatorCommitment
                      }
                    </h2>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {
                      t.circle
                        .commitmentDescription
                    }
                  </p>
                </div>

                {isCreator &&
                  circle.status ===
                    'active' && (
                    <button
                      type="button"
                      onClick={
                        openCommitmentEditor
                      }
                      className="flex h-9 shrink items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 sm:px-3"
                    >
                      <EditIcon className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">
                        {t.circle.editCommitment}
                      </span>
                    </button>
                  )}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    {t.circle.committed}
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    {formatNim(
                      creatorCommitment,
                      language,
                    )}{' '}
                    NIM
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    {t.circle.contributed}
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    {formatNim(
                      creatorContributedAmount,
                      language,
                    )}{' '}
                    NIM
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-700">
                    {t.circle.remaining}
                  </p>

                  <p className="mt-1 text-sm font-black text-emerald-800">
                    {formatNim(
                      creatorCommitmentRemaining,
                      language,
                    )}{' '}
                    NIM
                  </p>
                </div>
              </div>

              {isCreator && (
                <p className="mt-4 text-xs leading-5 text-slate-400">
                  {
                    t.circle
                      .creatorContributionDescription
                  }
                </p>
              )}
            </section>
          )}

          {isCreator &&
            circle.status === 'active' && (
              <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <CalendarIcon className="h-4 w-4" />
                  </div>

                  <h2 className="text-base font-black text-slate-900">
                    {t.circle.creatorControls}
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={
                      openDeadlineEditor
                    }
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3.5 text-left transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {t.circle.extendDeadline}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDateTime(
                          circle.deadline,
                          language,
                        )}
                      </p>
                    </div>

                    <ExternalLinkIcon className="h-4 w-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleCancelCircle()
                    }
                    disabled={cancelling}
                    className="flex w-full items-center justify-between rounded-2xl border border-red-100 px-4 py-3.5 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div>
                      <p className="text-sm font-bold text-red-600">
                        {cancelling
                          ? t.circle
                              .cancelling
                          : t.circle
                              .cancelCircle}
                      </p>
                    </div>

                    <XIcon className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </section>
            )}

          {isCompleted && (
            <section className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <CheckIcon />
                </div>

                <div>
                  <h2 className="text-base font-black text-emerald-900">
                    {t.circle.goalCompleted}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    {
                      t.circle
                        .goalReachedDescription
                    }
                  </p>
                </div>
              </div>
            </section>
          )}

          {circle.status === 'expired' && (
            <section className="mt-4 rounded-3xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-sm font-bold text-amber-900">
                {t.circle.circleExpired}
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                {
                  t.circle
                    .circleExpiredDescription
                }
              </p>
            </section>
          )}

          {circle.status === 'cancelled' && (
            <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">
                {t.circle.circleCancelled}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {
                  t.circle
                    .cancelCircleDescription
                }
              </p>
            </section>
          )}

          <section className="mt-4">
            {canContribute ? (
              <>
                {isCreator && (
                  <p className="mb-3 text-center text-xs text-slate-500">
                    {
                      t.circle
                        .creatorContributionDescription
                    }{' '}
                    <strong className="text-slate-700">
                      {formatNim(
                        creatorCommitmentRemaining,
                        language,
                      )}{' '}
                      NIM
                    </strong>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setShowContributeModal(
                      true,
                    )
                  }
                  className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.99]"
                >
                  {t.circle.contributeNim}
                </button>
              </>
            ) : null}
          </section>

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">
                {t.circle.contributionHistory}
              </h2>

              <button
                type="button"
                onClick={() =>
                  void loadCircle(true)
                }
                disabled={refreshing}
                className="text-xs font-bold text-emerald-600 disabled:opacity-50"
              >
                {refreshing
                  ? t.circle.refreshing
                  : t.circle.refresh}
              </button>
            </div>

            {contributions.length === 0 ? (
              <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-slate-100">
                <p className="text-sm text-slate-500">
                  {t.circle.noContributions}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100">
                {contributions.map(
                  (
                    contribution,
                    index,
                  ) => {
                    const isCurrentContributor =
                      normalizeWalletAddress(
                        contribution.contributorWallet,
                      ) ===
                      normalizedCurrentAddress

                    return (
                      <div
                        key={
                          contribution.id
                        }
                        className={`px-5 py-4 ${
                          index > 0
                            ? 'border-t border-slate-100'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="wrap-break-word text-sm font-bold text-slate-900">
                              {isCurrentContributor
                                ? t.circle.you
                                : contribution.contributorUsername
                                  ? `@${contribution.contributorUsername}`
                                  : shortenWalletAddress(
                                      contribution.contributorWallet,
                                    )}
                            </p>

                            {!isCurrentContributor && (
                              <p className="mt-1 break-all text-xs font-medium text-slate-400">
                                {
                                  contribution.contributorWallet
                                }
                              </p>
                            )}

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDateTime(
                                contribution.createdAt,
                                language,
                              )}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-black text-slate-900">
                              +
                              {formatNim(
                                Number(
                                  contribution.amount ??
                                    0,
                                ),
                                language,
                              )}{' '}
                              NIM
                            </p>

                            {contribution.status ===
                              'confirmed' && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                <CheckIcon className="h-3 w-3" />
                                {
                                  t.circle
                                    .confirmed
                                }
                              </span>
                            )}

                            {contribution.status ===
                              'pending' && (
                              <span className="mt-1 inline-flex text-[11px] font-bold text-amber-600">
                                {
                                  t.circle
                                    .pending
                                }
                              </span>
                            )}

                            {contribution.status ===
                              'failed' && (
                              <span className="mt-1 inline-flex text-[11px] font-bold text-red-600">
                                {
                                  t.circle
                                    .failed
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {showCommitmentEditor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                {t.circle.editCommitment}
              </h2>

              <button
                type="button"
                onClick={
                  closeCommitmentEditor
                }
                disabled={updatingCommitment}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {t.circle.commitmentDescription}
            </p>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                {t.circle.newCommitment}
              </span>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={stats.targetAmount}
                  step="0.0001"
                  value={commitmentInput}
                  onChange={(event) =>
                    setCommitmentInput(
                      event.target.value,
                    )
                  }
                  disabled={updatingCommitment}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-16 text-base font-bold text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  NIM
                </span>
              </div>
            </label>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
              {
                t.circle
                  .creatorContributionDescription
              }
            </div>

            {commitmentError && (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {commitmentError}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={
                  closeCommitmentEditor
                }
                disabled={updatingCommitment}
                className="flex-1 rounded-2xl bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 disabled:opacity-50"
              >
                {t.circle.cancel}
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleCommitmentUpdate()
                }
                disabled={updatingCommitment}
                className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingCommitment
                  ? t.circle.updatingCommitment
                  : t.circle.updateCommitment}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeadlineEditor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                {t.circle.extendDeadline}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowDeadlineEditor(
                    false,
                  )
                }
                disabled={extendingDeadline}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                {t.circle.deadline}
              </span>

              <input
                type="datetime-local"
                value={deadlineInput}
                min={deadlineMin}
                onChange={(event) =>
                  setDeadlineInput(
                    event.target.value,
                  )
                }
                disabled={extendingDeadline}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            {deadlineError && (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {deadlineError}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowDeadlineEditor(
                    false,
                  )
                }
                disabled={extendingDeadline}
                className="flex-1 rounded-2xl bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 disabled:opacity-50"
              >
                {t.circle.cancel}
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleDeadlineUpdate()
                }
                disabled={extendingDeadline}
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {extendingDeadline
                  ? t.circle.extending
                  : t.circle.extendDeadline}
              </button>
            </div>
          </div>
        </div>
      )}

      {showContributeModal && (
        <ContributeModal
          circleId={circleId}
          recipient={
            normalizedRecipientAddress
          }
          remainingAmount={remainingAmount}
          maxAmountNim={
            isCreator &&
            isFundraisingCircle
              ? creatorCommitmentRemaining
              : undefined
          }
          contributorWallet={
            normalizedCurrentAddress
          }
          contributorUserId={currentUserId}
          onClose={() =>
            setShowContributeModal(false)
          }
          onSuccess={
            handleContributionSuccess
          }
          onUpdateCommitment={
            isCreator &&
            isFundraisingCircle
              ? openCommitmentEditor
              : undefined
          }
          network={network}
        />
      )}
    </div>
  )
}