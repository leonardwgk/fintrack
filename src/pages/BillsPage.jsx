import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, EmptyState, Badge, Divider } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import BillForm from '../components/bills/BillForm'
import { useBills } from '../hooks/useBills'
import { useAccounts } from '../hooks/useAccounts'
import { formatCurrency } from '../lib/format'

const FREQ_LABELS = { weekly: '/minggu', monthly: '/bulan', quarterly: '/kuartal', yearly: '/tahun' }

export default function BillsPage() {
  const { bills, monthlyTotal, yearlyTotal, loading, create, update, remove } = useBills()
  const { accounts } = useAccounts()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (b) => { setEditing(b); setModalOpen(true) }

  const handleSubmit = async (values) => {
    if (editing) await update(editing.id, values)
    else await create(values)
    setModalOpen(false)
  }

  const handleDelete = async (b) => {
    if (window.confirm(`Hapus "${b.name}"?`)) await remove(b.id)
  }

  const subscriptions = bills.filter((b) => b.billing_type === 'subscription')
  const plainBills = bills.filter((b) => b.billing_type === 'bill')

  const renderRow = (bill) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
          {bill.billing_type === 'subscription' ? '↻' : '🧾'}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bill.name}</p>
          <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>
            {bill.due_day ? `Jatuh tempo tgl ${bill.due_day}` : 'Tanpa tanggal'}{bill.accounts?.name ? ` · ${bill.accounts.name}` : ''}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
          {formatCurrency(bill.amount)}<span style={{ fontSize: 11, color: 'var(--ink-muted)', fontFamily: 'var(--font-sans)' }}>{FREQ_LABELS[bill.frequency]}</span>
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => openEdit(bill)} title="Edit" style={iconBtn}>✎</button>
          <button onClick={() => handleDelete(bill)} title="Hapus" style={iconBtn}>🗑</button>
        </div>
      </div>
    </div>
  )

  const renderSection = (title, items, accent) => (
    <Card style={{ padding: 0, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{title}</p>
        <Badge accent={accent}>{items.length}</Badge>
      </div>
      <Divider />
      {items.map((b, i) => (
        <div key={b.id}>
          {renderRow(b)}
          {i < items.length - 1 && <Divider />}
        </div>
      ))}
    </Card>
  )

  return (
    <AppLayout title="Tagihan & Langganan" action={<Button onClick={openCreate}>＋ Tambah</Button>}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={summaryBox}>
            <p style={summaryLabel}>Per bulan</p>
            <p style={summaryValue}>{formatCurrency(monthlyTotal)}</p>
          </div>
          <div style={summaryBox}>
            <p style={summaryLabel}>Per tahun</p>
            <p style={summaryValue}>{formatCurrency(yearlyTotal)}</p>
          </div>
        </div>

        {loading ? (
          <Card style={{ padding: '20px 22px' }}><div className="skeleton" style={{ height: 16, width: '50%' }} /></Card>
        ) : bills.length === 0 ? (
          <Card>
            <EmptyState
              icon="↻"
              title="Belum ada tagihan"
              description="Catat langganan dan tagihan rutin agar tahu total pengeluaran tetap tiap bulan."
              action={<Button onClick={openCreate}>＋ Tambah tagihan</Button>}
            />
          </Card>
        ) : (
          <>
            {subscriptions.length > 0 && renderSection('Langganan', subscriptions, 'purple')}
            {plainBills.length > 0 && renderSection('Tagihan', plainBills, 'amber')}
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit tagihan' : 'Tambah tagihan'}>
        <BillForm initial={editing} accounts={accounts} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </AppLayout>
  )
}

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 13, padding: '4px 6px', borderRadius: 6, lineHeight: 1 }
const summaryBox = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }
const summaryLabel = { fontSize: 11, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 8px', letterSpacing: '.06em', textTransform: 'uppercase' }
const summaryValue = { fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-.02em', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }
