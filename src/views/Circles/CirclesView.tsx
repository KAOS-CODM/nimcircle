import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type {
  Circle,
} from '../../types/circle'

import type {
  CircleProgress,
} from '../../hooks/useCircles'

import {
  useLanguage,
} from '../../i18n/useLanguage'

interface CirclesViewProps {
  circles: Circle[]
  joinedCircles: Circle[]
  circleProgress: Record<
    string,
    CircleProgress
  >
  onCreateCircle: () => void
  onOpenCircle: (
    circleId: string,
  ) => void
  loading?: boolean
  loadingJoined?: boolean
}

export default function CirclesView({
  circles,
  joinedCircles,
  circleProgress,
  onCreateCircle,
  onOpenCircle,
  loading = false,
  loadingJoined = false,
}: CirclesViewProps) {
  const {
    language,
    t,
  } = useLanguage()

  const [
    activeTab,
    setActiveTab,
  ] = useState<
    'created' | 'joined'
  >('created')

  const activeCircles =
    activeTab === 'created'
      ? circles
      : joinedCircles

  const totalTarget = useMemo(
    () =>
      activeCircles.reduce(
        (
          total,
          circle,
        ) =>
          total +
          circle.targetAmount,
        0,
      ),
    [activeCircles],
  )

  const totalRaised = useMemo(
    () =>
      activeCircles.reduce(
        (
          total,
          circle,
        ) =>
          total +
          (circleProgress[
            circle.id
          ]?.raisedAmount ?? 0),
        0,
      ),
    [
      activeCircles,
      circleProgress,
    ],
  )

  const isLoading =
    activeTab === 'created'
      ? loading
      : loadingJoined

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CircleStackIcon />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {t.circles.title}
            </p>
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {t.circles.heading}
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {t.circles.description}
          </p>
        </div>

        <button
          type="button"
          onClick={
            onCreateCircle
          }
          className="flex shrink-0 items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
        >
          <PlusIcon />
          <span>
            {t.circles.create}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-7 rounded-2xl bg-slate-100 p-1">
        <div className="grid grid-cols-2 gap-1">
          <TabButton
            active={
              activeTab ===
              'created'
            }
            onClick={() =>
              setActiveTab(
                'created',
              )
            }
            label={
              t.circles.created
            }
            count={
              circles.length
            }
          />

          <TabButton
            active={
              activeTab ===
              'joined'
            }
            onClick={() =>
              setActiveTab(
                'joined',
              )
            }
            label={
              t.circles.joined
            }
            count={
              joinedCircles.length
            }
          />
        </div>
      </div>

      {/* Summary */}
      {activeCircles.length >
        0 && (
        <div className="mt-5 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                {activeTab ===
                'created'
                  ? t.circles
                      .createdGoalTarget
                  : t.circles
                      .joinedGoalTarget}
              </p>

              <p className="mt-2 text-2xl font-black tracking-tight">
                {totalTarget.toLocaleString(
                  language,
                )}{' '}
                NIM
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {t.circles.across}{' '}
                {
                  activeCircles.length
                }{' '}
                {activeCircles.length ===
                1
                  ? t.circles.circle
                  : t.circles.circles}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
              <TargetIcon />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t.circles.raised}
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {totalRaised.toLocaleString(
                  language,
                )}{' '}
                NIM
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t.circles.target}
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {totalTarget.toLocaleString(
                  language,
                )}{' '}
                NIM
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Circle list */}
      <div className="mt-6">
        {isLoading ? (
          <LoadingState />
        ) : activeCircles.length ===
          0 ? (
          <EmptyState
            type={activeTab}
            onCreateCircle={
              onCreateCircle
            }
          />
        ) : (
          <div className="space-y-4">
            {activeCircles.map(
              (circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  progress={
                    circleProgress[
                      circle.id
                    ]
                  }
                  onOpen={() =>
                    onOpenCircle(
                      circle.id,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? 'bg-white text-slate-950 shadow-sm'
          : 'text-slate-500'
      }`}
    >
      <span>{label}</span>

      {count > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active
              ? 'bg-slate-100 text-slate-700'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function CircleCard({
  circle,
  progress,
  onOpen,
}: {
  circle: Circle
  progress?: CircleProgress
  onOpen: () => void
}) {
  const {
    language,
    t,
  } = useLanguage()

  const raisedAmount =
    progress?.raisedAmount ??
    0

  const progressPercentage =
    progress?.progressPercentage ??
    0

  const contributorCount =
    progress?.contributorCount ??
    0

  const safeProgress =
    Math.min(
      100,
      Math.max(
        0,
        progressPercentage,
      ),
    )

  const isCompleted =
    circle.status ===
    'completed'

  const isCancelled =
    circle.status ===
    'cancelled'

  const isExpired =
    circle.status ===
    'expired'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition active:scale-[0.99]"
    >
      {/* Card heading */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <GoalIcon />
            </div>

            <h2 className="truncate text-lg font-black text-slate-950">
              {circle.name}
            </h2>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
            {circle.description ||
              t.circles
                .noDescription}
          </p>
        </div>

        <StatusBadge 
          status={circle.status} 
          isCompleted={isCompleted} 
          isCancelled={isCancelled} 
          isExpired={isExpired} 
          t={t.circle} 
        />
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {t.circles.raised}
            </p>

            <p className="mt-1 text-lg font-black text-slate-950">
              {raisedAmount.toLocaleString(
                language,
              )}{' '}
              <span className="text-sm font-bold text-slate-500">
                NIM
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {t.circles.target}
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {circle.targetAmount.toLocaleString(
                language,
              )}{' '}
              NIM
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            {safeProgress.toFixed(
              0,
            )}
            % {t.circles.funded}
          </p>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <PeopleIcon />

            <span>
              {contributorCount}{' '}
              {contributorCount ===
              1
                ? t.circles
                    .contributor
                : t.circles
                    .contributors}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <DetailCard
          icon={<CommitmentIcon />}
          label={
            t.circles
              .creatorCommitment
          }
          value={`${circle.creatorCommitment.toLocaleString(
            language,
          )} NIM`}
        />

        <DetailCard
          icon={<CalendarIcon />}
          label={
            t.circles.deadline
          }
          value={formatDeadline(
            circle.deadline,
            language,
          )}
        />
      </div>

      {/* Goal owner */}
      <div className="mt-4 rounded-2xl bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500">
              <UserIcon />
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {t.circles.goalOwner}
            </p>
          </div>

          <div className="min-w-0 max-w-[65%] text-right">
            <p className="truncate text-xs font-bold text-slate-900">
              {circle.recipientUsername
                ? `@${circle.recipientUsername}`
                : truncateWallet(
                    circle.recipient,
                  )}
            </p>

            <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
              {truncateWallet(
                circle.recipient,
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Open hint */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">
          {t.circles.openCircle}
        </span>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-active:bg-emerald-100 group-active:text-emerald-700">
          <ChevronIcon />
        </div>
      </div>
    </button>
  )
}

function StatusBadge({
  //status,
  isCompleted,
  isCancelled,
  isExpired,
  t,
}: {
  status: Circle['status']
  isCompleted: boolean
  isCancelled: boolean
  isExpired: boolean
  t: ReturnType<
    typeof useLanguage
  >['t']['circle']
}) {
  const label =
    isCompleted
      ? t.completed
      : isCancelled
        ? t.cancelled
        : isExpired
          ? t.expired
          : t.active

  const className =
    isCompleted
      ? 'bg-emerald-100 text-emerald-700'
      : isCancelled
        ? 'bg-slate-100 text-slate-600'
        : isExpired
          ? 'bg-amber-100 text-amber-700'
          : 'bg-lime-100 text-slate-800'

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  )
}

function DetailCard({ 
  icon, 
  label, 
  value, 
}: { 
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}

        <p className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-sm font-black text-slate-900">
        {value}
      </p>
    </div>
  )
}

function LoadingState() {
  const {
    t,
  } = useLanguage()

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <SpinnerIcon />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {t.circles.loading}
      </p>

      <div className="mx-auto mt-4 max-w-xs space-y-2">
        <div className="h-2 rounded-full bg-slate-100" />
        <div className="mx-auto h-2 w-2/3 rounded-full bg-slate-100" />
      </div>
    </div>
  )
}

function EmptyState({
  type,
  onCreateCircle,
}: {
  type:
    | 'created'
    | 'joined'
  onCreateCircle: () => void
}) {
  const {
    t,
  } = useLanguage()

  if (type === 'joined') {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <PeopleIcon />
        </div>

        <h2 className="mt-4 text-lg font-black text-slate-950">
          {
            t.circles
              .noJoinedCircles
          }
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {
            t.circles
              .joinedDescription
          }
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <PlusIcon />
      </div>

      <h2 className="mt-4 text-lg font-black text-slate-950">
        {
          t.circles
            .createFirstCircle
        }
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {
          t.circles
            .createFirstDescription
        }
      </p>

      <button
        type="button"
        onClick={
          onCreateCircle
        }
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
      >
        <PlusIcon />

        {t.circles.createCircle}
      </button>
    </div>
  )
}

function formatDeadline(
  deadline: string,
  language: string,
): string {
  const date =
    new Date(deadline)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return deadline
  }

  return date.toLocaleDateString(
    language,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

function truncateWallet(
  wallet: string,
) {
  if (wallet.length <= 18) {
    return wallet
  }

  return `${wallet.slice(0, 10)}...${wallet.slice(-8)}`
}

function PlusIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CircleStackIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="16"
        cy="16"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m11 11 2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
      />
    </svg>
  )
}

function GoalIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v18M5 7h14M6 7v3a6 6 0 0 0 12 0V7"
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
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 19a6 6 0 0 1 12 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 11a3 3 0 0 0 0-6M18 13a5 5 0 0 1 3 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CommitmentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 7v10M15 9.5c-.7-.7-1.7-1-3-1-1.7 0-3 1-3 2.3 0 1.4 1.2 2 3 2.4 1.8.4 3 1 3 2.4 0 1.4-1.3 2.4-3 2.4-1.3 0-2.3-.4-3-1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 2v4M16 2v4M3 9h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
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
      width="16"
      height="16"
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

function SpinnerIcon() {
  return (
    <svg
      width="20"
      height="20"
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