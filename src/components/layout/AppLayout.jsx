import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout({ children, title, eyebrow, action }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--paper)' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, padding: '34px 30px', paddingBottom: 110 }} className="main-content">
        {(title || action) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26, gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              {eyebrow && <p className="eyebrow" style={{ margin: '0 0 2px' }}>{eyebrow}</p>}
              {title && (
                <h1 className="serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.02em', color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>{title}</h1>
              )}
            </div>
            {action && <div style={{ flexShrink: 0 }}>{action}</div>}
          </div>
        )}
        {children}
      </main>
      <BottomNav />
      <style>{`
        @media (max-width: 767px) {
          .main-content { padding: 22px 16px 110px !important; }
        }
      `}</style>
    </div>
  )
}
