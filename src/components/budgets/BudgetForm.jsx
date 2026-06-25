import { useState } from 'react'
import { Field, Input, Select, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

// Create/edit a fixed monthly budget for an expense category.
export default function BudgetForm({ initial, categories, existingCategoryIds = [], onSubmit, onCancel }) {
  const expenseCategories = categories.filter((c) => c.type === 'expense')
  // When creating, hide categories that already have a budget this month.
  const available = initial
    ? expenseCategories
    : expenseCategories.filter((c) => !existingCategoryIds.includes(c.id))

  const [categoryId, setCategoryId] = useState(initial?.category_id || available[0]?.id || '')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!categoryId) { setError('Pilih kategori.'); return }
    setSaving(true)
    try {
      await onSubmit({ category_id: categoryId, amount: Number(amount), budget_type: 'fixed' })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan budget.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="Kategori" required>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={!!initial} required>
          {available.length === 0 && <option value="">— semua kategori sudah punya budget —</option>}
          {available.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </Select>
      </Field>

      <Field label="Batas anggaran / bulan" required>
        <Input type="number" step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required autoFocus />
      </Field>

      {error && <p style={{ fontSize: 13, color: 'var(--red)', margin: 0 }}>{error}</p>}

      <FormActions>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Menyimpan…' : initial ? 'Simpan' : 'Set budget'}</Button>
      </FormActions>
    </form>
  )
}
