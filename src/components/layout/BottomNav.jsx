import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard',    icon: '▣', label: 'Ringkasan' },
  { to: '/transactions', icon: '↕',  label: 'Transaksi' },
  { to: '/allowance',    icon: '◐',  label: 'Jatah' },
  { to: '/budgets',      icon: '◎',  label: 'Budget' },
  { to: '/goals',        icon: '◈',  label: 'Goals' },
]

export default function BottomNav() {
  return (
    <>
      <nav
        className="bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--ink)',
          borderTop: '1px solid rgba(255,255,255,.08)',
          zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              position: 'relative',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '11px 4px 9px',
              gap: 4,
              minHeight: 56,
              fontSize: 10,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,.4)',
              textDecoration: 'none',
              transition: 'color .15s',
              letterSpacing: '.02em',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && <span style={{ position: 'absolute', top: 0, width: 22, height: 2.5, background: 'var(--brass)', borderRadius: 99 }} />}
                <span style={{ fontSize: 19, lineHeight: 1 }}>{icon}</span>
                {label}
              </>
            )}
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
