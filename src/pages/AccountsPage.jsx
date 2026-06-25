import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, Badge, EmptyState, Divider } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import AccountForm from '../components/accounts/AccountForm'
import { useAccounts } from '../hooks/useAccounts'
import { formatCurrency } from '../lib/format'

const TYPE_LABELS = {
  bank: 'Bank', cash: 'Tunai', 'e-wallet': 'E-Wallet', credit_card: 'Kartu Kredit',
  loan: 'Pinjaman', investment: 'Investasi', crypto: 'Kripto', other: 'Lainnya',
}

function AccountRow({ account, onEdit, onDelete }) {
  const isLiability = account.category === 'liability'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
          {account.icon || '🏦'}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.name}</p>
          <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>{TYPE_LABELS[account.type] || account.type}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)', color: isLiability ? 'var(--red)' : 'var(--ink)' }}>
          {isLiability ? '-' : ''}{formatCurrency(account.balance)}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onEdit(account)} title="Edit" style={iconBtn}>✎</button>
          <button onClick={() => onDelete(account)} title="Hapus" style={iconBtn}>🗑</button>
        </div>
      </div>
    </div>
  )
}

const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)',
  fontSize: 13, padding: '4px 6px', borderRadius: 6, lineHeight: 1,
}

export default function AccountsPage() {
  const { assets, liabilities, totalAssets, totalLiabilities, netWorth, loading, create, update, remove } = useAccounts()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (acc) => { setEditing(acc); setModalOpen(true) }

  const handleSubmit = async (values) => {
    if (editing) await update(editing.id, values)
    else await create(values)
    setModalOpen(false)
  }

  const handleDelete = async (acc) => {
    if (window.confirm(`Hapus akun "${acc.name}"? Akun akan dinonaktifkan.`)) await remove(acc.id)
  }

  const renderSection = (title, items, accent) => (
    <Card style={{ padding: 0, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{title}</p>
        <Badge accent={accent}>{items.length}</Badge>
      </div>
      <Divider />
      {items.length === 0
        ? <p style={{ fontSize: 13, color: 'var(--ink-faint)', padding: '24px 22px', textAlign: 'center', margin: 0 }}>Belum ada</p>
        : items.map((a, i) => (
            <div key={a.id}>
              <AccountRow account={a} onEdit={openEdit} onDelete={handleDelete} />
              {i < items.length - 1 && <Divider />}
            </div>
          ))}
    </Card>
  )

  return (
    <AppLayout title="Akun" action={<Button onClick={openCreate}>＋ Tambah akun</Button>}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }} className="stats-grid">
          <div style={summaryBox}>
            <p style={summaryLabel}>Total aset</p>
            <p style={{ ...summaryValue, color: 'var(--green)' }}>{formatCurrency(totalAssets)}</p>
          </div>
          <div style={summaryBox}>
            <p style={summaryLabel}>Total liabilitas</p>
            <p style={{ ...summaryValue, color: 'var(--red)' }}>{formatCurrency(totalLiabilities)}</p>
          </div>
          <div style={{ ...summaryBox, background: 'var(--ink)' }}>
            <p style={{ ...summaryLabel, color: 'rgba(255,255,255,.45)' }}>Net worth</p>
            <p style={{ ...summaryValue, color: 'white' }}>{formatCurrency(netWorth)}</p>
          </div>
        </div>

        {loading ? (
          <Card style={{ padding: 0 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ padding: '16px 22px' }}><div className="skeleton" style={{ height: 16, width: '50%' }} /></div>
            ))}
          </Card>
        ) : assets.length === 0 && liabilities.length === 0 ? (
          <Card>
            <EmptyState
              icon="🏦"
              title="Belum ada akun"
              description="Tambah rekening, dompet, atau kartu kredit untuk mulai melacak saldo dan net worth."
              action={<Button onClick={openCreate}>＋ Tambah akun pertama</Button>}
            />
          </Card>
        ) : (
          <>
            {renderSection('Aset', assets, 'green')}
            {renderSection('Liabilitas', liabilities, 'red')}
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit akun' : 'Tambah akun'}>
        <AccountForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>

      <style>{`
        @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </AppLayout>
  )
}

const summaryBox = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }
const summaryLabel = { fontSize: 11, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 8px', letterSpacing: '.06em', textTransform: 'uppercase' }
const summaryValue = { fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-.02em', fontFamily: 'var(--font-mono)' }
