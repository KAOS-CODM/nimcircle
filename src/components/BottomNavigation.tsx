export type NavigationTab =
  | 'home'
  | 'circles'
  | 'create'
  | 'profile'

interface BottomNavigationProps {
  activeTab: NavigationTab
  onNavigate: (tab: NavigationTab) => void
}

const navigationItems: {
  id: NavigationTab
  label: string
  icon: string
}[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '⌂',
  },
  {
    id: 'circles',
    label: 'Circles',
    icon: '○',
  },
  {
    id: 'create',
    label: 'Create',
    icon: '+',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '♙',
  },
]

export default function BottomNavigation({
  activeTab,
  onNavigate,
}: BottomNavigationProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-9999 border-t border-black/5 bg-white px-3 pt-3 shadow-[0_-8px_30px_rgba(22,32,24,0.08)]"
      style={{
        paddingBottom:
          'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto flex w-full max-w-xl items-end justify-between">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id
          const isCreate = item.id === 'create'

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={
                isActive ? 'page' : undefined
              }
              className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-semibold transition-transform active:scale-[0.96] ${
                isCreate
                  ? 'mx-1 -mt-6'
                  : ''
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isCreate
                    ? 'bg-[#162018] text-2xl font-medium text-white shadow-lg'
                    : isActive
                      ? 'bg-[#c7f36b] text-xl text-[#162018]'
                      : 'bg-[#f7f8f5] text-xl text-[#607060]'
                }`}
              >
                {item.icon}
              </span>

              <span
                className={
                  isActive
                    ? 'text-[#162018]'
                    : 'text-[#607060]'
                }
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}