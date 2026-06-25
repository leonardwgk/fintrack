// ── Shared field styles ────────────────────────────────────────
const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--ink-soft)',
  marginBottom: 6,
  letterSpacing: '.01em',
}

const controlStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
  color: 'var(--ink)',
  background: 'var(--white)',
  outline: 'none',
  transition: 'border-color .15s',
  boxSizing: 'border-box',
}

const focusHandlers = {
  onFocus: (e) => { e.target.style.borderColor = 'var(--ink)' },
  onBlur: (e) => { e.target.style.borderColor = 'var(--border)' },
}

// ── Field (label + control wrapper) ────────────────────────────
export function Field({ label, hint, children, required }) {
  return (
    <div>
      {label && (
        <label style={labelStyle}>
          {label}{required && <span style={{ color: 'var(--red)' }}> *</span>}
        </label>
      )}
      {children}
      {hint && <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: '6px 0 0' }}>{hint}</p>}
    </div>
  )
}

// ── Input ──────────────────────────────────────────────────────
export function Input({ style, ...props }) {
  return <input {...focusHandlers} {...props} style={{ ...controlStyle, ...style }} />
}

// ── Select ─────────────────────────────────────────────────────
export function Select({ style, children, ...props }) {
  return (
    <select {...focusHandlers} {...props} style={{ ...controlStyle, cursor: 'pointer', appearance: 'auto', ...style }}>
      {children}
    </select>
  )
}

// ── Textarea ───────────────────────────────────────────────────
export function Textarea({ style, ...props }) {
  return <textarea {...focusHandlers} {...props} style={{ ...controlStyle, resize: 'vertical', minHeight: 72, ...style }} />
}

// ── FormActions (cancel / submit footer) ───────────────────────
export function FormActions({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
      {children}
    </div>
  )
}
