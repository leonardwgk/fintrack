import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { StatCard, Card, Badge, Divider, Eyebrow } from '../components/ui/index'
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
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* greeting */}
        <div className="animate-fade-up" style={{ marginBottom: 22 }}>
          <Eyebrow>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</Eyebrow>
          <h1 className="serif" style={{ fontSize: 'clamp(24px, 6vw, 30px)', fontWeight: 600, letterSpacing: '-.02em', margin: '2px 0 0', color: 'var(--ink)', lineHeight: 1.1 }}>
            Selamat {greeting}, {firstName}.
          </h1>
        </div>

        {/* net worth hero — the number is the thesis */}
        <div className="animate-fade-up animate-delay-100" style={{
          background: 'var(--ink)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(24px, 6vw, 34px)',
          marginBottom: 14,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(181,138,62,.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -70, right: 70, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,.02)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.55)', margin: '0 0 10px' }}>Kekayaan bersih</p>
            {loading
              ? <div className="skeleton" style={{ height: 46, width: 240, background: 'rgba(255,255,255,.1)' }} />
              : <>
                  <p className="mono" style={{ color: '#fff', fontSize: 'clamp(30px, 9vw, 46px)', fontWeight: 500, letterSpacing: '-.03em', margin: 0, lineHeight: 1 }}>
                    {formatCurrency(netWorth)}
                  </p>
                  <span className="tick" style={{ marginTop: 14 }} />
                </>
            }
            <div style={{ display: 'flex', gap: 28, marginTop: 18, flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, margin: '0 0 3px', letterSpacing: '.04em' }}>Aset</p>
                {loading
                  ? <div className="skeleton" style={{ height: 16, width: 100, background: 'rgba(255,255,255,.1)' }} />
                  : <p className="mono" style={{ color: '#7bd3a8', fontSize: 14, fontWeight: 500, margin: 0 }}>+{formatCurrency(totalAssets)}</p>}
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, margin: '0 0 3px', letterSpacing: '.04em' }}>Liabilitas</p>
                {loading
                  ? <div className="skeleton" style={{ height: 16, width: 100, background: 'rgba(255,255,255,.1)' }} />
                  : <p className="mono" style={{ color: '#e89177', fontSize: 14, fontWeight: 500, margin: 0 }}>−{formatCurrency(totalLiabilities)}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* monthly summary */}
        <div className="animate-fade-up animate-delay-200" style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Eyebrow>{currentMonthLabel()}</Eyebrow>
            {!loading && savingsRate !== 0 && (
              <Badge accent={savingsRate >= 20 ? 'green' : savingsRate > 0 ? 'amber' : 'red'}>
                Saving rate {savingsRate}%
              </Badge>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="stats-grid">
            <StatCard label="Pemasukan"    value={formatCurrency(monthlyIncome)}  accent="green"                              loading={loading} sub="bulan ini" />
            <StatCard label="Pengeluaran"  value={formatCurrency(monthlyExpense)} accent="red"                                loading={loading} sub="bulan ini" />
            <StatCard label="Saldo bersih" value={formatCurrency(netBalance)}     accent={netBalance >= 0 ? 'brass' : 'red'}  loading={loading} sub={netBalance >= 0 ? 'Surplus' : 'Defisit'} />
          </div>
        </div>

        {/* bottom row */}
        <div className="animate-fade-up animate-delay-300" style={{ display: 'grid', gap: 14, marginTop: 16 }}>

          {/* recent transactions — ledger */}
          <Card style={{ padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '17px 22px' }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Transaksi terbaru</p>
              <Link to="/transactions" style={{ fontSize: 12.5, color: 'var(--brass)', textDecoration: 'none', fontWeight: 500 }}>Lihat semua →</Link>
            </div>
            <Divider />

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%' }} />
                    <div>
                      <div className="skeleton" style={{ height: 12, width: 120, marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 10, width: 70 }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ height: 12, width: 80 }} />
                </div>
              ))
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center' }}>
                <p style={{ fontSize: 13.5, color: 'var(--ink-faint)', margin: '0 0 6px' }}>Belum ada transaksi</p>
                <Link to="/transactions" style={{ fontSize: 12.5, color: 'var(--brass)', textDecoration: 'none', fontWeight: 500 }}>Tambah transaksi pertama →</Link>
              </div>
            ) : (
              recentTransactions.map((tx, i) => (
                <div key={tx.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 22px', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: tx.categories?.color || (tx.type === 'income' ? 'var(--green-soft)' : 'var(--surface-2)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
                      }}>
                        {tx.categories?.icon || (tx.type === 'income' ? '↑' : '↓')}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx.notes || tx.categories?.name || '—'}
                        </p>
                        <p style={{ fontSize: 11.5, color: 'var(--ink-muted)', margin: 0 }}>
                          {tx.categories?.name && tx.notes ? tx.categories.name + ' · ' : ''}{formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <span className="mono" style={{ fontSize: 13.5, fontWeight: 500, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)', flexShrink: 0 }}>
                      {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                  {i < recentTransactions.length - 1 && <Divider />}
                </div>
              ))
            )}
          </Card>

          {/* quick actions */}
          <Card style={{ padding: '18px 22px' }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', margin: '0 0 14px' }}>Aksi cepat</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="quick-actions">
              {[
                { label: 'Tambah transaksi', to: '/transactions', icon: '＋', bg: 'var(--ink)',        color: '#fff' },
                { label: 'Atur jatah',       to: '/allowance',    icon: '◐',  bg: 'var(--brass-soft)', color: 'var(--brass)' },
                { label: 'Set budget',       to: '/budgets',      icon: '◎',  bg: 'var(--amber-soft)', color: 'var(--amber)' },
                { label: 'Tambah goal',      to: '/goals',        icon: '◈',  bg: 'var(--green-soft)', color: 'var(--green)' },
              ].map(({ label, to, icon, bg, color }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    background: bg, color, borderRadius: 'var(--radius-md)',
                    padding: '15px 14px', display: 'flex', flexDirection: 'column', gap: 9,
                    textDecoration: 'none', transition: 'transform .12s, opacity .15s', fontSize: 12, fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '.85' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ lineHeight: 1.3 }}>{label}</span>
                </Link>
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
