// ── Eyebrow ────────────────────────────────────────────────────
// Fraunces-italic kicker — the heritage "ledger" voice. Used with restraint.
export function Eyebrow({ children, style }) {
  return (
    <span className="eyebrow" style={style}>{children}</span>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bone)',
        border: '1px solid var(--line)',
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
// A ledger cell: small tracked label, big tabular-mono value.
export function StatCard({ label, value, sub, trend, accent = 'default', loading = false, tick = false }) {
  const themes = {
    default: { bg: 'var(--bone)',        text: 'var(--ink)',    sub: 'var(--ink-muted)' },
    green:   { bg: 'var(--green-soft)',  text: 'var(--green)',  sub: 'var(--ink-muted)' },
    red:     { bg: 'var(--red-soft)',    text: 'var(--red)',    sub: 'var(--ink-muted)' },
    blue:    { bg: 'var(--blue-soft)',   text: 'var(--blue)',   sub: 'var(--ink-muted)' },
    amber:   { bg: 'var(--amber-soft)',  text: 'var(--amber)',  sub: 'var(--ink-muted)' },
    purple:  { bg: 'var(--purple-soft)', text: 'var(--purple)', sub: 'var(--ink-muted)' },
    brass:   { bg: 'var(--brass-soft)',  text: 'var(--brass)',  sub: 'var(--ink-muted)' },
    dark:    { bg: 'var(--ink)',         text: '#fff',          sub: 'rgba(255,255,255,.45)' },
  }
  const t = themes[accent] || themes.default
  const isDark = accent === 'dark'

  return (
    <div style={{
      background: t.bg,
      border: isDark ? '1px solid transparent' : '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <p style={{ fontSize: 10.5, fontWeight: 600, color: isDark ? 'rgba(255,255,255,.5)' : 'var(--ink-muted)', margin: '0 0 9px', letterSpacing: '.1em', textTransform: 'uppercase' }}>{label}</p>
      {loading ? (
        <div className="skeleton" style={{ height: 26, width: '62%' }} />
      ) : (
        <p className="mono" style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: 0, letterSpacing: '-.02em', lineHeight: 1.1 }}>{value}</p>
      )}
      {tick && !loading && <span className="tick" style={{ marginTop: 10 }} />}
      {(sub || trend) && (
        <p style={{ fontSize: 12, color: t.sub, margin: '7px 0 0' }}>
          {trend != null && <span className="mono" style={{ color: trend > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% </span>}
          {sub}
        </p>
      )}
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────
export function Badge({ children, accent = 'default' }) {
  const themes = {
    default: { bg: 'var(--surface-2)',   color: 'var(--ink-soft)' },
    green:   { bg: 'var(--green-soft)',  color: 'var(--green)'  },
    red:     { bg: 'var(--red-soft)',    color: 'var(--red)'    },
    blue:    { bg: 'var(--blue-soft)',   color: 'var(--blue)'   },
    amber:   { bg: 'var(--amber-soft)',  color: 'var(--amber)'  },
    purple:  { bg: 'var(--purple-soft)', color: 'var(--purple)' },
    brass:   { bg: 'var(--brass-soft)',  color: 'var(--brass)'  },
  }
  const t = themes[accent] || themes.default
  return (
    <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 500, background: t.bg, color: t.color, letterSpacing: '.01em' }}>
      {children}
    </span>
  )
}

// ── Button ──────────────────────────────────────────────────────
export function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, block = false, style: extraStyle }) {
  const sizes = {
    sm: { padding: '7px 13px', fontSize: 12.5, minHeight: 34 },
    md: { padding: '11px 18px', fontSize: 14, minHeight: 44 },
    lg: { padding: '14px 24px', fontSize: 15, minHeight: 50 },
  }
  const variants = {
    primary:   { background: 'var(--ink)',       color: '#fff',           border: '1px solid transparent' },
    brass:     { background: 'var(--brass)',     color: '#fff',           border: '1px solid transparent' },
    secondary: { background: 'var(--bone)',      color: 'var(--ink)',     border: '1px solid var(--line)' },
    ghost:     { background: 'transparent',      color: 'var(--ink-soft)', border: '1px solid transparent' },
    danger:    { background: 'var(--red-soft)',  color: 'var(--red)',     border: '1px solid color-mix(in srgb, var(--red) 35%, transparent)' },
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
        width: block ? '100%' : undefined,
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1,
        transition: 'transform .12s ease, opacity .15s, background .15s',
        letterSpacing: '-.01em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        ...extraStyle,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '.88' }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.opacity = '1' }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
  )
}

// ── Divider ────────────────────────────────────────────────────
export function Divider({ style }) {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: 0, ...style }} />
}

// ── EmptyState ─────────────────────────────────────────────────
export function EmptyState({ icon = '◌', title, description, action }) {
  return (
    <div style={{ padding: '52px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ fontSize: 30, marginBottom: 4, color: 'var(--brass)', opacity: .85 }}>{icon}</div>
      <p className="serif" style={{ fontSize: 19, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-.01em' }}>{title}</p>
      {description && <p style={{ fontSize: 13.5, color: 'var(--ink-muted)', margin: 0, maxWidth: 320, lineHeight: 1.5 }}>{description}</p>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  )
}

// ── ProgressBar ────────────────────────────────────────────────
export function ProgressBar({ value = 0, accent = 'brass', height = 8 }) {
  const colors = {
    green: 'var(--green)', red: 'var(--red)', blue: 'var(--blue)',
    amber: 'var(--amber)', purple: 'var(--purple)', ink: 'var(--ink)', brass: 'var(--brass)',
  }
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div style={{ width: '100%', height, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: colors[accent] || colors.brass, borderRadius: 99, transition: 'width .5s cubic-bezier(.22,.61,.36,1)' }} />
    </div>
  )
}
