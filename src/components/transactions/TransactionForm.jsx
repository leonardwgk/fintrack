import { useState } from 'react'
import { Field, Input, Select, Textarea, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

const today = () => new Date().toISOString().split('T')[0]

export default function TransactionForm({ initial, accounts, categories, onSubmit, onCancel }) {
  const [type, setType] = useState(initial?.type || 'expense')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [accountId, setAccountId] = useState(initial?.account_id || accounts[0]?.id || '')
  const [categoryId, setCategoryId] = useState(initial?.category_id || '')
  const [date, setDate] = useState(initial?.date || today())
  const [notes, setNotes] = useState(initial?.notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const visibleCategories = categories.filter((c) => c.type === type)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!accountId) { setError('Buat akun terlebih dahulu sebelum mencatat transaksi.'); return }
    setSaving(true)
    try {
      await onSubmit({
        type,
        amount: Number(amount),
        account_id: accountId,
        category_id: categoryId || null,
        date,
        notes: notes.trim() || null,
      })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Segmented income/expense toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { value: 'expense', label: 'Pengeluaran', accent: 'var(--red)' },
          { value: 'income', label: 'Pemasukan', accent: 'var(--green)' },
        ].map((opt) => {
          const active = type === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setType(opt.value); setCategoryId('') }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${active ? opt.accent : 'var(--border)'}`,
                background: active ? opt.accent : 'var(--white)',
                color: active ? 'white' : 'var(--ink-soft)',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <Field label="Jumlah" required>
        <Input type="number" step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required autoFocus />
      </Field>

      <Field label="Akun" required>
        <Select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          {accounts.length === 0 && <option value="">— belum ada akun —</option>}
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
          ))}
        </Select>
      </Field>

      <Field label="Kategori">
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">— tanpa kategori —</option>
          {visibleCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </Select>
      </Field>

      <Field label="Tanggal" required>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Field>

      <Field label="Catatan">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional" />
      </Field>

      {error && <p style={{ fontSize: 13, color: 'var(--red)', margin: 0 }}>{error}</p>}

      <FormActions>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Menyimpan…' : initial ? 'Simpan' : 'Tambah'}</Button>
      </FormActions>
    </form>
  )
}
