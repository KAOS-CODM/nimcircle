import { useEffect, useState } from 'react'
import {
  addCircle,
  loadCircles,
  saveCircles,
} from './lib/storage'
import { getNimiq } from './lib/nimiq'
import { useWallet } from './hooks/useWallet'
import type { Circle } from './types/circle'

type Screen = 'home' | 'create' | 'circle'

function createCircleId() {
  return `circle_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [circles, setCircles] = useState<Circle[]>([])
  const [activeCircleId, setActiveCircleId] = useState<
    string | null
  >(null)

  const {
    address,
    loading: walletLoading,
    error: walletError,
  } = useWallet()

  const [providerReady, setProviderReady] = useState(false)
  const [consensus, setConsensus] = useState<boolean | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkProvider() {
      try {
        const nimiq = await getNimiq()

        const isConsensusEstablished =
          await nimiq.isConsensusEstablished()

        if (cancelled) return

        setConsensus(isConsensusEstablished)
        setProviderReady(true)
      } catch (err) {
        if (cancelled) return

        setError(
          err instanceof Error
            ? err.message
            : String(err),
        )
      }
    }

    void checkProvider()

    return () => {
      cancelled = true
    }
  }, [])

  const connectionError = error || walletError

  useEffect(() => {
    if (!address) {
      setCircles([])
      setActiveCircleId(null)
      return
    }

    const storedCircles = loadCircles(address)

    setCircles(storedCircles)

    if (storedCircles.length > 0) {
      setActiveCircleId(storedCircles[0].id)
    } else {
      setActiveCircleId(null)
    }
  }, [address])

  useEffect(() => {
    if (!address) {
      return
    }

    saveCircles(address, circles)
  }, [address, circles])

  function handleCircleCreated(newCircle: Circle) {
    if (!address) {
      return
    }

    addCircle(address, newCircle)

    setCircles((current) => [
      ...current,
      newCircle,
    ])

    setActiveCircleId(newCircle.id)
    setScreen('circle')
  }

  function handleOpenCircle(circleId: string) {
    setActiveCircleId(circleId)
    setScreen('circle')
  }

  const activeCircle =
    circles.find(
      (circle) => circle.id === activeCircleId,
    ) ?? null

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#162018]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f7f8f5]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-5">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c7f36b] font-bold text-[#162018]">
              N
            </div>

            <span className="text-lg font-bold tracking-tight">
              NimCircle
            </span>
          </button>

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              providerReady && address
                ? 'bg-[#e5f7d0] text-[#38611d]'
                : 'bg-black/5 text-black/50'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                providerReady && address
                  ? 'bg-[#65a936]'
                  : 'bg-black/30'
              }`}
            />

            {walletLoading
              ? 'Connecting'
              : address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : providerReady
                  ? 'Connected'
                  : 'Connecting'}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 pb-10">
        {screen === 'home' && (
          <HomeScreen
            address={address}
            circles={circles}
            onCreate={() => setScreen('create')}
            onOpenCircle={handleOpenCircle}
          />
        )}

        {screen === 'create' && (
          <CreateScreen
            address={address}
            onBack={() => setScreen('home')}
            onCreated={handleCircleCreated}
          />
        )}

        {screen === 'circle' && activeCircle && (
          <CircleScreen
            circle={activeCircle}
            address={address}
            onBack={() => setScreen('home')}
          />
        )}

        {connectionError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              Nimiq Pay connection unavailable
            </p>

            <p className="mt-1 wrap-break-word opacity-80">
              {connectionError}
            </p>
          </div>
        )}

        {consensus === false && (
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            Nimiq is still synchronizing. Payments will
            become available once consensus is established.
          </div>
        )}
      </main>
    </div>
  )
}

