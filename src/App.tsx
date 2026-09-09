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

import {
  loadCircles,
  saveCircles,
} from './lib/storage'

import {
  createUser,
  getSession,
  getUserByWallet,
  saveSession,
} from './lib/userStorage'

import type { Circle } from './types/circle'
import type { User } from './types/user'

type Screen =
  | NavigationTab
  | 'circle'

function ProfileGate({
  address,
  children,
}: {
  address: string
  children: (user: User) => ReactNode
}) {
  const storedSession = getSession()
  const storedUser = getUserByWallet(address)

  const hasMatchingSession =
    storedSession &&
    storedSession.walletAddress.toLowerCase() ===
      address.toLowerCase() &&
    storedUser

  const [user, setUser] = useState<User | null>(
    () => storedUser,
  )

  const [showWelcome, setShowWelcome] = useState(
    () => Boolean(hasMatchingSession),
  )

  useEffect(() => {
    if (storedUser && !hasMatchingSession) {
      saveSession(storedUser)
    }
  }, [storedUser, hasMatchingSession])

  function handleProfileComplete(displayName: string) {
    const newUser = createUser(
      displayName,
      address,
    )

    saveSession(newUser)

    setUser(newUser)
    setShowWelcome(false)
  }

  if (!user) {
    return (
      <ProfileSetup
        walletAddress={address}
        onComplete={handleProfileComplete}
      />
    )
  }

  return (
    <>
      {children(user)}

      {showWelcome && (
        <WelcomeBackModal
          user={user}
          onContinue={() => setShowWelcome(false)}
        />
      )}
    </>
  )
}

function ConnectedApp({
  address,
  user,
}: {
  address: string
  user: User
}) {
  const [screen, setScreen] =
    useState<Screen>('home')

  const [activeCircleId, setActiveCircleId] =
    useState<string | null>(null)

  const [circles, setCircles] = useState<Circle[]>(
    () => loadCircles(address),
  )

  useEffect(() => {
    saveCircles(address, circles)
  }, [address, circles])

  function handleCreateCircle(data: {
    name: string
    description: string
    targetAmount: number
    deadline: string
  }) {
    const circle: Circle = {
      id: `circle_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      name: data.name,
      description: data.description,
      targetAmount: data.targetAmount,
      deadline: data.deadline,
      recipient: address,
      creator: address,
      createdAt: new Date().toISOString(),
    }

    setCircles((current) => [
      ...current,
      circle,
    ])

    setActiveCircleId(circle.id)
    setScreen('circle')
  }

  function handleOpenCircle(circleId: string) {
    setActiveCircleId(circleId)
    setScreen('circle')
  }

  function handleHome() {
    setActiveCircleId(null)
    setScreen('home')
  }

  function handleNavigate(tab: NavigationTab) {
    setActiveCircleId(null)
    setScreen(tab)
  }

  const activeCircle =
    circles.find(
      (circle) => circle.id === activeCircleId,
    ) ?? null

  const isCircleView = screen === 'circle'

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#162018]">
      <AppHeader
        address={address}
        onHome={handleHome}
      />

      <main
        className={
          isCircleView
            ? 'mx-auto w-full max-w-xl px-5 pb-8'
            : 'mx-auto w-full max-w-xl px-5 pb-32'
        }
      >
        {screen === 'home' && (
          <HomeView
            userName={user.displayName}
            circles={circles}
            onCreateCircle={() =>
              setScreen('create')
            }
            onViewCircles={() => {
              setActiveCircleId(null)
              setScreen('circles')
            }}
            onOpenCircle={handleOpenCircle}
          />
        )}

        {screen === 'create' && (
          <CreateCircleView
            address={address}
            onBack={handleHome}
            onCreate={handleCreateCircle}
          />
        )}

        {screen === 'circles' && (
          <CirclesView
            circles={circles}
            onCreateCircle={() =>
              setScreen('create')
            }
            onOpenCircle={handleOpenCircle}
          />
        )}
        
        {screen === 'profile' && (
          <ProfileView user={user} />
        )}

        {screen === 'circle' && activeCircle && (
          <CircleView
            circle={activeCircle}
            onBack={handleHome}
          />
        )}

        {screen === 'circle' && !activeCircle && (
          <HomeView
            userName={user.displayName}
            circles={circles}
            onCreateCircle={() =>
              setScreen('create')
            }
            onViewCircles={() => {
              setActiveCircleId(null)
              setScreen('circles')
            }}
            onOpenCircle={handleOpenCircle}
          />
        )}
      </main>

      {!isCircleView && (
        <BottomNavigation
          activeTab={screen}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}

export default function App() {
  const wallet = useWallet()

  if (wallet.loading) {
    return <WalletRestoringView />
  }

  if (!wallet.address) {
    return (
      <ConnectWalletView
        onConnect={wallet.connectWallet}
        loading={wallet.loading}
        error={wallet.error}
        providerReady={
          wallet.debug.providerInitialized
        }
      />
    )
  }

  return (
    <ProfileGate
      key={wallet.address}
      address={wallet.address}
    >
      {(user) => (
        <ConnectedApp
          address={wallet.address!}
          user={user}
        />
      )}
    </ProfileGate>
  )
}