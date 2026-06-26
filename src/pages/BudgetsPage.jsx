import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, EmptyState, ProgressBar, Badge } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import BudgetForm from '../components/budgets/BudgetForm'
import { useBudgets } from '../hooks/useBudgets'
import { useCategories } from '../hooks/useCategories'
import { formatCurrency, currentMonthLabel } from '../lib/format'

export default function BudgetsPage() {
  const { budgets, totalBudget, totalSpent, loading, create, update, remove } = useBudgets()
  const { categories } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (b) => { setEditing(b); setModalOpen(true) }

  const handleSubmit = async (values) => {
    if (editing) await update(editing.id, { amount: values.amount, budget_type: values.budget_type })
    else await create(values)
    setModalOpen(false)
  }

  const handleDelete = async (b) => {
    if (window.confirm(`Hapus budget "${b.categories?.name}"?`)) await remove(b.id)
  }

  const totalPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const existingCategoryIds = budgets.map((b) => b.category_id)

  return (
    <AppLayout title="Budget" action={<Button onClick={openCreate}>＋ Set budget</Button>}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 16px', letterSpacing: '.04em', textTransform: 'uppercase' }}>{currentMonthLabel()}</p>

        {/* overall */}
        {!loading && budgets.length > 0 && (
          <Card style={{ padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 4px', letterSpacing: '.06em', textTransform: 'uppercase' }}>Total terpakai</p>
                <p style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-.02em', fontFamily: 'var(--font-mono)' }}>{formatCurrency(totalSpent)}</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: 0 }}>dari {formatCurrency(totalBudget)}</p>
            </div>
            <ProgressBar value={totalPct} accent={totalPct > 100 ? 'red' : totalPct > 80 ? 'amber' : 'green'} height={10} />
          </Card>
        )}

        {loading ? (
          <Card style={{ padding: '20px 22px' }}><div className="skeleton" style={{ height: 16, width: '50%' }} /></Card>
        ) : budgets.length === 0 ? (
          <Card>
            <EmptyState
              icon="◎"
              title="Belum ada budget"
              description="Tetapkan batas pengeluaran per kategori untuk bulan ini dan pantau progresnya."
              action={<Button onClick={openCreate}>＋ Set budget pertama</Button>}
            />
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {budgets.map((b) => {
              const over = b.spent > b.limit
              const accent = over ? 'red' : b.pct > 80 ? 'amber' : 'green'
              return (
                <Card key={b.id} style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: b.categories?.color || 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {b.categories?.icon || '◎'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px' }}>{b.categories?.name || 'Kategori'}</p>
                        <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>{formatCurrency(b.spent)} / {formatCurrency(b.limit)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <Badge accent={accent}>{b.pct}%</Badge>
                      <button onClick={() => openEdit(b)} title="Edit" style={iconBtn}>✎</button>
                      <button onClick={() => handleDelete(b)} title="Hapus" style={iconBtn}>🗑</button>
                    </div>
                  </div>
                  <ProgressBar value={b.pct} accent={accent} />
                  <p style={{ fontSize: 11, color: over ? 'var(--red)' : 'var(--ink-muted)', margin: '8px 0 0' }}>
                    {over ? `Lewat ${formatCurrency(b.spent - b.limit)}` : `Sisa ${formatCurrency(b.remaining)}`}
                  </p>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit budget' : 'Set budget'}>
        <BudgetForm initial={editing} categories={categories} existingCategoryIds={existingCategoryIds} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </AppLayout>
  )
}

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 13, padding: '4px 6px', borderRadius: 6, lineHeight: 1 }
