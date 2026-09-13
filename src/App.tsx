import {
  useEffect,
  useState,
} from 'react'

import type { ReactNode } from 'react'

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
import { useCircles } from './hooks/useCircles'

import {
  saveSession,
} from './lib/userStorage'

import {
  ApiRequestError,
  apiCreateUser,
  apiGetUser,
} from './lib/api'

import type { User } from './types/user'

import {
  LanguageProvider,
} from './i18n/LanguageProvider'

import {
  useLanguage,
} from './i18n/useLanguage'

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
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M12 8v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 16h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M10.3 3.9 2.7 17.2A1.8 1.8 0 0 0 4.25 20h15.5a1.8 1.8 0 0 0 1.55-2.8L13.7 3.9a1.96 1.96 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Localized API errors                                                       */
/* -------------------------------------------------------------------------- */

function getLocalizedApiError(
  error: unknown,
  t: ReturnType<typeof useLanguage>['t'],
): string {
  if (
    !(error instanceof ApiRequestError)
  ) {
    return error instanceof Error
      ? error.message
      : String(error)
  }

  switch (error.code) {
    case 'NETWORK_ERROR':
      return t.app.errors.network

    case 'INVALID_RESPONSE':
      return t.app.errors.invalidResponse

    /* ------------------------------ Users -------------------------------- */

    case 'WALLET_USERNAME_REQUIRED':
      return t.app.errors.walletUsernameRequired

    case 'USERNAME_LENGTH':
      return t.app.errors.usernameLength

    case 'USERNAME_FORMAT':
      return t.app.errors.usernameFormat

    case 'DISPLAY_NAME_LENGTH':
      return t.app.errors.displayNameLength

    case 'PROFILE_EXISTS':
      return t.app.errors.profileExists

    case 'USERNAME_TAKEN':
      return t.app.errors.usernameTaken

    case 'USER_ALREADY_EXISTS':
      return t.app.errors.userAlreadyExists

    case 'USER_NOT_FOUND':
      return t.app.errors.userNotFound

    case 'NO_VALID_UPDATE_FIELDS':
      return t.app.errors.noValidUpdateFields

    /* ----------------------------- Circles ------------------------------- */

    case 'CIRCLE_FIELDS_REQUIRED':
      return t.app.errors.circleFieldsRequired

    case 'CREATOR_NOT_FOUND':
      return t.app.errors.creatorNotFound

    case 'CREATOR_WALLET_MISMATCH':
      return t.app.errors.creatorWalletMismatch

    case 'GOAL_OWNER_NOT_FOUND':
      return t.app.errors.goalOwnerNotFound

    case 'GOAL_OWNER_WALLET_MISMATCH':
      return t.app.errors.goalOwnerWalletMismatch

    case 'TARGET_AMOUNT_INVALID':
      return t.app.errors.targetAmountInvalid

    case 'CREATOR_COMMITMENT_INVALID':
      return t.app.errors.creatorCommitmentInvalid

    case 'CREATOR_COMMITMENT_TOO_LARGE':
      return t.app.errors.creatorCommitmentTooLarge

    case 'INVALID_DEADLINE':
      return t.app.errors.invalidDeadline

    case 'DEADLINE_NOT_FUTURE':
      return t.app.errors.deadlineNotFuture

    case 'CIRCLE_ALREADY_EXISTS':
      return t.app.errors.circleAlreadyExists

    case 'CIRCLE_NOT_FOUND':
      return t.app.errors.circleNotFound

    case 'WALLET_REQUIRED':
      return t.app.errors.walletRequired

    case 'INVALID_STATUS_CHANGE':
      return t.app.errors.invalidStatusChange

    case 'ONLY_CREATOR_CAN_CANCEL':
      return t.app.errors.onlyCreatorCanCancel

    case 'CIRCLE_STATUS_LOCKED':
      return t.app.errors.circleStatusLocked

    case 'ONLY_CREATOR_CAN_EXTEND':
      return t.app.errors.onlyCreatorCanExtend

    case 'CIRCLE_DEADLINE_LOCKED':
      return t.app.errors.circleDeadlineLocked

    case 'DEADLINE_REQUIRED':
      return t.app.errors.deadlineRequired

    case 'DEADLINE_MUST_BE_LATER':
      return t.app.errors.deadlineMustBeLater

    /* --------------------------- Contributions --------------------------- */

    case 'TRANSACTION_HASH_REQUIRED':
      return t.app.errors.transactionHashRequired

    case 'TRANSACTION_NOT_FOUND':
      return t.app.errors.transactionNotFound

    case 'TRANSACTION_NOT_CONFIRMED':
      return t.app.errors.transactionNotConfirmed

    case 'TRANSACTION_FAILED':
      return t.app.errors.transactionFailed

    case 'RECIPIENT_MISMATCH':
      return t.app.errors.recipientMismatch

    case 'AMOUNT_MISMATCH':
      return t.app.errors.amountMismatch

    case 'MEMO_MISMATCH':
      return t.app.errors.memoMismatch

    case 'SENDER_MISMATCH':
      return t.app.errors.senderMismatch

    case 'CONTRIBUTION_NOT_FOUND':
      return t.app.errors.contributionNotFound

    default:
      return error.message || t.app.errors.invalidResponse
  }
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
  const {
    t,
  } = useLanguage()

  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [showWelcome, setShowWelcome] =
    useState(false)

  const [
    justCreatedProfile,
    setJustCreatedProfile,
  ] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      setLoading(true)
      setError(null)

      try {
        const existingUser =
          await apiGetUser(address)

        if (cancelled) {
          return
        }

        setUser(existingUser)

        saveSession(existingUser)

        if (!justCreatedProfile) {
          setShowWelcome(true)
        }
      } catch (requestError) {
        if (cancelled) {
          return
        }

        if (
          requestError instanceof ApiRequestError &&
          requestError.code === 'USER_NOT_FOUND'
        ) {
          setUser(null)
          setShowWelcome(false)
          setError(null)
        } else {
          setError(
            getLocalizedApiError(
              requestError,
              t,
            ),
          )
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
  }, [
    address,
    justCreatedProfile,
    t,
  ])

  async function handleProfileComplete(
    data: {
      username: string
      displayName: string
    },
  ) {
    setError(null)
    setLoading(true)

    try {
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

      setJustCreatedProfile(true)
      setShowWelcome(false)

      saveSession(newUser)

      setUser(newUser)
    } catch (requestError) {
      setError(
        getLocalizedApiError(
          requestError,
          t,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <WalletRestoringView />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 text-slate-900">
        <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertIcon />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              NimCircle
            </p>

            <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
              {t.app.unableToLoadProfile}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.reload()
              }}
              className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
            >
              {t.app.tryAgain}
            </button>
          </div>
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
  const {
    t,
  } = useLanguage()

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

  const {
    circles,
    joinedCircles,
    circleProgress,
    loadingCircles,
    loadingJoinedCircles,
    circleError,
    joinedCircleError,
    creatingCircle,
    createCircle,
  } = useCircles(
    address,
    user,
  )

  /* ------------------------------------------------------------------------ */
  /* Create Circle                                                            */
  /* ------------------------------------------------------------------------ */

  async function handleCreateCircle(
    data: {
      name: string
      description: string
      targetAmount: number
      deadline: string
      goalOwnerWallet: string
      goalOwnerUserId?: string | null
      creatorCommitment: number
    },
  ) {
    const createdCircle =
      await createCircle(data)

    setActiveCircleId(
      createdCircle.id,
    )

    setScreen('circle')

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

  const isCircleView =
    screen === 'circle'

  /* ------------------------------------------------------------------------ */
  /* Screen Rendering                                                         */
  /* ------------------------------------------------------------------------ */

  function renderScreen() {
    if (screen === 'home') {
      return (
        <>
          {(circleError ||
            joinedCircleError) && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getLocalizedApiError(circleError ||
                joinedCircleError, t)}
            </div>
          )}

          {loadingCircles ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                {t.app.loadingCircles}
              </p>
            </div>
          ) : (
            <HomeView
              userName={
                user.displayName
              }

              circles={
                circles
              }

              joinedCircles={
                joinedCircles
              }

              circleProgress={
                circleProgress
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

    if (screen === 'create') {
      return (
        <CreateCircleView
          creatorWallet={
            address
          }

          onBack={goHome}

          onCreate={
            handleCreateCircle
          }

          loading={
            creatingCircle
          }
        />
      )
    }

    if (screen === 'circles') {
      return (
        <>
          {circleError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getLocalizedApiError(circleError, t)}
            </div>
          )}

          {joinedCircleError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getLocalizedApiError(joinedCircleError, t)}
            </div>
          )}

          <CirclesView
            circles={circles}
            joinedCircles={
              joinedCircles
            }
            circleProgress={
              circleProgress
            }
            onCreateCircle={() =>
              navigateTo('create')
            }
            onOpenCircle={
              openCircle
            }
            loading={
              loadingCircles
            }
            loadingJoined={
              loadingJoinedCircles
            }
          />
        </>
      )
    }

    if (screen === 'profile') {
      return (
        <ProfileView
          user={user}
        />
      )
    }

    if (
      isCircleView &&
      activeCircleId
    ) {
      return (
        <CircleView
          circleId={
            activeCircleId
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

    return (
      <HomeView
        userName={
          user.displayName
        }

        circles={
          circles
        }

        joinedCircles={
          joinedCircles
        }

        circleProgress={
          circleProgress
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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

function AppContent() {
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

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}