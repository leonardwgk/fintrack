// ── Card ──────────────────────────────────────────────────────
export function Card({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── StatCard ───────────────────────────────────────────────────
export function StatCard({ label, value, sub, trend, accent = 'default', loading = false }) {
  const themes = {
    default: { bg: 'var(--white)',       text: 'var(--ink)',   border: 'var(--border)' },
    green:   { bg: 'var(--green-soft)',  text: 'var(--green)', border: '#bbf7d0' },
    red:     { bg: 'var(--red-soft)',    text: 'var(--red)',   border: '#fecaca' },
    blue:    { bg: 'var(--blue-soft)',   text: 'var(--blue)',  border: '#bfdbfe' },
    amber:   { bg: 'var(--amber-soft)',  text: 'var(--amber)', border: '#fde68a' },
    purple:  { bg: 'var(--purple-soft)', text: 'var(--purple)',border: '#ddd6fe' },
    dark:    { bg: 'var(--ink)',         text: 'white',        border: 'transparent' },
  }
  const t = themes[accent] || themes.default

  return (
    <div style={{
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <p style={{ fontSize:11, fontWeight:500, color: accent === 'dark' ? 'rgba(255,255,255,.45)' : 'var(--ink-muted)', margin:'0 0 10px', letterSpacing:'.06em', textTransform:'uppercase' }}>{label}</p>
      {loading ? (
        <div className="skeleton" style={{ height:28, width:'60%', marginBottom:6 }} />
      ) : (
        <p style={{ fontSize:24, fontWeight:600, color: t.text, margin:0, letterSpacing:'-.03em', lineHeight:1.1 }}>{value}</p>
      )}
      {(sub || trend) && (
        <p style={{ fontSize:12, color: accent === 'dark' ? 'rgba(255,255,255,.4)' : 'var(--ink-muted)', margin:'6px 0 0' }}>
          {trend && <span style={{ color: trend > 0 ? 'var(--green)' : 'var(--red)', fontWeight:500 }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%{' '}</span>}
          {sub}
        </p>
      )}
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────
export function Badge({ children, accent = 'default' }) {
  const themes = {
    default: { bg:'var(--surface-2)',   color:'var(--ink-soft)' },
    green:   { bg:'var(--green-soft)',  color:'var(--green)'  },
    red:     { bg:'var(--red-soft)',    color:'var(--red)'    },
    blue:    { bg:'var(--blue-soft)',   color:'var(--blue)'   },
    amber:   { bg:'var(--amber-soft)',  color:'var(--amber)'  },
    purple:  { bg:'var(--purple-soft)', color:'var(--purple)' },
  }
  const t = themes[accent] || themes.default
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:500, background:t.bg, color:t.color }}>
      {children}
    </span>
  )
}

// ── Button ──────────────────────────────────────────────────────
export function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, style: extraStyle }) {
  const sizes = {
    sm: { padding:'6px 12px', fontSize:12 },
    md: { padding:'10px 18px', fontSize:13 },
    lg: { padding:'13px 24px', fontSize:14 },
  }
  const variants = {
    primary:  { background:'var(--ink)',       color:'white',          border:'none' },
    secondary:{ background:'var(--surface-2)', color:'var(--ink)',     border:'1px solid var(--border)' },
    ghost:    { background:'transparent',      color:'var(--ink-soft)',border:'none' },
    danger:   { background:'var(--red-soft)',  color:'var(--red)',     border:'1px solid #fca5a5' },
  }
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v, ...s,
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1,
        transition: 'all .15s',
        letterSpacing: '-.01em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...extraStyle,
      }}
    >
      {children}
    </button>
  )
}

// ── Divider ────────────────────────────────────────────────────
export function Divider({ style }) {
  return <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'0', ...style }} />
}

// ── EmptyState ─────────────────────────────────────────────────
export function EmptyState({ icon = '◌', title, description, action }) {
  return (
    <div style={{ padding:'56px 24px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div style={{ fontSize:36, marginBottom:6, opacity:.5 }}>{icon}</div>
      <p style={{ fontSize:15, fontWeight:600, color:'var(--ink)', margin:0, letterSpacing:'-.02em' }}>{title}</p>
      {description && <p style={{ fontSize:13, color:'var(--ink-muted)', margin:0, maxWidth:320 }}>{description}</p>}
      {action && <div style={{ marginTop:12 }}>{action}</div>}
    </div>
  )
}

// ── ProgressBar ────────────────────────────────────────────────
export function ProgressBar({ value = 0, accent = 'blue', height = 8 }) {
  const colors = {
    green: 'var(--green)', red: 'var(--red)', blue: 'var(--blue)',
    amber: 'var(--amber)', purple: 'var(--purple)', ink: 'var(--ink)',
  }
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div style={{ width:'100%', height, background:'var(--surface-3)', borderRadius:99, overflow:'hidden' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:colors[accent] || colors.blue, borderRadius:99, transition:'width .4s ease' }} />
    </div>
  )
}
