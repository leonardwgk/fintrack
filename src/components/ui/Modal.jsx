import { useEffect } from 'react'

// ── Modal ──────────────────────────────────────────────────────
// Reusable modal: ESC to close, click backdrop to close, body scroll lock.
export default function Modal({ open, onClose, title, children, maxWidth = 460 }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,15,14,.4)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 16px',
        overflowY: 'auto',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up"
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          margin: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-.02em', color: 'var(--ink)', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 20, lineHeight: 1, padding: 4, borderRadius: 6 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-muted)' }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '22px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
