import AppLayout from '../components/layout/AppLayout'
import StatCard from '../components/ui/StatCard'
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

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Selamat pagi'
    if (h < 17) return 'Selamat siang'
    return 'Selamat malam'
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {greeting()}, {profile?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Ringkasan keuangan kamu hari ini</p>
        </div>

        {/* net worth hero */}
        <div className="rounded-2xl bg-gray-900 text-white p-6">
          <p className="text-xs font-medium text-gray-400 mb-1">Total net worth</p>
          {loading ? (
            <div className="h-9 w-48 bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-semibold tracking-tight">
              {formatCurrency(netWorth)}
            </p>
          )}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-xs text-gray-500">Total aset</p>
              {loading
                ? <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mt-1" />
                : <p className="text-sm font-medium text-green-400">{formatCurrency(totalAssets)}</p>
              }
            </div>
            <div>
              <p className="text-xs text-gray-500">Total liabilitas</p>
              {loading
                ? <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mt-1" />
                : <p className="text-sm font-medium text-red-400">{formatCurrency(totalLiabilities)}</p>
              }
            </div>
          </div>
        </div>

        {/* monthly summary */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">{currentMonthLabel()}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              label="Pemasukan"
              value={formatCurrency(monthlyIncome)}
              accent="green"
              loading={loading}
            />
            <StatCard
              label="Pengeluaran"
              value={formatCurrency(monthlyExpense)}
              accent="red"
              loading={loading}
            />
            <StatCard
              label="Saldo bersih"
              value={formatCurrency(netBalance)}
              accent={netBalance >= 0 ? 'blue' : 'red'}
              sub={netBalance >= 0 ? 'Surplus bulan ini' : 'Defisit bulan ini'}
              loading={loading}
            />
          </div>
        </div>

        {/* recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Transaksi terbaru</h2>
            <a href="/transactions" className="text-xs text-blue-600 hover:underline">Lihat semua</a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                      <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              ))
            ) : recentTransactions.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-gray-400">Belum ada transaksi</p>
                <a href="/transactions" className="text-xs text-blue-600 hover:underline mt-1 block">
                  Tambah transaksi pertama
                </a>
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: tx.categories?.color || '#f3f4f6' }}
                    >
                      {tx.categories?.icon || (tx.type === 'income' ? '↑' : '↓')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {tx.notes || tx.categories?.name || '—'}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* quick actions */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Aksi cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Tambah transaksi', href: '/transactions', icon: '+', color: 'bg-blue-50 text-blue-700' },
              { label: 'Kelola akun',       href: '/accounts',     icon: '🏦', color: 'bg-purple-50 text-purple-700' },
              { label: 'Set budget',        href: '/budgets',      icon: '◎', color: 'bg-amber-50 text-amber-700' },
              { label: 'Tambah goal',       href: '/goals',        icon: '◈', color: 'bg-green-50 text-green-700' },
            ].map(({ label, href, icon, color }) => (
              <a
                key={href}
                href={href}
                className={`rounded-xl p-4 flex flex-col gap-2 ${color} hover:opacity-80 transition-opacity`}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
