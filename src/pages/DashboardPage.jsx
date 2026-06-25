import AppLayout from '../components/layout/AppLayout'
import { StatCard, Card, Badge, Divider } from '../components/ui/index'
import { useDashboard } from '../hooks/useDashboard'
import { useAuthStore } from '../store/authStore'
import { formatCurrency, formatDate, currentMonthLabel } from '../lib/format'

export default function DashboardPage() {
  const { profile } = useAuthStore()
  const {
    netWorth, totalAssets, totalLiabilities,
    monthlyIncome, monthlyExpense, netBalance,
    recentTransactions, loading,
  } = useDashboard()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Pagi' : hour < 17 ? 'Siang' : 'Malam'
  const firstName = profile?.full_name?.split(' ')[0] || 'Leon'

  const savingsRate = monthlyIncome > 0
    ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)
    : 0

  return (
    <AppLayout>
      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* greeting */}
        <div className="animate-fade-up" style={{ marginBottom:28 }}>
          <p style={{ fontSize:12, color:'var(--ink-muted)', letterSpacing:'.06em', textTransform:'uppercase', margin:'0 0 4px' }}>
            {new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long' })}
          </p>
          <h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-.03em', margin:0, color:'var(--ink)' }}>
            Selamat {greeting}, {firstName} 👋
          </h1>
        </div>

        {/* net worth hero card */}
        <div className="animate-fade-up animate-delay-100" style={{
          background: 'var(--ink)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.03)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, right:60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,.02)', pointerEvents:'none' }} />

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, position:'relative', zIndex:1 }}>
            <div>
              <p style={{ color:'rgba(255,255,255,.4)', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', margin:'0 0 8px' }}>Total net worth</p>
              {loading
                ? <div className="skeleton" style={{ height:44, width:220, background:'rgba(255,255,255,.1)' }} />
                : <p style={{ color:'white', fontSize:40, fontWeight:600, letterSpacing:'-.04em', margin:0, lineHeight:1 }}>
                    {formatCurrency(netWorth)}
                  </p>
              }
            </div>
            <div style={{ display:'flex', gap:24 }}>
              <div>
                <p style={{ color:'rgba(255,255,255,.35)', fontSize:11, margin:'0 0 4px', letterSpacing:'.04em' }}>Aset</p>
                {loading
                  ? <div className="skeleton" style={{ height:18, width:100, background:'rgba(255,255,255,.1)' }} />
                  : <p style={{ color:'#4ade80', fontSize:15, fontWeight:500, margin:0 }}>+{formatCurrency(totalAssets)}</p>
                }
              </div>
              <div>
                <p style={{ color:'rgba(255,255,255,.35)', fontSize:11, margin:'0 0 4px', letterSpacing:'.04em' }}>Liabilitas</p>
                {loading
                  ? <div className="skeleton" style={{ height:18, width:100, background:'rgba(255,255,255,.1)' }} />
                  : <p style={{ color:'#f87171', fontSize:15, fontWeight:500, margin:0 }}>-{formatCurrency(totalLiabilities)}</p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* monthly summary */}
        <div className="animate-fade-up animate-delay-200">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <p style={{ fontSize:12, fontWeight:500, color:'var(--ink-muted)', margin:0, letterSpacing:'.04em', textTransform:'uppercase' }}>{currentMonthLabel()}</p>
            {!loading && savingsRate !== 0 && (
              <Badge accent={savingsRate >= 20 ? 'green' : savingsRate > 0 ? 'amber' : 'red'}>
                Saving rate {savingsRate}%
              </Badge>
            )}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }} className="stats-grid">
            <StatCard label="Pemasukan"   value={formatCurrency(monthlyIncome)}  accent="green"                        loading={loading} sub="bulan ini" />
            <StatCard label="Pengeluaran" value={formatCurrency(monthlyExpense)} accent="red"                          loading={loading} sub="bulan ini" />
            <StatCard label="Saldo bersih" value={formatCurrency(netBalance)}    accent={netBalance >= 0 ? 'blue' : 'red'} loading={loading} sub={netBalance >= 0 ? 'Surplus' : 'Defisit'} />
          </div>
        </div>

        {/* bottom row */}
        <div className="animate-fade-up animate-delay-300" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }} id="bottom-row">

          {/* recent transactions */}
          <Card style={{ padding:0, gridColumn:'1 / -1' }} id="recent-tx-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px' }}>
              <p style={{ fontSize:13, fontWeight:500, color:'var(--ink)', margin:0 }}>Transaksi terbaru</p>
              <a href="/transactions" style={{ fontSize:12, color:'var(--blue)', textDecoration:'none' }}>Lihat semua →</a>
            </div>
            <Divider />

            {loading ? (
              Array.from({length:4}).map((_,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div className="skeleton" style={{ width:36, height:36, borderRadius:'50%' }} />
                    <div>
                      <div className="skeleton" style={{ height:12, width:120, marginBottom:6 }} />
                      <div className="skeleton" style={{ height:10, width:70 }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ height:12, width:80 }} />
                </div>
              ))
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding:'40px 22px', textAlign:'center' }}>
                <p style={{ fontSize:13, color:'var(--ink-faint)', margin:'0 0 6px' }}>Belum ada transaksi</p>
                <a href="/transactions" style={{ fontSize:12, color:'var(--blue)', textDecoration:'none' }}>Tambah transaksi pertama →</a>
              </div>
            ) : (
              recentTransactions.map((tx, i) => (
                <div key={tx.id}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 22px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{
                        width:36, height:36, borderRadius:'50%',
                        background: tx.categories?.color || (tx.type === 'income' ? 'var(--green-soft)' : 'var(--surface-2)'),
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0,
                      }}>
                        {tx.categories?.icon || (tx.type === 'income' ? '↑' : '↓')}
                      </div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:500, color:'var(--ink)', margin:'0 0 2px' }}>
                          {tx.notes || tx.categories?.name || '—'}
                        </p>
                        <p style={{ fontSize:11, color:'var(--ink-muted)', margin:0 }}>
                          {tx.categories?.name && tx.notes ? tx.categories.name + ' · ' : ''}{formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize:13, fontWeight:500, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                  {i < recentTransactions.length - 1 && <Divider />}
                </div>
              ))
            )}
          </Card>

          {/* quick actions */}
          <Card style={{ padding:'18px 22px', gridColumn:'1 / -1' }}>
            <p style={{ fontSize:13, fontWeight:500, color:'var(--ink)', margin:'0 0 14px' }}>Aksi cepat</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }} className="quick-actions">
              {[
                { label:'Tambah transaksi', href:'/transactions', icon:'＋', bg:'var(--ink)',         color:'white'           },
                { label:'Kelola akun',      href:'/accounts',     icon:'🏦', bg:'var(--purple-soft)', color:'var(--purple)'   },
                { label:'Set budget',       href:'/budgets',      icon:'◎',  bg:'var(--amber-soft)',  color:'var(--amber)'    },
                { label:'Tambah goal',      href:'/goals',        icon:'◈',  bg:'var(--green-soft)',  color:'var(--green)'    },
              ].map(({ label, href, icon, bg, color }) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    background:bg, color, borderRadius:'var(--radius-md)',
                    padding:'14px', display:'flex', flexDirection:'column', gap:8,
                    textDecoration:'none', transition:'opacity .15s', fontSize:12, fontWeight:500,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <span style={{ lineHeight:1.3 }}>{label}</span>
                </a>
              ))}
            </div>
          </Card>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid > *:last-child { grid-column: 1 / -1; }
          .quick-actions { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </AppLayout>
  )
}
