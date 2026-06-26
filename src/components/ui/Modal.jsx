import { useEffect } from 'react'

// ── Modal ──────────────────────────────────────────────────────
// Centered dialog on desktop; slides up as a bottom sheet on mobile.
// ESC to close, backdrop click to close, body scroll lock.
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
      className="modal-overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,14,9,.42)',
        backdropFilter: 'blur(3px)',
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
        className="modal-panel"
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--bone)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          margin: 'auto',
          animation: 'pop-in .3s cubic-bezier(.22,.61,.36,1) both',
        }}
      >
        <span className="sheet-grip" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <h2 className="serif" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.01em', color: 'var(--ink)', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 22, lineHeight: 1, padding: 4, borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-muted)' }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 22 }}>
          {children}
        </div>
      </div>

      <style>{`
        .sheet-grip { display: none; }
        @media (max-width: 640px) {
          .modal-overlay { align-items: flex-end !important; padding: 0 !important; }
          .modal-panel {
            max-width: 100% !important;
            margin: 0 !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            border-top-left-radius: var(--radius-xl) !important;
            border-top-right-radius: var(--radius-xl) !important;
            max-height: 92vh;
            overflow-y: auto;
            animation: sheet-up .32s cubic-bezier(.22,.61,.36,1) both !important;
            padding-bottom: env(safe-area-inset-bottom);
          }
          .sheet-grip {
            display: block;
            width: 38px; height: 4px;
            background: var(--surface-3);
            border-radius: 99px;
            margin: 10px auto 2px;
          }
        }
      `}</style>
    </div>
  )
}
