import {
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

// Diagnostics temporarily disabled.
// import { testNimiqProvider } from './lib/nimiqDiagnostics'

import AppHeader from './components/AppHeader'
import BottomNavigation from './components/BottomNavigation'
import type { NavigationTab } from './components/BottomNavigation'
import ProfileSetup from './components/ProfileSetup'
import WelcomeBackModal from './components/WelcomeBackModal'
import ConnectWalletView from './views/Wallet/ConnectWalletView'
import WalletRestoringView from './views/Wallet/WalletRestoringView'
import HomeView from './views/Home/HomeView'
import CreateCircleView from './views/CreateCircle/CreateCircleView'
import CircleView from './views/Circle/CircleView'
import CirclesView from './views/Circles/CirclesView'
import ProfileView from './views/Profile/ProfileView'
import { useWallet } from './hooks/useWallet'
import {
  getSession,
  saveSession,
} from './lib/userStorage'
import {
  apiCreateCircle,
  apiCreateUser,
  apiGetCircle,
  apiGetUser,
  apiGetCreatedCircles,
} from './lib/api'
import type { Circle } from './types/circle'
import type { User } from './types/user'

type Screen =
  | NavigationTab
  | 'circle'

interface ConnectedAppProps {
  address: string
  user: User
}

function normalizeWalletAddress(
  address: string,
): string {
  return address
    .trim()
    .replace(/\s+/g, '')
}

/* -------------------------------------------------------------------------- */
/* Profile Gate                                                               */
/* -------------------------------------------------------------------------- */

function ProfileGate({
  address,
  children,
}: {
  address: string
  children: (user: User) => ReactNode
}) {
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [showWelcome, setShowWelcome] =
    useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      setLoading(true)
      setError(null)

      try {
        /*
         * The backend is the source of truth.
         *
         * We use the connected Nimiq wallet address
         * to determine whether this wallet already
         * has a NimCircle profile.
         */
        const existingUser =
          await apiGetUser(address)

        if (cancelled) {
          return
        }

        setUser(existingUser)

        /*
         * Keep a local session so we can identify
         * returning users in the UI.
         */
        const previousSession =
          getSession()

        const hasMatchingSession =
          Boolean(previousSession) &&
          previousSession?.walletAddress.toLowerCase() ===
            address.toLowerCase()

        saveSession(existingUser)

        setShowWelcome(
          hasMatchingSession,
        )
      } catch (requestError) {
        if (cancelled) {
          return
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : String(requestError)

        /*
         * A 404 means this wallet does not
         * have a NimCircle profile yet.
         *
         * That is an expected onboarding state,
         * not an application error.
         */
        if (
          message === 'User not found'
        ) {
          setUser(null)
          setShowWelcome(false)
          setError(null)
        } else {
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadUser()

    return () => {
      cancelled = true
    }
  }, [address])

  async function handleProfileComplete(
    data: {
      username: string
      displayName: string
    },
  ) {
    setError(null)
    setLoading(true)

    try {
      /*
       * The username and display name are now
       * explicitly provided by the user.
       */
      const newUser =
        await apiCreateUser({
          walletAddress:
            normalizeWalletAddress(
              address,
            ),
          username:
            data.username.trim(),
          displayName:
            data.displayName.trim(),
        })

      saveSession(newUser)
      setUser(newUser)
      setShowWelcome(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : String(requestError)

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <WalletRestoringView />
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#162018]">
            Unable to load your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.reload()
            }}
            className="mt-6 rounded-2xl bg-[#162018] px-5 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <ProfileSetup
        walletAddress={address}
        onComplete={
          handleProfileComplete
        }
      />
    )
  }

  return (
    <>
      {children(user)}

      {showWelcome && (
        <WelcomeBackModal
          user={user}
          onContinue={() =>
            setShowWelcome(false)
          }
        />
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Connected App                                                              */
/* -------------------------------------------------------------------------- */

function ConnectedApp({
  address,
  user,
}: ConnectedAppProps) {
  /*
   * Check whether the app was opened through
   * a shared Circle URL.
   *
   * Example:
   *
   * /circle/circle_123456
   */
  function getCircleIdFromUrl(): string | null {
    const match =
      window.location.pathname.match(
        /^\/circle\/([^/]+)\/?$/,
      )

    if (!match) {
      return null
    }

    return decodeURIComponent(
      match[1],
    )
  }

  const sharedCircleId =
    getCircleIdFromUrl()

  const [screen, setScreen] =
    useState<Screen>(
      sharedCircleId
        ? 'circle'
        : 'home',
    )

  const [
    activeCircleId,
    setActiveCircleId,
  ] = useState<string | null>(
    sharedCircleId,
  )

  /*
   * Circles are loaded from the backend
   * instead of being persisted as the primary
   * source of truth in localStorage.
   */
  const [circles, setCircles] =
    useState<Circle[]>([])

  const [loadingCircles, setLoadingCircles] =
    useState(true)

  const [circleError, setCircleError] =
    useState<string | null>(null)

  const [creatingCircle, setCreatingCircle] =
    useState(false)

  const [
    loadingSharedCircle,
    setLoadingSharedCircle,
  ] = useState(
    Boolean(sharedCircleId),
  )

  /* ------------------------------------------------------------------------ */
  /* Nimiq Provider Diagnostics                                               */
  /* ------------------------------------------------------------------------ */

  /*
   * Diagnostics are temporarily disabled.
   *
   * The provider/payment flow has already been
   * verified, so the diagnostic UI is being kept
   * here for possible future debugging without
   * being part of the normal application flow.
   */

  /*
  const [
    showDiagnostics,
    setShowDiagnostics,
  ] = useState(false)

  const [
    diagnosticResult,
    setDiagnosticResult,
  ] = useState<
    Awaited<
      ReturnType<typeof testNimiqProvider>
    > | null
  >(null)

  const [
    diagnosticLoading,
    setDiagnosticLoading,
  ] = useState(false)

  async function runDiagnostics() {
    setDiagnosticLoading(true)
    setDiagnosticResult(null)
    setShowDiagnostics(true)

    try {
      const result =
        await testNimiqProvider()

      setDiagnosticResult(result)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error)

      setDiagnosticResult({
        success: false,
        message:
          'Unexpected diagnostic error.',
        details: {
          providerType: 'Unknown',
          providerKeys: [],
          prototypeKeys: [],
          methods: {},
          consensusEstablished:
            undefined,
          adapterType: 'Unknown',
          adapterKeys: [],
          adapterPrototypeKeys: [],
          adapterStrategy: 'Unknown',
          adapterHandlerType: 'Unknown',
          adapterHandlerKeys: [],
          adapterCallbackType: 'Unknown',
          adapterCallbackKeys: [],
          callbackMapSize: null,
          callbackMapKeys: [],
          handlerSource: '',
          adapterRequestSource: '',
          directRequestTest: {
            attempted: false,
            method: 'getBlockNumber',
            success: false,
            result: '',
          },
          directTransactionTest: {
            attempted: false,
            method: 'sendBasicTransaction',
            success: false,
            result: '',
            error: message,
          },
          error: message,
        },
      })
    } finally {
      setDiagnosticLoading(false)
    }
  }

  function renderDiagnosticScreen() {
    if (diagnosticLoading) {
      return (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ed]">
              <span className="text-xl">
                🔎
              </span>
            </div>

            <h1 className="mt-4 text-lg font-semibold text-[#162018]">
              Inspecting Nimiq provider
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#607060]">
              Reading the provider exposed by
              Nimiq Pay.
            </p>

            <p className="mt-4 text-xs text-[#8a948a]">
              No payment is being sent.
            </p>
          </div>
        </div>
      )
    }

    if (!diagnosticResult) {
      return null
    }

    const {
      success,
      message,
      details,
    } = diagnosticResult

    return (
      <div className="space-y-4 pb-8">
        <button
          type="button"
          onClick={() => {
            setShowDiagnostics(false)
            setDiagnosticResult(null)
          }}
          className="flex items-center gap-2 py-2 text-sm font-semibold text-[#162018]"
        >
          <span>←</span>
          Back
        </button>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                success
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <span>
                {success ? '✓' : '×'}
              </span>
            </div>

            <div>
              <h1 className="text-lg font-semibold text-[#162018]">
                Nimiq Provider Diagnostic
              </h1>

              <p className="mt-1 text-sm leading-5 text-[#607060]">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Provider
          </h2>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Constructor
              </p>

              <p className="mt-1 break-all rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#162018]">
                {details.providerType}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Consensus
              </p>

              <p
                className={`mt-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                  details.consensusEstablished
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {details.consensusEstablished ===
                undefined
                  ? 'Not checked'
                  : details.consensusEstablished
                    ? 'Established'
                    : 'Not established'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Transaction methods
          </h2>

          <div className="mt-4 space-y-2">
            {Object.entries(
              details.methods,
            ).map(([method, type]) => (
              <div
                key={method}
                className="flex items-center justify-between gap-4 rounded-xl bg-[#f7f8f5] px-3 py-3"
              >
                <span className="break-all font-mono text-xs text-[#162018]">
                  {method}
                </span>

                <span
                  className={`shrink-0 text-xs font-semibold ${
                    type === 'function'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Provider keys
          </h2>

          {details.providerKeys.length === 0 ? (
            <p className="mt-3 text-sm text-[#607060]">
              No enumerable properties.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {details.providerKeys.map(
                (key) => (
                  <span
                    key={key}
                    className="rounded-lg bg-[#f7f8f5] px-2.5 py-1.5 font-mono text-xs text-[#162018]"
                  >
                    {key}
                  </span>
                ),
              )}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Prototype methods
          </h2>

          {details.prototypeKeys.length === 0 ? (
            <p className="mt-3 text-sm text-[#607060]">
              No prototype methods found.
            </p>
          ) : (
            <div className="mt-3 space-y-1.5">
              {details.prototypeKeys.map(
                (key) => (
                  <div
                    key={key}
                    className="rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-xs text-[#162018]"
                  >
                    {key}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Adapter
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Constructor
              </p>

              <p className="mt-1 break-all rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#162018]">
                {details.adapterType}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Strategy
              </p>

              <p className="mt-1 break-all rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#162018]">
                {details.adapterStrategy}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Handler type
              </p>

              <p className="mt-1 break-all rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#162018]">
                {details.adapterHandlerType}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Handler keys
              </p>

              {details.adapterHandlerKeys.length === 0 ? (
                <p className="mt-1 rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#8a948a]">
                  None
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {details.adapterHandlerKeys.map(
                    (key) => (
                      <span
                        key={key}
                        className="rounded-lg bg-[#f7f8f5] px-2.5 py-1.5 font-mono text-xs text-[#162018]"
                      >
                        {key}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Callback type
              </p>

              <p className="mt-1 break-all rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#162018]">
                {details.adapterCallbackType}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Callback keys
              </p>

              {details.adapterCallbackKeys.length === 0 ? (
                <p className="mt-1 rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#8a948a]">
                  None
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {details.adapterCallbackKeys.map(
                    (key) => (
                      <span
                        key={key}
                        className="rounded-lg bg-[#f7f8f5] px-2.5 py-1.5 font-mono text-xs text-[#162018]"
                      >
                        {key}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Callback map size
              </p>

              <p className="mt-1 rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#162018]">
                {details.callbackMapSize === null
                  ? 'Not a Map'
                  : String(
                      details.callbackMapSize,
                    )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#8a948a]">
                Callback map keys
              </p>

              {details.callbackMapKeys.length === 0 ? (
                <p className="mt-1 rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-sm text-[#8a948a]">
                  None
                </p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {details.callbackMapKeys.map(
                    (key) => (
                      <div
                        key={key}
                        className="rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-xs text-[#162018]"
                      >
                        {key}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Callback handler
          </h2>

          <p className="mt-3 text-xs leading-5 text-[#8a948a]">
            Read-only inspection of the callback
            bridge. The function is not executed.
          </p>

          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#f7f8f5] p-3 font-mono text-xs leading-5 text-[#162018]">
            {details.handlerSource ||
              'No callback handler source available.'}
          </pre>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Adapter request
          </h2>

          <p className="mt-3 text-xs leading-5 text-[#8a948a]">
            Read-only inspection of the adapter
            request function. The function is not
            executed.
          </p>

          <pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#f7f8f5] p-3 font-mono text-xs leading-5 text-[#162018]">
            {details.adapterRequestSource ||
              'No adapter request function source available.'}
          </pre>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Adapter keys
          </h2>

          {details.adapterKeys.length === 0 ? (
            <p className="mt-3 text-sm text-[#607060]">
              No enumerable properties.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {details.adapterKeys.map(
                (key) => (
                  <span
                    key={key}
                    className="rounded-lg bg-[#f7f8f5] px-2.5 py-1.5 font-mono text-xs text-[#162018]"
                  >
                    {key}
                  </span>
                ),
              )}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#162018]">
            Adapter prototype methods
          </h2>

          {details.adapterPrototypeKeys.length === 0 ? (
            <p className="mt-3 text-sm text-[#607060]">
              No adapter prototype methods found.
            </p>
          ) : (
            <div className="mt-3 space-y-1.5">
              {details.adapterPrototypeKeys.map(
                (key) => (
                  <div
                    key={key}
                    className="rounded-xl bg-[#f7f8f5] px-3 py-2 font-mono text-xs text-[#162018]"
                  >
                    {key}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {details.error && (
          <div className="rounded-3xl bg-red-50 p-5">
            <h2 className="text-sm font-semibold text-red-800">
              Diagnostic error
            </h2>

            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-white/70 p-3 font-mono text-xs leading-5 text-red-900">
              {details.error}
            </pre>
          </div>
        )}
      </div>
    )
  }
  */

  /* ------------------------------------------------------------------------ */
  /* Load User Circles                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false

    async function loadUserCircles() {
      setLoadingCircles(true)
      setCircleError(null)

      try {
        const loadedCircles =
          await apiGetCreatedCircles(
            address,
          )

        if (cancelled) {
          return
        }

        setCircles(
          loadedCircles,
        )
      } catch (requestError) {
        if (cancelled) {
          return
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : String(requestError)

        setCircleError(message)
      } finally {
        if (!cancelled) {
          setLoadingCircles(false)
        }
      }
    }

    void loadUserCircles()

    return () => {
      cancelled = true
    }
  }, [address])

  /* ------------------------------------------------------------------------ */
  /* Load Shared Circle                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!sharedCircleId) {
      return
    }

    const circleId =
      sharedCircleId

    let cancelled = false

    async function loadSharedCircle() {
      setLoadingSharedCircle(true)
      setCircleError(null)

      try {
        const response =
          await apiGetCircle(
            circleId,
          )

        if (cancelled) {
          return
        }

        const sharedCircle =
          response.circle

        /*
         * Add the shared Circle to local state.
         *
         * The duplicate check prevents the Circle
         * from being inserted twice if it already
         * exists in the creator's loaded circles.
         */
        setCircles(
          (current) => {
            const alreadyLoaded =
              current.some(
                (circle) =>
                  circle.id ===
                  sharedCircle.id,
              )

            if (alreadyLoaded) {
              return current
            }

            return [
              ...current,
              sharedCircle,
            ]
          },
        )

        setActiveCircleId(
          sharedCircle.id,
        )

        setScreen('circle')
      } catch (requestError) {
        if (cancelled) {
          return
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : String(requestError)

        setCircleError(
          `Unable to load this Circle. ${message}`,
        )

        setActiveCircleId(null)
        setScreen('home')
      } finally {
        if (!cancelled) {
          setLoadingSharedCircle(false)
        }
      }
    }

    void loadSharedCircle()

    return () => {
      cancelled = true
    }
  }, [sharedCircleId])

  /* ------------------------------------------------------------------------ */
  /* Create Circle                                                            */
  /* ------------------------------------------------------------------------ */

  async function createCircle(data: {
    name: string
    description: string
    targetAmount: number
    deadline: string
    goalOwnerWallet: string
    goalOwnerUserId?: string | null
    creatorCommitment: number
  }) {
    setCreatingCircle(true)

    try {
      const normalizedCreatorWallet =
        normalizeWalletAddress(
          address,
        )

      const normalizedGoalOwnerWallet =
        normalizeWalletAddress(
          data.goalOwnerWallet,
        )

      /*
       * If the creator is also the goal owner,
       * explicitly associate the Circle with the
       * creator's existing NimCircle user record.
       *
       * For another person's wallet, we leave
       * goalOwnerUserId null unless the caller
       * explicitly supplied one.
       */
      const isPersonalGoal =
        normalizedCreatorWallet.toLowerCase() ===
        normalizedGoalOwnerWallet.toLowerCase()

      const goalOwnerUserId =
        isPersonalGoal
          ? user.id
          : data.goalOwnerUserId ?? null

      const createdCircle =
        await apiCreateCircle({
          name: data.name,
          description:
            data.description,
          targetAmount:
            data.targetAmount,
          deadline:
            data.deadline,
          creatorWallet:
            normalizedCreatorWallet,
          creatorUserId:
            user.id,
          goalOwnerWallet:
            normalizedGoalOwnerWallet,
          goalOwnerUserId,
          creatorCommitment:
            data.creatorCommitment,
        })

      setCircles((current) => [
        createdCircle,
        ...current,
      ])

      setActiveCircleId(
        createdCircle.id,
      )

      setScreen('circle')

      /*
       * Keep the browser URL synchronized
       * with the newly created Circle.
       */
      const shareUrl =
        `/circle/${encodeURIComponent(
          createdCircle.id,
        )}`

      if (
        window.location.pathname !==
        shareUrl
      ) {
        window.history.pushState(
          {
            circleId:
              createdCircle.id,
          },
          '',
          shareUrl,
        )
      }
    } finally {
      setCreatingCircle(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  function openCircle(
    circleId: string,
  ) {
    setActiveCircleId(
      circleId,
    )

    setScreen('circle')

    /*
     * Keep the browser URL synchronized
     * with the Circle currently being viewed.
     */
    const shareUrl =
      `/circle/${encodeURIComponent(
        circleId,
      )}`

    if (
      window.location.pathname !==
      shareUrl
    ) {
      window.history.pushState(
        {
          circleId,
        },
        '',
        shareUrl,
      )
    }
  }

  function goHome() {
    setActiveCircleId(null)
    setScreen('home')

    /*
     * Return to the Mini App's base URL
     * when leaving a Circle.
     */
    if (
      window.location.pathname !==
      '/'
    ) {
      window.history.pushState(
        {},
        '',
        '/',
      )
    }
  }

  function navigateTo(
    tab: NavigationTab,
  ) {
    setActiveCircleId(null)
    setScreen(tab)

    /*
     * Navigation tabs represent the main
     * Mini App, so remove any Circle path.
     */
    if (
      window.location.pathname !==
      '/'
    ) {
      window.history.pushState(
        {},
        '',
        '/',
      )
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Active Circle                                                            */
  /* ------------------------------------------------------------------------ */

  const activeCircle =
    circles.find(
      (circle) =>
        circle.id ===
        activeCircleId,
    ) ?? null

  const isCircleView =
    screen === 'circle'

  /* ------------------------------------------------------------------------ */
  /* Screen Rendering                                                         */
  /* ------------------------------------------------------------------------ */

  function renderScreen() {
    /*
     * Diagnostics temporarily disabled.
     *
     * if (showDiagnostics) {
     *   return renderDiagnosticScreen()
     * }
     */

    /*
     * A shared Circle is still being fetched.
     */
    if (
      isCircleView &&
      loadingSharedCircle &&
      !activeCircle
    ) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#162018]">
              Loading Circle...
            </p>

            <p className="mt-2 text-xs text-[#607060]">
              Getting the shared goal details.
            </p>
          </div>
        </div>
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Home                                                                   */
    /* ---------------------------------------------------------------------- */

    if (screen === 'home') {
      return (
        <>
          {circleError && (
            <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {circleError}
            </div>
          )}

          {loadingCircles ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
              Loading your circles...
            </div>
          ) : (
            <HomeView
              userName={
                user.displayName
              }
              circles={
                circles
              }
              onCreateCircle={() =>
                setScreen('create')
              }
              onViewCircles={() =>
                navigateTo(
                  'circles',
                )
              }
              onOpenCircle={
                openCircle
              }
            />
          )}
        </>
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Create Circle                                                          */
    /* ---------------------------------------------------------------------- */

    if (screen === 'create') {
      return (
        <CreateCircleView
          creatorWallet={
            address
          }
          onBack={goHome}
          onCreate={
            createCircle
          }
          loading={
            creatingCircle
          }
        />
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Circles                                                                */
    /* ---------------------------------------------------------------------- */

    if (screen === 'circles') {
      return (
        <>
          {circleError && (
            <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {circleError}
            </div>
          )}

          <CirclesView
            circles={
              circles
            }
            onCreateCircle={() =>
              setScreen(
                'create',
              )
            }
            onOpenCircle={
              openCircle
            }
          />
        </>
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Profile                                                                */
    /* ---------------------------------------------------------------------- */

    if (screen === 'profile') {
      return (
        <ProfileView
          user={user}
        />
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Circle                                                                 */
    /* ---------------------------------------------------------------------- */

    if (activeCircle) {
      return (
        <CircleView
          circle={
            activeCircle
          }
          currentAddress={
            address
          }
          currentUserId={
            user.id
          }
          onBack={goHome}
        />
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Fallback Home                                                          */
    /* ---------------------------------------------------------------------- */

    return (
      <HomeView
        userName={
          user.displayName
        }
        circles={
          circles
        }
        onCreateCircle={() =>
          setScreen(
            'create',
          )
        }
        onViewCircles={() =>
          navigateTo(
            'circles',
          )
        }
        onOpenCircle={
          openCircle
        }
      />
    )
  }

  /* ------------------------------------------------------------------------ */
  /* Connected App Layout                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#162018]">
      <AppHeader
        address={
          address
        }
        onHome={
          goHome
        }
      />

      <main
        className={
          isCircleView
            ? 'mx-auto w-full max-w-xl px-5 pb-8'
            : 'mx-auto w-full max-w-xl px-5 pb-32'
        }
      >
        {renderScreen()}
      </main>

      {!isCircleView && (
        <BottomNavigation
          activeTab={
            screen
          }
          onNavigate={
            navigateTo
          }
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  const wallet =
    useWallet()

  if (wallet.loading) {
    return (
      <WalletRestoringView />
    )
  }

  if (!wallet.address) {
    return (
      <ConnectWalletView
        onConnect={
          wallet.connectWallet
        }
        loading={
          wallet.loading
        }
        error={
          wallet.error
        }
        providerReady={
          wallet.debug
            .providerInitialized
        }
      />
    )
  }

  return (
    <ProfileGate
      key={
        wallet.address
      }
      address={
        wallet.address
      }
    >
      {(user) => (
        <ConnectedApp
          address={
            wallet.address!
          }
          user={
            user
          }
        />
      )}
    </ProfileGate>
  )
}