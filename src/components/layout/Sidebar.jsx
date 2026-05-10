import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/dashboard',    icon: '▣', label: 'Dashboard' },
  { to: '/accounts',     icon: '🏦', label: 'Accounts' },
  { to: '/transactions', icon: '↕',  label: 'Transaksi' },
  { to: '/budgets',      icon: '◎',  label: 'Budget' },
  { to: '/goals',        icon: '◈',  label: 'Goals' },
  { to: '/bills',        icon: '↻',  label: 'Bills' },
  { to: '/investments',  icon: '◆',  label: 'Investasi' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuthStore()
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()
    : '?'

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      alignSelf: 'flex-start',
      height: '100vh',
    }} className="sidebar-desktop">

      <div style={{ padding:'4px 12px', marginBottom:28, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:28, height:28, background:'white', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:14 }}>◈</span>
        </div>
        <span style={{ color:'white', fontWeight:600, fontSize:16, letterSpacing:'-.02em' }}>fintrack</span>
      </div>

      <nav style={{ display:'flex', flexDirection:'column', gap:2, flex:1 }}>
        <p style={{ color:'rgba(255,255,255,.25)', fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', padding:'0 12px', marginBottom:6 }}>Menu</p>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'white' : 'rgba(255,255,255,.45)',
              background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'all .15s',
              letterSpacing: '-.01em',
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.background.includes('.1')) e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = 'rgba(255,255,255,.8)' }}
            onMouseLeave={e => { const isActive = e.currentTarget.getAttribute('aria-current') === 'page'; e.currentTarget.style.background = isActive ? 'rgba(255,255,255,.1)' : 'transparent'; e.currentTarget.style.color = isActive ? 'white' : 'rgba(255,255,255,.45)' }}
          >
            <span style={{ fontSize:15, lineHeight:1, width:18, textAlign:'center' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:16, marginTop:16, padding:'16px 12px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:600, flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ color:'white', fontSize:12, fontWeight:500, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {profile?.full_name || 'User'}
            </p>
            <p style={{ color:'rgba(255,255,255,.3)', fontSize:11, margin:0 }}>Personal</p>
          </div>
        </div>
        <button
          onClick={signOut}
          style={{ color:'rgba(255,255,255,.3)', fontSize:12, background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-sans)', padding:0, transition:'color .15s' }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.7)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.3)'}
        >
          Sign out →
        </button>
      </div>
    </aside>
  )
}