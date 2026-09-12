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
  apiCreateUser,
  apiGetUser,
} from './lib/api'

import type { User } from './types/user'

import {
  LanguageProvider,
} from './i18n/LanguageProvider'

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

  const [justCreatedProfile, setJustCreatedProfile] =
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
         * If this request succeeds, the wallet already
         * has a NimCircle profile.
         */
        const existingUser =
          await apiGetUser(address)

        if (cancelled) {
          return
        }

        setUser(existingUser)

        /*
         * Keep the local session synchronized with
         * the backend profile.
         */
        saveSession(existingUser)

        /*
         * Existing profile + not just created =
         * returning user.
         */
        if (!justCreatedProfile) {
          setShowWelcome(true)
        }
      } catch (requestError) {
        if (cancelled) {
          return
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : String(requestError)

        /*
         * No profile yet means this is a new user.
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
       * Create the new profile in the backend.
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

      /*
       * This profile was just created, so the
       * Welcome Back modal must not appear.
       */
      setJustCreatedProfile(true)
      setShowWelcome(false)

      /*
       * Save the authenticated session.
       */
      saveSession(newUser)

      /*
       * Enter the app immediately.
       */
      setUser(newUser)
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
              Unable to load your profile
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
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  /*
   * No backend profile means this is a first-time
   * NimCircle user.
   */
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
   * Circle collection data and Circle creation
   * are managed by the useCircles hook.
   */
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
  } = useCircles(address, user)

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

  const isCircleView =
    screen === 'circle'

  /* ------------------------------------------------------------------------ */
  /* Screen Rendering                                                         */
  /* ------------------------------------------------------------------------ */

  function renderScreen() {
    /* ---------------------------------------------------------------------- */
    /* Home                                                                   */
    /* ---------------------------------------------------------------------- */

    if (screen === 'home') {
      return (
        <>
          {(circleError ||
            joinedCircleError) && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {circleError ||
                joinedCircleError}
            </div>
          )}

          {loadingCircles ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading your circles...
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
            handleCreateCircle
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
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {circleError}
            </div>
          )}

          {joinedCircleError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {joinedCircleError}
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

  /* ------------------------------------------------------------------------ */
  /* Connected App Layout                                                     */
  /* ------------------------------------------------------------------------ */

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