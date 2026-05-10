import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/dashboard',     icon: '▣', label: 'Dashboard' },
  { to: '/accounts',      icon: '🏦', label: 'Accounts' },
  { to: '/transactions',  icon: '↕', label: 'Transactions' },
  { to: '/budgets',       icon: '◎', label: 'Budgets' },
  { to: '/goals',         icon: '◈', label: 'Goals' },
  { to: '/bills',         icon: '↻', label: 'Bills' },
  { to: '/investments',   icon: '◆', label: 'Investments' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuthStore()

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 px-3 py-6 shrink-0">
      <div className="px-3 mb-8">
        <span className="text-lg font-semibold text-gray-900 tracking-tight">fintrack</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-4 mt-4 px-3">
        <p className="text-xs text-gray-500 truncate mb-2">{profile?.full_name || 'User'}</p>
        <button
          onClick={signOut}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
