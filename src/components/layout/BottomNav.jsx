import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard',    icon: '▣', label: 'Home' },
  { to: '/transactions', icon: '↕', label: 'Transaksi' },
  { to: '/accounts',     icon: '🏦', label: 'Akun' },
  { to: '/budgets',      icon: '◎', label: 'Budget' },
  { to: '/goals',        icon: '◈', label: 'Goals' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-400'
            }`
          }
        >
          <span className="text-base leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
