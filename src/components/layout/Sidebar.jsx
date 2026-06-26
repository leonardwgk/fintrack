import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/dashboard',    icon: '▣', label: 'Ringkasan' },
  { to: '/accounts',     icon: '🏦', label: 'Akun' },
  { to: '/transactions', icon: '↕',  label: 'Transaksi' },
  { to: '/allowance',    icon: '◐',  label: 'Jatah Bulanan' },
  { to: '/budgets',      icon: '◎',  label: 'Budget' },
  { to: '/goals',        icon: '◈',  label: 'Goals' },
  { to: '/bills',        icon: '↻',  label: 'Tagihan' },
  { to: '/investments',  icon: '◆',  label: 'Investasi' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuthStore()
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: 232,
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        padding: '26px 14px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
      }}
    >
      {/* brand */}
      <div style={{ padding: '4px 10px', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 30, height: 30, background: 'var(--brass)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 15 }}>◈</div>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 17, letterSpacing: '-.02em' }}>fintrack</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, padding: '0 12px', marginBottom: 8 }}>Menu</p>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,.5)',
              background: isActive ? 'rgba(255,255,255,.07)' : 'transparent',
              textDecoration: 'none',
              transition: 'all .15s',
              letterSpacing: '-.01em',
            })}
            onMouseEnter={e => { if (e.currentTarget.getAttribute('aria-current') !== 'page') { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.color = 'rgba(255,255,255,.82)' } }}
            onMouseLeave={e => { const active = e.currentTarget.getAttribute('aria-current') === 'page'; e.currentTarget.style.background = active ? 'rgba(255,255,255,.07)' : 'transparent'; e.currentTarget.style.color = active ? '#fff' : 'rgba(255,255,255,.5)' }}
          >
            {({ isActive }) => (
              <>
                {isActive && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, background: 'var(--brass)', borderRadius: 99 }} />}
                <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>{icon}</span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* profile */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '16px 10px 0', marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brass-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: 12.5, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.full_name || 'User'}
            </p>
            <p style={{ color: 'rgba(255,255,255,.32)', fontSize: 11, margin: 0 }}>Personal</p>
          </div>
        </div>
        <button
          onClick={signOut}
          style={{ color: 'rgba(255,255,255,.34)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0, transition: 'color .15s' }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.72)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.34)'}
        >
          Keluar →
        </button>
      </div>
    </aside>
  )
}
