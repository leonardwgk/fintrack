import { useState, useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, EmptyState, Divider } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import TransactionForm from '../components/transactions/TransactionForm'
import { useTransactions } from '../hooks/useTransactions'
import { useAccounts } from '../hooks/useAccounts'
import { useCategories } from '../hooks/useCategories'
import { formatCurrency, formatDate } from '../lib/format'

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export default function TransactionsPage() {
  const tx = useTransactions()
  const { accounts } = useAccounts()
  const { categories } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all') // all | income | expense

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (t) => { setEditing(t); setModalOpen(true) }

  const handleSubmit = async (values) => {
    if (editing) await tx.update(editing.id, values)
    else await tx.create(values)
    setModalOpen(false)
  }

  const handleDelete = async (t) => {
    if (window.confirm('Hapus transaksi ini? Saldo akun akan disesuaikan.')) await tx.remove(t.id)
  }

  const filtered = filter === 'all' ? tx.transactions : tx.transactions.filter((t) => t.type === filter)

  // Group by date for a clean list.
  const grouped = useMemo(() => {
    const map = {}
    for (const t of filtered) { (map[t.date] ||= []).push(t) }
    return Object.entries(map)
  }, [filtered])

  const filterTab = (value, label) => (
    <button
      key={value}
      onClick={() => setFilter(value)}
      style={{
        padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500,
        border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all .15s',
        borderColor: filter === value ? 'var(--ink)' : 'var(--border)',
        background: filter === value ? 'var(--ink)' : 'var(--white)',
        color: filter === value ? 'white' : 'var(--ink-soft)',
      }}
    >
      {label}
    </button>
  )

  return (
    <AppLayout title="Transaksi" action={<Button onClick={openCreate}>＋ Tambah</Button>}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* month navigator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={tx.prevMonth} style={navBtn}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-.02em' }}>{MONTHS[tx.month]} {tx.year}</p>
            <button onClick={tx.goToToday} style={{ fontSize: 11, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Hari ini</button>
          </div>
          <button onClick={tx.nextMonth} style={navBtn}>›</button>
        </div>

        {/* income / expense summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={summaryBox}>
            <p style={summaryLabel}>Pemasukan</p>
            <p style={{ ...summaryValue, color: 'var(--green)' }}>+{formatCurrency(tx.income)}</p>
          </div>
          <div style={summaryBox}>
            <p style={summaryLabel}>Pengeluaran</p>
            <p style={{ ...summaryValue, color: 'var(--red)' }}>-{formatCurrency(tx.expense)}</p>
          </div>
        </div>

        {/* filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {filterTab('all', 'Semua')}
          {filterTab('income', 'Pemasukan')}
          {filterTab('expense', 'Pengeluaran')}
        </div>

        {tx.loading ? (
          <Card style={{ padding: 0 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ padding: '14px 22px' }}><div className="skeleton" style={{ height: 16, width: '60%' }} /></div>
            ))}
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon="↕"
              title="Belum ada transaksi"
              description={`Tidak ada transaksi di ${MONTHS[tx.month]} ${tx.year}.`}
              action={<Button onClick={openCreate}>＋ Tambah transaksi</Button>}
            />
          </Card>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 8px', letterSpacing: '.04em', textTransform: 'uppercase' }}>{formatDate(date)}</p>
              <Card style={{ padding: 0 }}>
                {items.map((t, i) => (
                  <div key={t.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.categories?.color || 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                          {t.categories?.icon || (t.type === 'income' ? '↑' : '↓')}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.notes || t.categories?.name || '—'}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>
                            {t.categories?.name || 'Tanpa kategori'} · {t.accounts?.name || '—'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-mono)', color: t.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                        <div style={{ display: 'flex', gap: 2 }}>
                          <button onClick={() => openEdit(t)} title="Edit" style={iconBtn}>✎</button>
                          <button onClick={() => handleDelete(t)} title="Hapus" style={iconBtn}>🗑</button>
                        </div>
                      </div>
                    </div>
                    {i < items.length - 1 && <Divider />}
                  </div>
                ))}
              </Card>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit transaksi' : 'Tambah transaksi'}>
        <TransactionForm initial={editing} accounts={accounts} categories={categories} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </AppLayout>
  )
}

const navBtn = { width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--white)', cursor: 'pointer', fontSize: 18, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 13, padding: '4px 6px', borderRadius: 6, lineHeight: 1 }
const summaryBox = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }
const summaryLabel = { fontSize: 11, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 8px', letterSpacing: '.06em', textTransform: 'uppercase' }
const summaryValue = { fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-.02em', fontFamily: 'var(--font-mono)' }
