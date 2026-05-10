import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout({ children, title, action }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--surface)' }}>
      <Sidebar />
      <main style={{ flex:1, minWidth:0, padding:'32px 28px', paddingBottom:100 }} className="main-content">
        {(title || action) && (
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, gap:16 }}>
            {title && (
              <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-.03em', color:'var(--ink)', margin:0 }}>{title}</h1>
            )}
            {action && <div style={{ flexShrink:0 }}>{action}</div>}
          </div>
        )}
        {children}
      </main>
      <BottomNav />
      <style>{`
        @media (max-width: 767px) {
          .main-content { padding: 24px 16px 100px !important; }
        }
      `}</style>
    </div>
  )
}
