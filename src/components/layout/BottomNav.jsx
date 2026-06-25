import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard',    icon: '▣', label: 'Home' },
  { to: '/transactions', icon: '↕',  label: 'Transaksi' },
  { to: '/allowance',    icon: '◐',  label: 'Jatah' },
  { to: '/budgets',      icon: '◎',  label: 'Budget' },
  { to: '/goals',        icon: '◈',  label: 'Goals' },
]

export default function BottomNav() {
  return (
    <>
      <nav style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--ink)',
        borderTop: '1px solid rgba(255,255,255,.08)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }} className="bottom-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              gap: 3,
              fontSize: 10,
              color: isActive ? 'white' : 'rgba(255,255,255,.35)',
              textDecoration: 'none',
              transition: 'color .15s',
              letterSpacing: '.02em',
            })}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <style>{`
        @media (max-width: 767px) {
          .bottom-nav { display: flex !important; }
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  )
}
