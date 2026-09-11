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
  getSession,
  saveSession,
} from './lib/userStorage'
import {
  apiCreateUser,
  apiGetUser,
} from './lib/api'
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
  /* Create Circle                                                             */
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
  /* Navigation                                                                */
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
  /* Screen Rendering                                                          */
  /* ------------------------------------------------------------------------ */

  function renderScreen() {
    /* ---------------------------------------------------------------------- */
    /* Home                                                                    */
    /* ---------------------------------------------------------------------- */

    if (screen === 'home') {
      return (
        <>
          {(circleError ||
            joinedCircleError) && (
            <p className="text-sm text-red-600">
              {circleError ||
                joinedCircleError}
            </p>
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
    /* Create Circle                                                           */
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
    /* Circles                                                                 */
    /* ---------------------------------------------------------------------- */

    if (screen === 'circles') {
      return (
        <>
          {circleError && (
            <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {circleError}
            </div>
          )}

          {joinedCircleError && (
            <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
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
    /* Profile                                                                 */
    /* ---------------------------------------------------------------------- */

    if (screen === 'profile') {
      return (
        <ProfileView
          user={user}
        />
      )
    }

    /* ---------------------------------------------------------------------- */
    /* Circle                                                                  */
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
    /* Fallback Home                                                           */
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