import {
  useLanguage,
} from '../i18n/useLanguage'

export type NavigationTab =
  | 'home'
  | 'circles'
  | 'create'
  | 'profile'

interface BottomNavigationProps {
  activeTab: NavigationTab
  onNavigate: (
    tab: NavigationTab,
  ) => void
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  )
}

function CirclesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="9"
        r="5"
      />
      <circle
        cx="15"
        cy="15"
        r="5"
      />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}

function CreateIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export default function BottomNavigation({
  activeTab,
  onNavigate,
}: BottomNavigationProps) {
  const {
    t,
  } = useLanguage()

  const navigationItems: {
    id: NavigationTab
    label: string
  }[] = [
    {
      id: 'home',
      label: t.navigation.home,
    },
    {
      id: 'circles',
      label: t.navigation.circles,
    },
    {
      id: 'create',
      label: t.navigation.create,
    },
    {
      id: 'profile',
      label: t.navigation.profile,
    },
  ]

  function renderIcon(
    id: NavigationTab,
  ) {
    switch (id) {
      case 'home':
        return <HomeIcon />

      case 'circles':
        return <CirclesIcon />

      case 'create':
        return <CreateIcon />

      case 'profile':
        return <ProfileIcon />
    }
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-9999 px-3 pt-3"
      style={{
        paddingBottom:
          'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto w-full max-w-xl">
        <div className="relative flex items-end rounded-3xl border border-white/10 bg-slate-950/95 px-2 py-2 shadow-[0_-12px_40px_rgba(15,23,42,0.22)] backdrop-blur-xl">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id
            const isCreate = item.id === 'create'
          
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex min-h-14 flex-1 flex-col items-center justify-center rounded-2xl px-1 text-[11px] font-bold transition-all active:scale-[0.96]"
              >
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    isCreate
                      ? 'border border-lime-200 bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(190,242,100,0.28)]'
                      : isActive
                        ? 'bg-lime-300 text-slate-950 shadow-[0_0_18px_rgba(190,242,100,0.12)]'
                        : 'text-slate-400'
                  }`}
                >
                  {isCreate && (
                    <span
                      className="absolute -inset-1 rounded-[14px] border border-lime-300/20"
                      aria-hidden="true"
                    />
                  )}
          
                  {renderIcon(item.id)}
                </span>
          
                <span
                  className={`mt-1 ${
                    isCreate
                      ? 'text-lime-300'
                      : isActive
                        ? 'text-white'
                        : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}