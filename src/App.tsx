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

interface ConnectedAppProps {
  address: string
  user: User
}

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
    Boolean(storedSession) &&
    storedSession?.walletAddress.toLowerCase() ===
      address.toLowerCase() &&
    Boolean(storedUser)

  const [user, setUser] = useState<User | null>(
    () => storedUser,
  )

  const [showWelcome, setShowWelcome] = useState(
    () => hasMatchingSession,
  )

  useEffect(() => {
    if (storedUser && !hasMatchingSession) {
      saveSession(storedUser)
    }
  }, [storedUser, hasMatchingSession])

  function handleProfileComplete(
    displayName: string,
  ) {
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
          onContinue={() =>
            setShowWelcome(false)
          }
        />
      )}
    </>
  )
}

function ConnectedApp({
  address,
  user,
}: ConnectedAppProps) {
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

  function createCircle(data: {
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

    openCircle(circle.id)
  }

  function openCircle(circleId: string) {
    setActiveCircleId(circleId)
    setScreen('circle')
  }

  function goHome() {
    setActiveCircleId(null)
    setScreen('home')
  }

  function navigateTo(tab: NavigationTab) {
    setActiveCircleId(null)
    setScreen(tab)
  }

  const activeCircle =
    circles.find(
      (circle) => circle.id === activeCircleId,
    ) ?? null

  const isCircleView = screen === 'circle'

  function renderScreen() {
    if (screen === 'home') {
      return (
        <HomeView
          userName={user.displayName}
          circles={circles}
          onCreateCircle={() =>
            setScreen('create')
          }
          onViewCircles={() =>
            navigateTo('circles')
          }
          onOpenCircle={openCircle}
        />
      )
    }

    if (screen === 'create') {
      return (
        <CreateCircleView
          onBack={goHome}
          onCreate={createCircle}
        />
      )
    }

    if (screen === 'circles') {
      return (
        <CirclesView
          circles={circles}
          onCreateCircle={() =>
            setScreen('create')
          }
          onOpenCircle={openCircle}
        />
      )
    }

    if (screen === 'profile') {
      return <ProfileView user={user} />
    }

    if (activeCircle) {
      return (
        <CircleView
          circle={activeCircle}
          currentAddress={address}
          onBack={goHome}
        />
      )
    }

    return (
      <HomeView
        userName={user.displayName}
        circles={circles}
        onCreateCircle={() =>
          setScreen('create')
        }
        onViewCircles={() =>
          navigateTo('circles')
        }
        onOpenCircle={openCircle}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#162018]">
      <AppHeader
        address={address}
        onHome={goHome}
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
          activeTab={screen}
          onNavigate={navigateTo}
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