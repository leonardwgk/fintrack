import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, EmptyState, ProgressBar, Badge } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import GoalForm from '../components/goals/GoalForm'
import { useGoals } from '../hooks/useGoals'
import { formatCurrency, formatDate } from '../lib/format'

export default function GoalsPage() {
  const { goals, loading, create, update, remove, addFunds } = useGoals()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (g) => { setEditing(g); setModalOpen(true) }

  const handleSubmit = async (values) => {
    if (editing) await update(editing.id, values)
    else await create(values)
    setModalOpen(false)
  }

  const handleDelete = async (g) => {
    if (window.confirm(`Hapus goal "${g.name}"?`)) await remove(g.id)
  }

  const handleAddFunds = async (g) => {
    const input = window.prompt(`Tambah dana ke "${g.name}" (Rp):`, '')
    if (input == null) return
    const amount = Number(input.replace(/[^\d.]/g, ''))
    if (amount > 0) await addFunds(g, amount)
  }

  return (
    <AppLayout title="Goals" action={<Button onClick={openCreate}>＋ Buat goal</Button>}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {loading ? (
          <Card style={{ padding: '20px 22px' }}><div className="skeleton" style={{ height: 16, width: '50%' }} /></Card>
        ) : goals.length === 0 ? (
          <Card>
            <EmptyState
              icon="◈"
              title="Belum ada goal"
              description="Buat target tabungan—dana darurat, liburan, gadget baru—dan pantau progresnya."
              action={<Button onClick={openCreate}>＋ Buat goal pertama</Button>}
            />
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {goals.map((g) => {
              const pct = Number(g.target_amount) > 0 ? Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100) : 0
              const done = g.status === 'completed' || pct >= 100
              return (
                <Card key={g.id} style={{ padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {g.icon || '🎯'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px', letterSpacing: '-.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</p>
                        {g.target_date && <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>Target {formatDate(g.target_date)}</p>}
                      </div>
                    </div>
                    {done && <Badge accent="green">Tercapai</Badge>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>{formatCurrency(g.current_amount)}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>dari {formatCurrency(g.target_amount)}</span>
                  </div>
                  <ProgressBar value={pct} accent={done ? 'green' : 'blue'} height={10} />
                  <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: '8px 0 0' }}>{pct}% tercapai</p>

                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    {!done && <Button size="sm" variant="primary" onClick={() => handleAddFunds(g)} style={{ flex: 1, justifyContent: 'center' }}>＋ Tambah dana</Button>}
                    <Button size="sm" variant="secondary" onClick={() => openEdit(g)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(g)}>🗑</Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit goal' : 'Buat goal'}>
        <GoalForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </AppLayout>
  )
}
