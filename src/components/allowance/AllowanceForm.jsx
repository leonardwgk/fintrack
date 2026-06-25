import { useState } from 'react'
import { Field, Input, Select, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

export default function AllowanceForm({ initial, accounts, onSubmit, onCancel }) {
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [accountId, setAccountId] = useState(initial?.account_id || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit({ amount: Number(amount) || 0, account_id: accountId || null })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan jatah.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="Jatah bulanan (untuk needs)" hint="Uang yang kamu sisakan di rekening sebagai jatah bulan ini." required>
        <Input type="number" step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required autoFocus />
      </Field>

      <Field label="Rekening jatah" hint="Pengeluaran dari rekening ini dihitung sebagai pemakaian jatah.">
        <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          <option value="">— semua rekening —</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
          ))}
        </Select>
      </Field>

      {error && <p style={{ fontSize: 13, color: 'var(--red)', margin: 0 }}>{error}</p>}

      <FormActions>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
      </FormActions>
    </form>
  )
}
