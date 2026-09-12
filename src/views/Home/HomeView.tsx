import {
  useLanguage,
} from '../../i18n/useLanguage'

import type {
  Circle,
} from '../../types/circle'

import type {
  CircleProgress,
} from '../../hooks/useCircles'

interface HomeViewProps {
  userName: string
  circles: Circle[]
  joinedCircles: Circle[]
  circleProgress: Record<
    string,
    CircleProgress
  >
  onCreateCircle: () => void
  onViewCircles: () => void
  onOpenCircle: (
    circleId: string,
  ) => void
}

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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

function PeopleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 19C3.5 15.96 5.96 13.5 9 13.5C12.04 13.5 14.5 15.96 14.5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 5.5C16.93 5.5 18.5 7.07 18.5 9C18.5 10.93 16.93 12.5 15 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 14C18.6 14.48 20.5 16.5 20.5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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

function EmptyCircleIcon() {
  return (
    <svg
      width="24"
      height="24"
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
      <path
        d="M12 8V16M8 12H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
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
  const {
    t,
  } = useLanguage()

  const allCircles =
    Array.from(
      new Map(
        [
          ...circles,
          ...joinedCircles,
        ].map(
          (circle) => [
            circle.id,
            circle,
          ],
        ),
      ).values(),
    )

  const activeCircles =
    allCircles
      .filter(
        (circle) =>
          circle.status ===
          'active',
      )
      .slice(0, 3)

  const totalRaised =
    activeCircles.reduce(
      (
        total,
        circle,
      ) =>
        total +
        (
          circleProgress[
            circle.id
          ]?.raisedAmount ?? 0
        ),
      0,
    )

  const createdCount =
    circles.filter(
      (circle) =>
        circle.status ===
        'active',
    ).length

  const joinedCount =
    joinedCircles.filter(
      (circle) =>
        circle.status ===
        'active',
    ).length

  return (
    <section className="pb-8">
      {/* Hero */}
      <div className="bg-slate-950 px-4 pb-8 pt-6 text-white">
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            {t.home.welcomeBack}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {userName}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            {t.home.description}
          </p>

          {/* Create CTA */}
          <button
            type="button"
            onClick={
              onCreateCircle
            }
            className="group mt-6 w-full rounded-3xl bg-emerald-500 p-5 text-left text-slate-950 transition hover:bg-emerald-400 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-950/70">
                  {t.home.startAGoal}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {t.home.createCircle}
                </h2>

                <p className="mt-1.5 max-w-xs text-xs leading-5 text-emerald-950/70">
                  {
                    t.home
                      .createCircleDescription
                  }
                </p>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-emerald-300 transition-transform group-active:rotate-12">
                <PlusIcon />
              </span>
            </div>
          </button>
        </div>
      </div>

      <main className="mx-auto w-full max-w-md px-4">
        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={
              onViewCircles
            }
            className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TargetIcon />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              {t.home.yourGoals}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {allCircles.length}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {createdCount}{' '}
              {t.home.created}
              {' · '}
              {joinedCount}{' '}
              {t.home.joined}
            </p>
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <WalletIcon />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              {t.home.totalRaised}
            </p>

            <p className="mt-1 truncate text-2xl font-bold text-slate-900">
              {totalRaised.toLocaleString()}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {
                t.home
                  .nimAcrossActiveGoals
              }
            </p>
          </div>
        </div>

        {/* Active goals */}
        <div className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
                {t.home.activeGoal}
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                {t.home.activeGoals}
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {
                  t.home
                    .activeGoalsDescription
                }
              </p>
            </div>

            {allCircles.length >
              0 && (
              <button
                type="button"
                onClick={
                  onViewCircles
                }
                className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-bold text-slate-600 transition hover:text-slate-950"
              >
                {t.home.viewAll}

                <ArrowRightIcon />
              </button>
            )}
          </div>

          {allCircles.length ===
          0 ? (
            <EmptyHomeState
              onCreateCircle={
                onCreateCircle
              }
            />
          ) : activeCircles.length ===
            0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <TargetIcon />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                {
                  t.home
                    .noActiveGoals
                }
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-500">
                {
                  t.home
                    .noActiveGoalsDescription
                }
              </p>

              <button
                type="button"
                onClick={
                  onCreateCircle
                }
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.97]"
              >
                <PlusIcon />

                {
                  t.home
                    .createCircle
                }
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCircles.map(
                (circle) => (
                  <HomeCircleCard
                    key={
                      circle.id
                    }
                    circle={
                      circle
                    }
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

        {/* View all */}
        {allCircles.length >
          3 && (
          <button
            type="button"
            onClick={
              onViewCircles
            }
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-slate-300 active:scale-[0.98]"
          >
            {t.home.viewAllGoals.replace(
              '{count}',
              String(
                allCircles.length,
              ),
            )}

            <ArrowRightIcon />
          </button>
        )}
      </main>
    </section>
  )
}

function EmptyHomeState({
  onCreateCircle,
}: {
  onCreateCircle: () => void
}) {
  const {
    t,
  } = useLanguage()

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <EmptyCircleIcon />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900">
        {
          t.home
            .yourFirstCircle
        }
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-500">
        {
          t.home
            .yourFirstCircleDescription
        }
      </p>

      <button
        type="button"
        onClick={
          onCreateCircle
        }
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.97]"
      >
        <PlusIcon />

        {
          t.home
            .createCircle
        }
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
  const {
    t,
  } = useLanguage()

  const raisedAmount =
    progress?.raisedAmount ??
    0

  const remainingAmount =
    progress?.remainingAmount ??
    Math.max(
      circle.targetAmount -
        raisedAmount,
      0,
    )

  const progressPercentage =
    Math.min(
      Math.max(
        progress?.progressPercentage ??
          0,
        0,
      ),
      100,
    )

  const contributorCount =
    progress?.contributorCount ??
    0

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md active:scale-[0.99]"
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TargetIcon />
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-600">
              {t.home.activeGoal}
            </span>
          </div>

          <h3 className="mt-3 truncate text-base font-bold text-slate-900">
            {circle.name}
          </h3>

          <p className="mt-1 truncate text-sm text-slate-500">
            {circle.description ||
              t.home
                .sharedNimSavingsGoal}
          </p>
        </div>

        <span className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
          {circle.targetAmount.toLocaleString()}{' '}
          NIM
        </span>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            {Math.round(
              progressPercentage,
            )}
            %
          </span>

          <span className="text-slate-400">
            {raisedAmount.toLocaleString()}{' '}
            /{' '}
            {circle.targetAmount.toLocaleString()}{' '}
            NIM
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {t.home.nimRaised}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {raisedAmount.toLocaleString()}{' '}
            NIM
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {t.home.nimToGo}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {remainingAmount.toLocaleString()}{' '}
            NIM
          </p>
        </div>
      </div>

      {/* Contributors */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <PeopleIcon />

          <span>
            {contributorCount}{' '}
            {contributorCount === 1
              ? t.home.contributor
              : t.home.contributors}
          </span>
        </div>

        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 transition group-hover:text-emerald-600">
          <span>{t.home.viewAll}</span>
          <ArrowRightIcon />
        </span>
      </div>
    </button>
  )
}