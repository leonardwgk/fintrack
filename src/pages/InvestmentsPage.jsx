import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, EmptyState, Divider } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import InvestmentForm from '../components/investments/InvestmentForm'
import { useInvestments } from '../hooks/useInvestments'
import { formatCurrency } from '../lib/format'

const TYPE_LABELS = {
  stock: 'Saham', crypto: 'Kripto', mutual_fund: 'Reksa Dana',
  bond: 'Obligasi', gold: 'Emas', property: 'Properti', other: 'Lainnya',
}

export default function InvestmentsPage() {
  const { investments, totalValue, totalCost, totalGain, totalGainPct, loading, create, update, remove } = useInvestments()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (inv) => { setEditing(inv); setModalOpen(true) }

  const handleSubmit = async (values) => {
    if (editing) await update(editing.id, values)
    else await create(values)
    setModalOpen(false)
  }

  const handleDelete = async (inv) => {
    if (window.confirm(`Hapus "${inv.name}" dari portofolio?`)) await remove(inv.id)
  }

  const gainColor = (v) => (v >= 0 ? 'var(--green)' : 'var(--red)')
  const fmtPct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`

  return (
    <AppLayout title="Investasi" action={<Button onClick={openCreate}>＋ Tambah aset</Button>}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* portfolio hero */}
        {!loading && investments.length > 0 && (
          <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius-xl)', padding: '26px 30px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.03)' }} />
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Nilai portofolio</p>
            <p style={{ color: 'white', fontSize: 34, fontWeight: 600, letterSpacing: '-.04em', margin: '0 0 12px', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>{formatCurrency(totalValue)}</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: '0 0 2px' }}>Modal</p>
                <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 14, fontWeight: 500, margin: 0, fontFamily: 'var(--font-mono)' }}>{formatCurrency(totalCost)}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: '0 0 2px' }}>Untung / rugi</p>
                <p style={{ color: totalGain >= 0 ? '#4ade80' : '#f87171', fontSize: 14, fontWeight: 500, margin: 0, fontFamily: 'var(--font-mono)' }}>
                  {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)} ({fmtPct(totalGainPct)})
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Card style={{ padding: '20px 22px' }}><div className="skeleton" style={{ height: 16, width: '50%' }} /></Card>
        ) : investments.length === 0 ? (
          <Card>
            <EmptyState
              icon="◆"
              title="Belum ada investasi"
              description="Lacak saham, kripto, reksa dana, atau emas. Masukkan harga terkini untuk melihat untung/rugi."
              action={<Button onClick={openCreate}>＋ Tambah aset pertama</Button>}
            />
          </Card>
        ) : (
          <Card style={{ padding: 0 }}>
            {investments.map((inv, i) => (
              <div key={inv.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.name} {inv.ticker && <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>{inv.ticker}</span>}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>
                      {TYPE_LABELS[inv.type] || inv.type} · {Number(inv.quantity)} unit @ {formatCurrency(inv.avg_buy_price)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--ink)', margin: '0 0 2px' }}>{formatCurrency(inv.value)}</p>
                      <p style={{ fontSize: 11, fontWeight: 500, margin: 0, color: gainColor(inv.gain), fontFamily: 'var(--font-mono)' }}>
                        {inv.gain >= 0 ? '+' : ''}{formatCurrency(inv.gain)} ({fmtPct(inv.gainPct)})
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button onClick={() => openEdit(inv)} title="Edit" style={iconBtn}>✎</button>
                      <button onClick={() => handleDelete(inv)} title="Hapus" style={iconBtn}>🗑</button>
                    </div>
                  </div>
                </div>
                {i < investments.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit aset' : 'Tambah aset'}>
        <InvestmentForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </AppLayout>
  )
}

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 13, padding: '4px 6px', borderRadius: 6, lineHeight: 1 }