function HomeScreen({
  address,
  circles,
  onCreate,
  onOpenCircle,
}: {
  address: string | null
  circles: Circle[]
  onCreate: () => void
  onOpenCircle: (circleId: string) => void
}) {
  return (
    <section className="pt-10">
      <div className="overflow-hidden rounded-4xl bg-[#162018] p-7 text-white shadow-xl">
        <div className="mb-10 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
            Shared goals
          </span>

          <span className="text-2xl">◎</span>
        </div>

        <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">
          Build something together.
        </h1>

        <p className="mt-4 max-w-sm text-base leading-7 text-white/65">
          Create a shared goal and let everyone contribute
          NIM until you reach it.
        </p>

        <button
          onClick={onCreate}
          disabled={!address}
          className="mt-8 min-h-12 w-full rounded-2xl bg-[#c7f36b] px-5 font-bold text-[#162018] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create a Circle
        </button>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Your circles
          </h2>

          {circles.length > 0 && (
            <span className="text-sm text-black/40">
              {circles.length}{' '}
              {circles.length === 1
                ? 'circle'
                : 'circles'}
            </span>
          )}
        </div>

        {circles.length > 0 ? (
          <div className="space-y-3">
            {circles.map((circle) => (
              <button
                key={circle.id}
                onClick={() =>
                  onOpenCircle(circle.id)
                }
                className="w-full rounded-3xl border border-black/5 bg-white p-5 text-left shadow-sm transition-transform active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="rounded-full bg-[#e5f7d0] px-2.5 py-1 text-xs font-semibold text-[#38611d]">
                      Active goal
                    </span>

                    <h3 className="mt-4 text-lg font-bold">
                      {circle.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-black/45">
                      {circle.description ||
                        'No description provided.'}
                    </p>
                  </div>

                  <span className="text-lg text-black/30">
                    →
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                  <span className="text-sm font-semibold">
                    0 NIM raised
                  </span>

                  <span className="text-sm text-black/40">
                    of {circle.targetAmount} NIM
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white/50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-xl">
              ◎
            </div>

            <h3 className="mt-4 font-semibold">
              No circles yet
            </h3>

            <p className="mt-1 text-sm leading-6 text-black/45">
              Create your first shared goal and invite your
              friends to contribute.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function CreateScreen({
  address,
  onBack,
  onCreated,
}: {
  address: string | null
  onBack: () => void
  onCreated: (circle: Circle) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [formError, setFormError] = useState<string | null>(
    null,
  )

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setFormError(null)

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    const target = Number(targetAmount)

    if (!address) {
      setFormError(
        'Your NIM wallet is not connected yet.',
      )
      return
    }

    if (!trimmedName) {
      setFormError('Give your Circle a name.')
      return
    }

    if (trimmedName.length > 80) {
      setFormError(
        'Circle names must be 80 characters or less.',
      )
      return
    }

    if (!Number.isFinite(target) || target <= 0) {
      setFormError(
        'Enter a target amount greater than 0 NIM.',
      )
      return
    }

    if (target > 21_000_000_000) {
      setFormError(
        'That target amount is too large.',
      )
      return
    }

    if (!deadline) {
      setFormError('Choose a deadline.')
      return
    }

    const deadlineDate = new Date(
      `${deadline}T23:59:59`,
    )
    const now = new Date()

    if (
      Number.isNaN(deadlineDate.getTime()) ||
      deadlineDate <= now
    ) {
      setFormError(
        'The deadline must be a future date.',
      )
      return
    }

    const newCircle: Circle = {
      id: createCircleId(),
      name: trimmedName,
      description: trimmedDescription,
      targetAmount: target,
      deadline,
      recipient: address,
      creator: address,
      createdAt: new Date().toISOString(),
    }

    onCreated(newCircle)
  }

  return (
    <section className="pt-7">
      <button
        onClick={onBack}
        className="mb-7 min-h-11 text-sm font-medium text-black/50"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold tracking-tight">
        Create a Circle
      </h1>

      <p className="mt-2 text-sm leading-6 text-black/50">
        Set a goal, choose the target, and invite people
        to help you reach it.
      </p>

      {address && (
        <div className="mt-6 rounded-2xl bg-[#e5f7d0] px-4 py-3 text-sm text-[#38611d]">
          <p className="font-semibold">
            Circle recipient
          </p>

          <p className="mt-1 break-all font-mono text-xs opacity-80">
            {address}
          </p>
        </div>
      )}

      {formError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Goal name
          </span>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. Beach trip"
            maxLength={80}
            className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-[#7fae38] focus:ring-4 focus:ring-[#c7f36b]/30"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Description
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="What are you saving for?"
            rows={3}
            maxLength={300}
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-[#7fae38] focus:ring-4 focus:ring-[#c7f36b]/30"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Target amount
          </span>

          <div className="relative">
            <input
              type="number"
              min="1"
              step="0.00001"
              value={targetAmount}
              onChange={(event) =>
                setTargetAmount(event.target.value)
              }
              placeholder="500"
              className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 pr-16 outline-none transition focus:border-[#7fae38] focus:ring-4 focus:ring-[#c7f36b]/30"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black/40">
              NIM
            </span>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Deadline
          </span>

          <input
            type="date"
            value={deadline}
            min={
              new Date()
                .toISOString()
                .split('T')[0]
            }
            onChange={(event) =>
              setDeadline(event.target.value)
            }
            className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-[#7fae38] focus:ring-4 focus:ring-[#c7f36b]/30"
          />
        </label>

        <button
          type="submit"
          disabled={!address}
          className="min-h-12 w-full rounded-2xl bg-[#162018] px-5 font-bold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Circle
        </button>
      </form>
    </section>
  )
}

function CircleScreen({
  circle,
  address,
  onBack,
}: {
  circle: Circle
  address: string | null
  onBack: () => void
}) {
  const target = circle.targetAmount

  return (
    <section className="pt-7">
      <button
        onClick={onBack}
        className="mb-7 min-h-11 text-sm font-medium text-black/50"
      >
        ← Back
      </button>

      <div className="rounded-4xl bg-white p-6 shadow-sm">
        <span className="rounded-full bg-[#e5f7d0] px-3 py-1.5 text-xs font-semibold text-[#38611d]">
          Active goal
        </span>

        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          {circle.name}
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/50">
          {circle.description ||
            'Saving together toward a shared goal.'}
        </p>

        <div className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">
                0 NIM
              </p>

              <p className="mt-1 text-sm text-black/40">
                raised
              </p>
            </div>

            <p className="text-sm font-semibold text-black/50">
              of {target} NIM
            </p>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full rounded-full bg-[#c7f36b]"
              style={{ width: '0%' }}
            />
          </div>

          <p className="mt-3 text-right text-xs font-medium text-black/40">
            0% funded
          </p>
        </div>

        <button
          className="mt-8 min-h-12 w-full rounded-2xl bg-[#c7f36b] font-bold text-[#162018]"
        >
          Contribute NIM
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-black/5 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">
            Contributors
          </h2>

          <span className="text-sm text-black/40">
            0 people
          </span>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] p-3">
            <span className="text-black/50">
              Deadline
            </span>

            <span className="font-semibold">
              {new Date(
                `${circle.deadline}T00:00:00`,
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] p-3">
            <span className="text-black/50">
              Recipient
            </span>

            <span className="max-w-[180px] truncate font-mono text-xs font-semibold">
              {circle.recipient}
            </span>
          </div>
        </div>

        {address && (
          <p className="mt-5 text-xs text-black/35">
            Your wallet:{' '}
            <span className="font-mono">
              {address.slice(0, 8)}...{address.slice(-6)}
            </span>
          </p>
        )}
      </div>
    </section>
  )
}

export default App